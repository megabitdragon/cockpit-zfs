import { legacy, PoolData } from '@45drives/houston-common-lib';
import { convertSizeToBytes } from './helpers';
import { ref } from 'vue';
// @ts-ignore
import get_pools_script from "../scripts/get-pools.py?raw";
// @ts-ignore
import get_importable_pools_script from "../scripts/get-importable-pools.py?raw";
// @ts-ignore
import get_importable_destroyed_pools_script from "../scripts/get-importable-destroyed-pools.py?raw";

//['/usr/bin/env', 'python3', '-c', script, ...args ]
const { errorString, useSpawn } = legacy;
export async function getPools() {
	try {
		const state = useSpawn(['/usr/bin/env', 'python3', '-c', get_pools_script], { superuser: 'try' });
		const pools = (await state.promise()).stdout;
		return pools;
	} catch (state) {
		const errorMessage = errorString(state);
		console.error(errorMessage);
		return { error: errorMessage };
	}
}


  
// export async function newPool(pool: newPoolData) {
// 	try {
// 		newVDevs.value = [];
// 		newPoolDisks.value = [];

// 		let cmdString = ['zpool', 'create', '-o', 'ashift=' + pool.sectorsize, '-o', 'autoexpand=' + pool.autoexpand, '-o', 'autoreplace=' + pool.autoreplace, '-o', 'autotrim=' + pool.autotrim, '-O', 'aclinherit=passthrough', '-O',
// 			'acltype=posixacl', '-O', 'casesensitivity=sensitive', '-O', 'compression=' + pool.compression, '-O', 'normalization=formD', '-O', 'recordsize=' + pool.recordsize, '-O', 'sharenfs=off', '-O', 'sharesmb=off', '-O', 
// 			'utf8only=on', '-O', 'xattr=sa', '-O', 'dedup=' + pool.dedup, pool.name];

// 		if (pool.forceCreate) {
// 			cmdString.push('-f');
// 		}

// 		if (pool.vdevs[0].type != 'disk') {
// 			pool.vdevs.forEach(vDev => {
// 				if (vDev.isMirror && (vDev.type == 'special' || vDev.type == 'dedup' || vDev.type == 'log')) {
// 					cmdString.push(vDev.type);
// 					cmdString.push('mirror');
// 					vDev.disks.forEach(disk => {
// 						cmdString.push(disk);
// 					});
// 				} else {
// 					cmdString.push(vDev.type);
// 					vDev.disks.forEach(disk => {
// 						cmdString.push(disk);
// 					});
// 				}
// 			});
			
// 		} else {
// 			pool.vdevs.forEach(vDev => {
// 				if (vDev.type == 'disk') {
// 					vDev.disks.forEach(disk => {
// 						if (!newPoolDisks.value.includes(disk)) {
// 							newPoolDisks.value.push(disk);
// 						}
// 					});
// 				} else if (vDev.type == 'cache' || vDev.type == 'log' || vDev.type == 'special' || vDev.type == 'spare' || vDev.type == 'dedup') {
// 					if ((vDev.type == 'log' || vDev.type == 'special' || vDev.type == 'dedup') && vDev.isMirror) {
// 						newVDevData.value.type = vDev.type;
// 						newVDevData.value.isMirror = true;
// 						vDev.disks.forEach(disk => {
// 							newVDevData.value.disks.push(disk);
// 						});
// 						newVDevs.value.push(newVDevData.value);
// 						newVDevData.value = {type: '', disks: [], isMirror: false};			
// 					} else {
// 						newVDevData.value.type = vDev.type;
// 						vDev.disks.forEach(disk => {
// 							newVDevData.value.disks.push(disk);
// 						});
// 						newVDevs.value.push(newVDevData.value);
// 						newVDevData.value = {type: '', disks: [], isMirror: false};
// 					}
// 				}
// 			});

// 			if (newPoolDisks.value.length > 0) {
// 				cmdString.push(...newPoolDisks.value);
// 				if (newVDevs.value.length > 0) {
// 					newVDevs.value.forEach(vDev => {
// 						if (vDev.isMirror) {
// 							cmdString.push(vDev.type);
// 							cmdString.push('mirror');
// 							cmdString.push(...vDev.disks);
// 						} else {
// 							cmdString.push(vDev.type);
// 							cmdString.push(...vDev.disks);
// 						}
// 					});
// 				}
// 			}
// 		}
		
// 		console.log('****\ncmdstring:\n', ...cmdString, "\n****");
		
// 		const state = useSpawn(cmdString);
// 		const output = await state.promise();
// 		console.log(output)
// 		return output.stdout;
	
// 	} catch (state) {
// 		const errorMessage = errorString(state);
// 		console.error(errorMessage);
// 		return { error: errorMessage };
// 	}
// }

export async function setRefreservation(pool: PoolData, refreservationPercent: number) {
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

export async function destroyPool(pool: PoolData, forceDestroy?: boolean) {
	try {
		const cmdString = ['zpool', 'destroy'];

		if(forceDestroy) {
			cmdString.push('-f');
		}
		cmdString.push(pool.name);
		console.log('****\ncmdstring:\n', ...cmdString, "\n****");
		const state = useSpawn(cmdString);
		console.log("before destroy state: ", state) 

		const output = await state.promise();
		console.log("destroy output: ",output)
		return output.stdout;
	} catch (state) {
		const errorMessage = errorString(state);
		console.error(errorMessage);
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

	} catch (state) {
		const errorMessage = errorString(state);  // Assuming errorString formats the error
		console.error(errorMessage);
		return { success: false, error: errorMessage };  // Return error message
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

export async function trimPool(pool : PoolData, isSecure? : boolean, action? : string) {
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

		switch(pool.identifier) {
			case 'vdev_path':
				cmdString.push('/dev/disk/by-vdev');
				break;

			case 'phy_path':
				cmdString.push('/dev/disk/by-path');
				break;

			case 'sd_path':
				cmdString.push('/dev');
				break;
			
			default:
				break;
		}

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