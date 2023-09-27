import { useSpawn, errorString } from '@45drives/cockpit-helpers';
// @ts-ignore
import get_scan_script from "../scripts/get-scan.py?raw";


//['/usr/bin/env', 'python3', '-c', script, ...args ]

export async function getScan() {
	try {
		const state = useSpawn(['/usr/bin/env', 'python3', '-c', get_scan_script], { superuser: 'try' });
		const scan = (await state.promise()).stdout;
		return scan;
	} catch (state) {
		console.error(errorString(state));
		return null;
	}
}
