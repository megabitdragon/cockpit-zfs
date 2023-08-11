import { useSpawn, errorString } from '@45drives/cockpit-helpers';
// @ts-ignore
import get_datasets_script from "../scripts/get-datasets.py?raw";

//['/usr/bin/env', 'python3', '-c', script, ...args ]

export async function getDatasets() {
    try {
        const state = useSpawn(['/usr/bin/env', 'python3', '-c', get_datasets_script], { superuser: 'try' });
        const datasets = (await state.promise()).stdout;
        return datasets;
    } catch (state) {
        console.error(errorString(state));
        return null;
    }
}

//command line based method (will replace with py-libzfs API method)
export async function createDataset(fileSystemData : NewDataset) {
    try {
        let cmdString = ['zfs', 'create', '-o', 'atime=' + fileSystemData.atime, '-o', 'casesensitivity=' + fileSystemData.casesensitivity, '-o', 'compression=' + fileSystemData.compression, '-o', 'dedup=' + fileSystemData.dedup, '-o', 'dnodesize=' + fileSystemData.dnodesize, '-o', 'xattr=' + fileSystemData.xattr, '-o', 'recordsize=' + fileSystemData.recordsize, '-o', 'readonly=' + fileSystemData.readonly]
		
		// '-o', 'quota=' + fileSystemData.quota,fileSystemData.parent + '/' + fileSystemData.name
		if (Number(fileSystemData.quota) == 0) {
			cmdString.push('-o', 'quota=none');
		} else {
			cmdString.push('-o', 'quota=' + fileSystemData.quota);
		}

		cmdString.push(fileSystemData.parent + '/' + fileSystemData.name);

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