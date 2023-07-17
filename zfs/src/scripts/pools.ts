import { useSpawn, errorString } from '@45drives/cockpit-helpers';
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

export async function newPool(pool: PoolData) {
  try {
    //const state = useSpawn(['/usr/bin/env', 'python3', '-c', create_pools_script, poolName, '--vdev-topology', JSON.stringify(vDevs)], { superuser: 'try', stderr: 'out'});
    const state = useSpawn(['zpool create -o ashift=12 -o', pool.settings?.autoExpand]);
    const output = await state.promise();
    console.log(output)
    return output.stdout;
  } catch (state) {
    console.error(errorString(state));
    return null;
  }
}

// zpool create -o ashift=12 -o autoexpand=on -o autoreplace=off -o autotrim=off -O aclinherit=passthrough -O 
// acltype=posixacl -O casesensitivity=sensitive -O compression=lz4 -O normalization=formD -O recordsize=131072 -O 
// sharenfs=off -O sharesmb=off -O utf8only=on -O xattr=sa -O dedup=off tank mirror 1-7 1-8

// export async function destroyPool(poolName : string) {
//   try {
//     const state = useSpawn(['zpool', 'destroy', poolName], { superuser: 'try', stderr: 'out'});
//     const output = await state.promise();
//     console.log(output)
//     return output.stdout;
//   } catch (state) {
//     console.error(errorString(state));
//     return null;
//   }
// }