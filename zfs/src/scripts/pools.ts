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