import { legacy, ZPool } from '@45drives/houston-common-lib';
import { convertSizeToBytes } from './helpers';
import { ref } from 'vue';
// @ts-ignore
import get_pools_script from "../scripts/get-pools.py?raw";
// @ts-ignore
import get_importable_pools_script from "../scripts/get-importable-pools.py?raw";
// @ts-ignore
import get_importable_destroyed_pools_script from "../scripts/get-importable-destroyed-pools.py?raw";
import { PoolEditConfig } from '../types';

//['/usr/bin/env', 'python3', '-c', script, ...args ]
const { errorString, useSpawn } = legacy;

export async function getPools() {
	try {
		const state = useSpawn(['/usr/bin/env', 'python3', '-c', get_pools_script], { superuser: 'try' });
		const pools = (await state.promise()).stdout;
		// console.log('getPools stdout:', pools);
		return pools;
	} catch (state) {
		const errorMessage = errorString(state);
		console.error(errorMessage);
		return JSON.stringify({ error: errorMessage }); 
	}
}

export async function newPool(pool) {
	//need pool (baseBool w/vdevs w/disks) + pooloptions + dataset + datasetoptions

}
  

export async function setRefreservation(pool: ZPool, refreservationPercent: number) {
	try {
		const sizeInBytes = convertSizeToBytes(pool.properties.size);
	
		const refreservationBytes = (sizeInBytes / 100) * refreservationPercent;

		const cmdString = ['zfs', 'set', 'refreservation=' + refreservationBytes, pool.name];
		console.log('****\ncmdstring:\n', ...cmdString, "\n****");

		const state = useSpawn(cmdString);
		const output = await state.promise();
		console.log(output)
		return output.stdout;
	
	} catch (state) {
		// console.error(errorString(state));
		// return null;
		const errorMessage = errorString(state);
		console.error(errorMessage);
		return { error: errorMessage };
	}
}

// export async function destroyPool(pool: ZPool, forceDestroy?: boolean) {
// 	try {
// 		// Force unmount datasets before destruction
// 		// console.log(`Unmounting datasets in pool: ${pool.name}`);
// 		// await useSpawn(['zfs', 'unmount', '-f', pool.name]);

// 		// Destroy the pool
// 		const cmdString = ['zpool', 'destroy'];
// 		if (forceDestroy) {
// 			cmdString.push('-f');
// 		}
// 		cmdString.push(pool.name);

// 		console.log('Executing command:', cmdString.join(' '));

// 		const state = useSpawn(cmdString);
// 		const output = await state.promise();

// 		if (output.stderr) {
// 			console.warn('Destroy command warnings:', output.stderr);
// 		}

// 		console.log('Destroy command output:', output.stdout);
// 		return output.stdout;
// 	} catch (err: any) {
// 		// If unmount error, retry
// 		if (err.stderr && err.stderr.includes('cannot unmount')) {
// 			console.warn(`Unmount failed for pool: ${pool.name}. Retrying...`);
// 			await useSpawn(['zfs', 'unmount', '-f', pool.name]);
// 			return destroyPool(pool, true); // Retry destruction
// 		}

// 		// Handle other errors
// 		console.error('Error during destroyPool:', err);
// 		const errorMessage = errorString(err);
// 		return { error: errorMessage };
// 	}
// }
export async function destroyPool(pool: ZPool, forceDestroy?: boolean) {
	try {
		// Construct the zpool destroy command
		const cmdString = ['zpool', 'destroy'];
		if (forceDestroy) {
			cmdString.push('-f');
		}
		cmdString.push(pool.name);

		console.log('Executing command:', cmdString.join(' '));

		const state = useSpawn(cmdString);
		const output = await state.promise();

		if (output.stderr) {
			console.warn('Destroy command warnings:', output.stderr);
		}

		console.log('Destroy command output:', output.stdout);
		return output.stdout;
	} catch (err: any) {
		console.error('Error during destroyPool:', err);

		const errorMessage = errorString(err);

		// Detect if the error is related to "pool is busy"
		if (err.stderr && err.stderr.includes('is busy')) {
			return { error: 'Pool is busy. Please ensure no active processes are using it and try again.' };
		}

		// If unmount error, try unmounting once and retry destruction
		if (err.stderr && err.stderr.includes('cannot unmount')) {
			console.warn(`Unmount failed for pool: ${pool.name}. Retrying forced unmount...`);
			await useSpawn(['zfs', 'unmount', '-f', pool.name]);
			return destroyPool(pool, true);
		}

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
					console.log('****\ncmdstring:\n', ...cmdString, "\n****");

					const state = useSpawn(cmdString);
					const output = await state.promise();
					console.log(output);

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
		console.log(output)
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
		console.log('****\ncmdstring:\n', ...cmdString, "\n****");
		
		const state = useSpawn(cmdString);
		const output = await state.promise();
		console.log(output)
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
		console.log('****\ncmdstring:\n', ...cmdString, "\n****");
		
		const state = useSpawn(cmdString);
		const output = await state.promise();
		console.log(output)
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
		console.log(output)
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
		console.log('****\ncmdstring:\n', ...cmdString, "\n****");
		
		const state = useSpawn(cmdString);
		const output = await state.promise();
		console.log(output)
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
		const pools = (await state.promise()).stdout;
		return pools;
	} catch (state) {
		const errorMessage = errorString(state);
		console.error(errorMessage);
		return JSON.stringify({ error: errorMessage });
	}
}

export async function getImportableDestroyedPools() {
	try {
		const state = useSpawn(['/usr/bin/env', 'python3', '-c', get_importable_destroyed_pools_script], { superuser: 'try' });
		const pools = (await state.promise()).stdout;
		return pools;
	} catch (state) {
		const errorMessage = errorString(state);
		console.error(errorMessage);
		return JSON.stringify({ error: errorMessage });
	}
}

export async function importPool(pool) {
	console.log("hello from import pool")
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

		console.log('****\ncmdstring:\n', ...cmdString, "\n****");
		
		const state = useSpawn(cmdString);
		const output = await state.promise();
		console.log(output)
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

		console.log('****\ncmdstring:\n', ...cmdString, "\n****");

		const state = useSpawn(cmdString);
		const output = await state.promise();
		console.log(output)
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
		console.log(output)
		return output.stdout;
	} catch (state) {
		const errorMessage = errorString(state);
		console.error(errorMessage);
		return { error: errorMessage };
	}
}