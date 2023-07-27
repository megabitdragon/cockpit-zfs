import { useSpawn, errorString } from '@45drives/cockpit-helpers';
import { inject, provide, reactive, ref, Ref, computed, watch } from 'vue';
// @ts-ignore
import get_pools_script from "./get-pools.py?raw";
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

export async function newPool(pool: newPoolData) {
	try {
		if (pool.vdevs[0].type == 'disk') {

			pool.vdevs.forEach(vDev => {
				vDev.disks.forEach(disk => {
					newPoolDisks.value.push(disk);
				});
			});

			const state = useSpawn(['zpool', 'create', '-o', 'ashift=12', '-o', 'autoexpand=' + pool.autoexpand, '-o', 'autoreplace=' + pool.autoreplace, '-o', 'autotrim=' + pool.autotrim, '-O', 'aclinherit=passthrough', '-O',
			'acltype=posixacl', '-O', 'casesensitivity=sensitive', '-O', 'compression=' + pool.compression, '-O', 'normalization=formD', '-O', 'recordsize=' + pool.recordsize, '-O', 'sharenfs=off', '-O', 'sharesmb=off', '-O', 
			'utf8only=on', '-O', 'xattr=sa', '-O', 'dedup=' + pool.dedup, pool.name, ...newPoolDisks.value]);
		
			const output = await state.promise();
			console.log(output)
			newPoolDisks.value = [];

			return output.stdout;
			
		} else {
	
			let cmdString = ['zpool', 'create', '-o', 'ashift=12', '-o', 'autoexpand=' + pool.autoexpand, '-o', 'autoreplace=' + pool.autoreplace, '-o', 'autotrim=' + pool.autotrim, '-O', 'aclinherit=passthrough', '-O',
			'acltype=posixacl', '-O', 'casesensitivity=sensitive', '-O', 'compression=' + pool.compression, '-O', 'normalization=formD', '-O', 'recordsize=' + pool.recordsize, '-O', 'sharenfs=off', '-O', 'sharesmb=off', '-O', 
			'utf8only=on', '-O', 'xattr=sa', '-O', 'dedup=' + pool.dedup, pool.name];

			pool.vdevs.forEach(vDev => {
				cmdString.push(vDev.type);
				vDev.disks.forEach(disk => {
					cmdString.push(disk);
				});
			});

			const state = useSpawn(cmdString);
			const output = await state.promise();
			console.log(output)
			return output.stdout;
		}
	
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