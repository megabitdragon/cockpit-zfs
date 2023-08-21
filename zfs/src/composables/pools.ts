import { useSpawn, errorString } from '@45drives/cockpit-helpers';
import { inject, provide, reactive, ref, Ref, computed, watch } from 'vue';
// @ts-ignore
import get_pools_script from "../scripts/get-pools.py?raw";
// @ts-ignore
import create_pools_script from "./create-pool.py?raw";
import { convertSizeToBytes } from './helpers';

//['/usr/bin/env', 'python3', '-c', script, ...args ]

export async function getPools() {
	try {
		const state = useSpawn(['/usr/bin/env', 'python3', '-c', get_pools_script], { superuser: 'try' });
		const pools = (await state.promise()).stdout;
		return pools;
	} catch (state) {
		console.error(errorString(state));
		return null;
	}
}

/*	OLD METHOD USING py-libzfs API
export async function createPool(poolName : string, vDevs: newVDev[]) {
	try {
		//console.log(vDevs);
		const state = useSpawn(['/usr/bin/env', 'python3', '-c', create_pools_script, poolName, '--vdev-topology', JSON.stringify(vDevs)], { superuser: 'try', stderr: 'out'});
		const output = await state.promise();
		console.log(output)
		return output.stdout;
	} catch (state) {
		console.error(errorString(state));
		return null;
	}
}
*/

const newPoolDisks = ref<string[]>([]);
const newVDevs = ref<newVDevData[]>([]);
const newVDevData = ref<newVDevData>({
	type: '',
	disks: [],
	isMirror: false,
});

export async function newPool(pool: newPoolData) {
	try {
		newVDevs.value = [];
		newPoolDisks.value = [];

		let cmdString = ['zpool', 'create', '-o', 'ashift=' + pool.sectorsize, '-o', 'autoexpand=' + pool.autoexpand, '-o', 'autoreplace=' + pool.autoreplace, '-o', 'autotrim=' + pool.autotrim, '-O', 'aclinherit=passthrough', '-O',
			'acltype=posixacl', '-O', 'casesensitivity=sensitive', '-O', 'compression=' + pool.compression, '-O', 'normalization=formD', '-O', 'recordsize=' + pool.recordsize, '-O', 'sharenfs=off', '-O', 'sharesmb=off', '-O', 
			'utf8only=on', '-O', 'xattr=sa', '-O', 'dedup=' + pool.dedup, pool.name];

		if (pool.forceCreate) {
			cmdString.push('-f');
		}

		if (pool.vdevs[0].type != 'disk') {
			pool.vdevs.forEach(vDev => {
				if (vDev.isMirror && (vDev.type == 'special' || vDev.type == 'dedup' || vDev.type == 'log')) {
					cmdString.push(vDev.type);
					cmdString.push('mirror');
					vDev.disks.forEach(disk => {
						cmdString.push(disk);
					});
				} else {
					cmdString.push(vDev.type);
					vDev.disks.forEach(disk => {
						cmdString.push(disk);
					});
				}
			});
			
		} else {
			pool.vdevs.forEach(vDev => {
				if (vDev.type == 'disk') {
					vDev.disks.forEach(disk => {
						if (!newPoolDisks.value.includes(disk)) {
							newPoolDisks.value.push(disk);
						}
					});
				} else if (vDev.type == 'cache' || vDev.type == 'log' || vDev.type == 'special' || vDev.type == 'spare' || vDev.type == 'dedup') {
					if ((vDev.type == 'log' || vDev.type == 'special' || vDev.type == 'dedup') && vDev.isMirror) {
						newVDevData.value.type = vDev.type;
						newVDevData.value.isMirror = true;
						vDev.disks.forEach(disk => {
							newVDevData.value.disks.push(disk);
						});
						newVDevs.value.push(newVDevData.value);
						newVDevData.value = {type: '', disks: [], isMirror: false};			
					} else {
						newVDevData.value.type = vDev.type;
						vDev.disks.forEach(disk => {
							newVDevData.value.disks.push(disk);
						});
						newVDevs.value.push(newVDevData.value);
						newVDevData.value = {type: '', disks: [], isMirror: false};
					}
				}
			});

			if (newPoolDisks.value.length > 0) {
				cmdString.push(...newPoolDisks.value);
				if (newVDevs.value.length > 0) {
					newVDevs.value.forEach(vDev => {
						if (vDev.isMirror) {
							cmdString.push(vDev.type);
							cmdString.push('mirror');
							cmdString.push(...vDev.disks);
						} else {
							cmdString.push(vDev.type);
							cmdString.push(...vDev.disks);
						}
					});
				}
			}
		}
		
		console.log("cmdString");
		console.log(cmdString);
		
		const state = useSpawn(cmdString);
		const output = await state.promise();
		console.log(output)
		return output.stdout;
	
	} catch (state) {
		console.error(errorString(state));
		return null;
	}
}

export async function setRefreservation(pool: PoolData, refreservationPercent: number) {
	try {
		const size = convertSizeToBytes(pool.properties.size);
	
		const refreservation = (size / 100) * refreservationPercent;

		const cmdString = ['zfs', 'set', 'refreservation='+ refreservation, pool.name];
		console.log("cmdString");
		console.log(cmdString);
		
		const state = useSpawn(cmdString);
		const output = await state.promise();
		console.log(output)
		return output.stdout;
	
	} catch (state) {
		console.error(errorString(state));
		return null;
	}
}

export async function destroyPool(pool: PoolData, forceDestroy?: boolean) {
	try {
		const state = useSpawn(['zpool', 'destroy', pool.name]);
		const output = await state.promise();
		console.log(output)
		return output.stdout;
	} catch (state) {
		console.error(errorString(state));
		return null;
	}
}


const properties = [
	"sector",
	"failmode",
	"comment",
	"autoexpand",
	"autoreplace",
	"autotrim",
	"multihost",
	"delegation",
	"listsnapshots",
]

export async function configurePool(pool : PoolEditConfig) {
	try {
		//let cmdString = ['zpool', 'set'];
		const hasProperties = hasChanges(pool);

		if (hasProperties) {

			for (const property of properties) {
				if (property in pool) {
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
	
	} catch (state) {
		console.error(errorString(state));
		return null;
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

export async function clearPoolErrors(pool) {
	try {
		const state = useSpawn(['zpool', 'clear', pool.name]);
		const output = await state.promise();
		console.log(output)
		return output.stdout;
	} catch (state) {
		console.error(errorString(state));
		return null;
	}
}


// export async function clearDiskLabels(pool) {
// 	try {
// 		pool.vdevs.forEach(vDev => {
			
// 		});
		
// 		const state = useSpawn(['zpool', 'labelclear', ]);
// 		const output = await state.promise();
// 		console.log(output)
// 		return output.stdout;
// 	} catch (state) {
// 		console.error(errorString(state));
// 		return null;
// 	}
// }

export async function trimPool(pool) {
	try {
		const state = useSpawn(['zpool', 'trim', pool.name]);
		const output = await state.promise();
		console.log(output)
		return output.stdout;
	} catch (state) {
		console.error(errorString(state));
		return null;
	}
}

export async function scrubPool(pool) {
	try {
		const state = useSpawn(['zpool', 'scrub', pool.name]);
		const output = await state.promise();
		console.log(output)
		return output.stdout;
	} catch (state) {
		console.error(errorString(state));
		return null;
	}
}

export async function resilverPool(pool) {
	try {
		const state = useSpawn(['zpool', 'resilver', pool.name]);
		const output = await state.promise();
		console.log(output)
		return output.stdout;
	} catch (state) {
		console.error(errorString(state));
		return null;
	}
}


export async function exportPool(pool) {
	try {
		const state = useSpawn(['zpool', 'export', pool.name]);
		const output = await state.promise();
		console.log(output)
		return output.stdout;
	} catch (state) {
		console.error(errorString(state));
		return null;
	}
}