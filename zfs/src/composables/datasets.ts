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
export async function createDataset(fileSystemData : NewDataset, passphrase? : string) {
    try {
        let cmdString = ['zfs', 'create', '-o', 'atime=' + fileSystemData.atime, '-o', 'casesensitivity=' + fileSystemData.casesensitivity, '-o', 'compression=' + fileSystemData.compression, '-o', 'dedup=' + fileSystemData.dedup, '-o', 'dnodesize=' + fileSystemData.dnodesize, '-o', 'xattr=' + fileSystemData.xattr, '-o', 'recordsize=' + fileSystemData.recordsize, '-o', 'readonly=' + fileSystemData.readonly]
		
		// '-o', 'quota=' + fileSystemData.quota,fileSystemData.parent + '/' + fileSystemData.name
		if (Number(fileSystemData.quota) == 0) {
			cmdString.push('-o', 'quota=none');
		} else {
			cmdString.push('-o', 'quota=' + fileSystemData.quota);
		}

	/*	if (fileSystemData.encrypted) {
			cmdString.push('-o', 'encryption=' + fileSystemData.encryption!);
			cmdString.push('-o', 'keyformat=passphrase');

			cmdString.push(fileSystemData.parent + '/' + fileSystemData.name);

			console.log("cmdString:" , cmdString);
			
			const state = useSpawn(cmdString);
			const output = await state.promise().then(async() => {
				usePassphrase(passphrase!);
				usePassphrase(passphrase!);
			});
			console.log(output)
			return output.stdout;

		} else { 
	*/
			cmdString.push(fileSystemData.parent + '/' + fileSystemData.name);

			console.log("cmdString:" , cmdString);
			
			const state = useSpawn(cmdString);
			const output = await state.promise();
			console.log(output)
			return output.stdout;
	//	}

	} catch (state) {
        console.error(errorString(state));
        return null;
    }
}

// async function usePassphrase(passphrase : string) {
// 	let cmdString = [passphrase];

// 	console.log("cmdString:", cmdString);
// 	const state = useSpawn(cmdString);
// 	const output = await state.promise();
// 	console.log(output);
// 	return output.stdout;

// }

export async function configureDataset(fileSystemData : FileSystemData) {
	try {
		let cmdString = ['zfs', 'set', 'mountpoint=' + fileSystemData.mountpoint, 'canmount=' + fileSystemData.properties.canMount, 'recordsize=' + fileSystemData.properties.recordSize, 'aclinherit=' + fileSystemData.properties.aclInheritance!, 'acltype=' + fileSystemData.properties.aclType!, 'atime=' + fileSystemData.properties.accessTime, 'dedup=' + fileSystemData.properties.deduplication, 'compression=' + fileSystemData.properties.compression, 'checksum=' + fileSystemData.properties.checksum!, 'dnodesize=' + fileSystemData.properties.dNodeSize, 'xattr=' + fileSystemData.properties.extendedAttributes];

		if (Number(fileSystemData.properties.quota.raw) == 0) {
			cmdString.push('-o', 'quota=none');
		} else {
			cmdString.push('-o', 'quota=' + fileSystemData.properties.quota.raw);
		}

		if (Number(fileSystemData.properties.refreservation!.raw) == 0) {
			cmdString.push('-o', 'refreservation=off');
		} else {
			cmdString.push('-o', 'refreservation=' + fileSystemData.properties.refreservation!.raw);
		}

		cmdString.push(fileSystemData.parentFS + '/' + fileSystemData.name);

		console.log("cmdString:" , cmdString);
		
		const state = useSpawn(cmdString);
		const output = await state.promise();
		console.log(output)
		return output.stdout;

	} catch (state) {
		console.error(errorString(state));
		return null;
	}
}