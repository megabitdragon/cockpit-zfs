import { useSpawn, errorString } from '@45drives/cockpit-helpers';
// @ts-ignore
import get_scan_script from "../scripts/get-scan.py?raw";
// @ts-ignore
import get_scan_group_script from "../scripts/get-scan-group.py?raw";
// @ts-ignore
import get_trim_group_script from "../scripts/get-trim-group.py?raw";


//['/usr/bin/env', 'python3', '-c', script, ...args ]

export async function getScan(poolName?) {
	try {
		const cmdString = ['/usr/bin/env', 'python3', '-c', get_scan_script];
		if (poolName) {
			cmdString.push(poolName);
		}
		const state = useSpawn(cmdString, { superuser: 'try' });
		const scan = (await state.promise()).stdout;
		return scan;
	} catch (state) {
		console.error(errorString(state));
		return null;
	}
}

export async function getScanGroup() {
	try {
		const cmdString = ['/usr/bin/env', 'python3', '-c', get_scan_group_script];
	
		const state = useSpawn(cmdString, { superuser: 'try' });
		const scans = (await state.promise()).stdout;
		return scans;
	} catch (state) {
		console.error(errorString(state));
		return null;
	}
}

// export async function getTRIMDetails(poolName) {
// 	try {
// 		const cmdString = ['/usr/bin/env', 'python3', '-c', get_trim_script, poolName];
// 		const state = useSpawn(cmdString, { superuser: 'try' });
// 		const trimInfo = (await state.promise()).stdout;
// 		return trimInfo;
// 	} catch (state) {
// 		console.error(errorString(state));
// 		return null;
// 	}
// }

export async function getDiskStats() {
	try {
		const cmdString = ['/usr/bin/env', 'python3', '-c', get_trim_group_script];
		const state = useSpawn(cmdString, { superuser: 'try' });
		const trimInfo = (await state.promise()).stdout;
		return trimInfo;
	} catch (state) {
		console.error(errorString(state));
		return null;
	}
}