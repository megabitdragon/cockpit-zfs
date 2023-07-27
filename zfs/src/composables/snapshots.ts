import { useSpawn, errorString } from '@45drives/cockpit-helpers';
// @ts-ignore
import get_snapshots_script from "../scripts/get-snapshots.py?raw";

//['/usr/bin/env', 'python3', '-c', script, ...args ]

export async function getSnapshots() {
    try {
        const state = useSpawn(['/usr/bin/env', 'python3', '-c', get_snapshots_script], { superuser: 'try' });
        const snapshots = (await state.promise()).stdout;
        return snapshots;
    } catch (state) {
        console.error(errorString(state));
        return null;
    }
}
