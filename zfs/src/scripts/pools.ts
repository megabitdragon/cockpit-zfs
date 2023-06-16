import { useSpawn, errorString } from '@45drives/cockpit-helpers';
// @ts-ignore
import script_py from "./get-pools.py?raw";

//['/usr/bin/env', 'python3', '-c', script, ...args ]

export async function getPools() {
    try {
        const state = useSpawn(['/usr/bin/env', 'python3', '-c', script_py], { superuser: 'try' });
        const pools = (await state.promise()).stdout;
        return pools;
    } catch (state) {
        console.error(errorString(state));
        return null;
    }
}

// function getHostnamePromise() {
//     return new Promise((resolve, reject) => {
//         const state = useSpawn(['hostname'], { superuser: 'try' });
//         state.promise()
//             .then(({stdout}) => resolve(stdout))
//             .catch(state => {
//                 console.error(errorString(state))
//                 reject(null);
//             });
//     });
// }

