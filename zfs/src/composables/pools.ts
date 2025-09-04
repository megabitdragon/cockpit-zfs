import { legacy, ZPool, server, Command, unwrap } from '@45drives/houston-common-lib';
import { convertSizeToBytes } from './helpers';
import { ref } from 'vue';
// @ts-ignore
import get_pools_script from "../scripts/get-pools.py?raw";
// @ts-ignore
import get_importable_pools_script from "../scripts/get-importable-pools.py?raw";
// @ts-ignore
import get_importable_destroyed_pools_script from "../scripts/get-importable-destroyed-pools.py?raw";
import { PoolEditConfig } from '../types';
import { sanitizeRawJson } from '../utils/json';

//['/usr/bin/env', 'python3', '-c', script, ...args ]
const { errorString, useSpawn } = legacy;

export async function getPools() {
	try {
		const state = useSpawn(['/usr/bin/env', 'python3', '-c', get_pools_script], { superuser: 'try' });
		// const pools = (await state.promise()).stdout;
		// // console.log('getPools stdout:', pools);
		// return pools;
		const pools = (await state.promise()).stdout ?? '';
		return sanitizeRawJson(pools, '[]');
	} catch (state) {
		const errorMessage = errorString(state);
		console.error(errorMessage);
		return JSON.stringify({ error: errorMessage }); 
	}
}
  

export async function setRefreservation(pool: ZPool, refreservationPercent: number) {
	try {
		const sizeInBytes = convertSizeToBytes(pool.properties.size);
	
		const refreservationBytes = (sizeInBytes / 100) * refreservationPercent;

		const cmdString = ['zfs', 'set', 'refreservation=' + refreservationBytes, pool.name];
		// console.log('****\ncmdstring:\n', ...cmdString, "\n****");

		const state = useSpawn(cmdString);
		const output = await state.promise();
		// console.log(output)
		return output.stdout;
	
	} catch (state) {
		// console.error(errorString(state));
		// return null;
		const errorMessage = errorString(state);
		console.error(errorMessage);
		return { error: errorMessage };
	}
}

export async function destroyPool(pool: ZPool, forceDestroy?: boolean) {
	try {
		// Build the destroy command
		const cmdArgs = ['zpool', 'destroy'];
		if (forceDestroy) cmdArgs.push('-f');
		cmdArgs.push(pool.name);

		// console.log('Executing command:', cmdArgs.join(' '));

		const result = await unwrap(server.execute(new Command(cmdArgs)));

		if (result.stderr) {
			console.warn('Destroy command warnings:', result.stderr);
		}
		// console.log('Destroy command output:', result.stdout);
		return result.stdout;

	} catch (err: any) {
		console.error('Error during destroyPool:', err);
		const stderr = err.stderr || '';
		const errorMessage = errorString(err);

		// Treat these errors as "already gone" (soft success)
		if (
			stderr.includes("dataset does not exist") ||
			stderr.includes("no such pool") ||
			stderr.includes("cannot open")
		) {
			console.warn(`Pool ${pool.name} already gone. Treating as successful destroy.`);
			return '';
		}

		// Handle busy pool
		if (stderr.includes("is busy")) {
			return { error: 'Pool is busy. Please ensure no active processes are using it and try again.' };
		}

		// Retry on unmount error
		if (stderr.includes("cannot unmount")) {
			console.warn(`Unmount failed for pool: ${pool.name}. Retrying forced unmount...`);

			try {
				const check = await unwrap(server.execute(new Command(['zpool', 'list', '-H', pool.name])));
				await unwrap(server.execute(new Command(['zfs', 'unmount', '-f', pool.name])));
				return destroyPool(pool, true);
			} catch (checkErr: any) {
				if (
					checkErr.stderr?.includes("no such pool") ||
					checkErr.stderr?.includes("dataset does not exist") ||
					checkErr.stderr?.includes("cannot open")
				) {
					console.warn(`Pool ${pool.name} not found after failed destroy. Skipping retry.`);
					return '';
				}

				// Rethrow if the check/unmount failed unexpectedly
				throw checkErr;
			}
		}

		// All other errors
		return { error: errorMessage };
	}
}


const properties = [
	// "ashift",
	"failmode",
	"comment",
	"autoexpand",
	"autoreplace",
	"autotrim",
	// "multihost",
	"delegation",
	"listsnapshots",
]

export async function configurePool(pool: PoolEditConfig) {
	try {
		const hasProperties = hasChanges(pool);
		// console.log('hasProperties:', hasProperties);

		if (hasProperties) {
			for (const property of properties) {
				if (property in pool) {
					// console.log('Setting property:', property);
					let cmdString = ['zpool', 'set'];
					cmdString.push(`${property}=${pool[property]}`);
					cmdString.push(pool.name);
					// console.log('****\ncmdstring:\n', ...cmdString, "\n****");

					const state = useSpawn(cmdString);
					const output = await state.promise();
					// console.log(output);

					await new Promise(resolve => setTimeout(resolve, 250));
				}
			}
		} else {
			console.log("There are no selected properties to change.");
		}

		return { success: true };

	} catch (error: any) {
		const errorMessage = errorString(error);
		console.error(errorMessage);
		return { success: false, error: errorMessage };
	}
}


function hasChanges(pool) {
	for (const property of properties) {
		if (property in pool) {
			return true;
		}
	}
	
	return false;
}

export async function clearErrors(poolName, deviceName?) {
	try {
		let cmdString = ['zpool', 'clear'];
		cmdString.push(poolName);

		if(deviceName) {
			cmdString.push(deviceName);
		}
		
		const state = useSpawn(cmdString);
		const output = await state.promise();
		// console.log(output)
		return output.stdout;
	} catch (state) {
		const errorMessage = errorString(state);
		console.error(errorMessage);
		return { error: errorMessage };
	}
}

export async function trimPool(pool : ZPool, isSecure? : boolean, action? : string) {
	try {
		let cmdString = ['zpool', 'trim'];

		if(isSecure) {
			cmdString.push('-d');
		}

		if(action === 'pause') {
			cmdString.push('-s');
		}

		if(action === 'stop') {
			cmdString.push('-c');
		}

		// cmdString.push('-w');
		cmdString.push(pool.name);
		// console.log('****\ncmdstring:\n', ...cmdString, "\n****");
		
		const state = useSpawn(cmdString);
		const output = await state.promise();
		// console.log(output)
		return output.stdout;
	} catch (state) {
		const errorMessage = errorString(state);
		console.error(errorMessage);
		return { error: errorMessage };
	}
}

export async function scrubPool(pool, action?) {
	try {
		let cmdString = ['zpool', 'scrub'];

		if(action === 'pause') {
			cmdString.push('-p');
		}

		if(action === 'stop') {
			cmdString.push('-s');
		}

		cmdString.push(pool.name);
		// console.log('****\ncmdstring:\n', ...cmdString, "\n****");
		
		const state = useSpawn(cmdString);
		const output = await state.promise();
		// console.log(output)
		return output.stdout;
	} catch (state) {
		const errorMessage = errorString(state);
		console.error(errorMessage);
		return { error: errorMessage };
	}
}

export async function resilverPool(pool) {
	try {
		const state = useSpawn(['zpool', 'resilver', pool.name]);
		const output = await state.promise();
		// console.log(output)
		return output.stdout;
	} catch (state) {
		const errorMessage = errorString(state);
		console.error(errorMessage);
		return { error: errorMessage };
	}
}


export async function exportPool(pool, force?) {
	try {
		let cmdString = ['zpool', 'export'];

		if(force) {
			cmdString.push('-f');
		}

		cmdString.push(pool.name);
		// console.log('****\ncmdstring:\n', ...cmdString, "\n****");
		
		const state = useSpawn(cmdString);
		const output = await state.promise();
		// console.log(output)
		return output.stdout;
	} catch (state) {
		const errorMessage = errorString(state);
		console.error(errorMessage);
		return { error: errorMessage };
	}
}

export async function getImportablePools() {
	try {
		const state = useSpawn(['/usr/bin/env', 'python3', '-c', get_importable_pools_script], { superuser: 'try' });
		// const pools = (await state.promise()).stdout;
		// return pools;
		const pools = (await state.promise()).stdout ?? '';
		return sanitizeRawJson(pools, '[]');
	} catch (state) {
		const errorMessage = errorString(state);
		console.error(errorMessage);
		return JSON.stringify({ error: errorMessage });
	}
}

export async function getImportableDestroyedPools() {
	try {
		const state = useSpawn(['/usr/bin/env', 'python3', '-c', get_importable_destroyed_pools_script], { superuser: 'try' });
		// const pools = (await state.promise()).stdout;
		// return pools;
		const pools = (await state.promise()).stdout ?? '';
		return sanitizeRawJson(pools, '[]');
	} catch (state) {
		const errorMessage = errorString(state);
		console.error(errorMessage);
		return JSON.stringify({ error: errorMessage });
	}
}

export async function importPool(pool) {
	// console.log("hello from import pool")
	try {
		let cmdString = ['zpool', 'import'];

		if(pool.isDestroyed) {
			cmdString.push('-Df');
		}

		if(pool.forceImport) {
			cmdString.push('-f');
		}

		if(pool.ignoreMissingLog) {
			cmdString.push('-m');
		}

		if(!pool.mountFileSystems) {
			cmdString.push('-N');
		}
	
		if(pool.recoveryMode) {
			cmdString.push('-F');
		}

		cmdString.push('-d');

		cmdString.push('/dev/disk/by-vdev');
		cmdString.push('-d', '/dev/disk/by-path');
		cmdString.push('-d', '/dev');
		

		if(pool.altRoot != '') {
			cmdString.push('-o', 'altroot=' + pool.altRoot);
		}

		if(pool.readOnly) {
			cmdString.push('-o', 'readonly=on')
		}

		cmdString.push(pool.poolGUID);

		if(pool.renamePool) {
			cmdString.push(pool.newPoolName);
		}

		// console.log('****\ncmdstring:\n', ...cmdString, "\n****");
		
		const state = useSpawn(cmdString);
		const output = await state.promise();
		// console.log(output)
		return output.stdout;
	} catch (state) {
		const errorMessage = errorString(state);
		console.error(errorMessage);
		return { error: errorMessage };
	}
}


export async function removeVDevFromPool(vdev, pool) {
	try {
		let cmdString = ['zpool', 'remove'];

		cmdString.push(pool.name);
		cmdString.push(vdev.name);

		// console.log('****\ncmdstring:\n', ...cmdString, "\n****");

		const state = useSpawn(cmdString);
		const output = await state.promise();
		// console.log(output)
		return output.stdout;
	} catch (state) {
		// console.error(errorString(state));
		// return null;
		const errorMessage = errorString(state);
		console.error(errorMessage);
		return { error: errorMessage };
	}
}

export async function upgradePool(pool) {
	try {
		const state = useSpawn(['zpool', 'upgrade', pool.name]);
		const output = await state.promise();
		// console.log(output)
		return output.stdout;
	} catch (state) {
		const errorMessage = errorString(state);
		console.error(errorMessage);
		return { error: errorMessage };
	}
}