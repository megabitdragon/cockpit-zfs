import { useSpawn, errorString } from '@45drives/cockpit-helpers';
import { inject, provide, reactive, ref, Ref, computed, watch } from 'vue';
// @ts-ignore
import get_pools_script from "../scripts/get-pools.py?raw";
// @ts-ignore
import create_pools_script from "./create-pool.py?raw";

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

// export async function createPool(poolName : string, vDevs: newVDev[]) {
//   try {
//     //console.log(vDevs);
//     const state = useSpawn(['/usr/bin/env', 'python3', '-c', create_pools_script, poolName, '--vdev-topology', JSON.stringify(vDevs)], { superuser: 'try', stderr: 'out'});
//     const output = await state.promise();
//     console.log(output)
//     return output.stdout;
//   } catch (state) {
//     console.error(errorString(state));
//     return null;
//   }
// }

const newPoolDisks = ref<string[]>([]);
const newVDevs = ref<newVDevData[]>([]);
const newVDevData = ref<newVDevData>({
	type: '',
	disks: [],
});

export async function newPool(pool: newPoolData) {
	try {
		newVDevs.value = [];
		newPoolDisks.value = [];

		let cmdString = ['zpool', 'create', '-o', 'ashift=12', '-o', 'autoexpand=' + pool.autoexpand, '-o', 'autoreplace=' + pool.autoreplace, '-o', 'autotrim=' + pool.autotrim, '-O', 'aclinherit=passthrough', '-O',
			'acltype=posixacl', '-O', 'casesensitivity=sensitive', '-O', 'compression=' + pool.compression, '-O', 'normalization=formD', '-O', 'recordsize=' + pool.recordsize, '-O', 'sharenfs=off', '-O', 'sharesmb=off', '-O', 
			'utf8only=on', '-O', 'xattr=sa', '-O', 'dedup=' + pool.dedup, pool.name];

		if (pool.vdevs[0].type != 'disk') {
			pool.vdevs.forEach(vDev => {
				cmdString.push(vDev.type);
				vDev.disks.forEach(disk => {
					cmdString.push(disk);
				});
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
					newVDevData.value.type = vDev.type;
					vDev.disks.forEach(disk => {
						newVDevData.value.disks.push(disk);
					});
					newVDevs.value.push(newVDevData.value);
					newVDevData.value = {type: '', disks: []};
				}
			});

			if (newPoolDisks.value.length > 0) {
				cmdString.push(...newPoolDisks.value);
				if (newVDevs.value.length > 0) {
					newVDevs.value.forEach(vDev => {
						cmdString.push(vDev.type);
						cmdString.push(...vDev.disks);
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

export async function destroyPool(pool: PoolData) {
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