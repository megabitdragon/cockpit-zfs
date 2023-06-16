import { useSpawn, errorString } from '@45drives/cockpit-helpers';
// @ts-ignore
import script_py from "./get-disks.py?raw";

//['/usr/bin/env', 'python3', '-c', script, ...args ]

export async function getDisks() {
    try {
        const state = useSpawn(['/usr/bin/env', 'python3', '-c', script_py], { superuser: 'try' });
        const disks = (await state.promise()).stdout;
        return disks;
    } catch (state) {
        console.error(errorString(state));
        return null;
    }
}

