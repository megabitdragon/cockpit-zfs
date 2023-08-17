import { useSpawn, errorString } from '@45drives/cockpit-helpers';
import { convertBytesToSize, convertSizeToBytes, getSizeNumberFromString, getSizeUnitFromString, getQuotaRefreservUnit } from './helpers';
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

			console.log("create cmdString:" , cmdString);
			
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

export async function configureDataset(fileSystemData : FileSystemEditConfig) {
	try {
		let cmdString = ['zfs', 'set'];
	/*
		'readonly=' + fileSystemData.readonly
		'mountpoint=' + fileSystemData.mountpoint
		'canmount=' + fileSystemData.canmount
		'recordsize=' + fileSystemData.record
		'aclinherit=' + fileSystemData.aclinherit
		'acltype=' + fileSystemData.acltype
		'atime=' + fileSystemData.atime
		'dedup=' + fileSystemData.dedup
		'compression=' + fileSystemData.compression
		'checksum=' + fileSystemData.checksum
		'dnodesize=' + fileSystemData.dnodesize
		'xattr=' + fileSystemData.xattr
	*/
		const hasProperties = hasChanges(fileSystemData);

		if (hasProperties) {
			if (fileSystemData.readonly) {
				cmdString.push('readonly=' + fileSystemData.readonly);
			}
			if (fileSystemData.record) {
				cmdString.push('recordsize=' + fileSystemData.record);
			}
			if (fileSystemData.aclinherit) {
				cmdString.push('aclinherit=' + fileSystemData.aclinherit);
			}
			if (fileSystemData.acltype) {
				cmdString.push('acltype=' + fileSystemData.acltype);
			}
			if (fileSystemData.atime) {
				cmdString.push('atime=' + fileSystemData.atime);
			}
			if (fileSystemData.dedup) {
				cmdString.push('dedup=' + fileSystemData.dedup);
			}
			if (fileSystemData.compression) {
				cmdString.push('compression=' + fileSystemData.compression);
			}
			if (fileSystemData.checksum) {
				cmdString.push('checksum=' + fileSystemData.checksum);
			}
			if (fileSystemData.dnodesize) {
				cmdString.push('dnodesize=' + fileSystemData.dnodesize);
			}
			if (fileSystemData.xattr) {
				cmdString.push('xattr=' + fileSystemData.xattr);
			}
			if (fileSystemData.quota) {
				if (Number(fileSystemData.quota) == 0) {
					cmdString.push('quota=none');
				} else {
					cmdString.push('quota=' + fileSystemData.quota);
				}
			}
			if (fileSystemData.refreservation) {
				if (Number(fileSystemData.refreservation) == 0) {
					cmdString.push('refreservation=off');
				} else {
					cmdString.push('refreservation=' + fileSystemData.refreservation);
				}
			}
			if (fileSystemData.mountpoint) {
				cmdString.push('mountpoint=' + fileSystemData.mountpoint);
			}
			if (fileSystemData.canmount) {
				cmdString.push('canmount=' + fileSystemData.canmount);
			}
	
			cmdString.push(fileSystemData.name);
	
			console.log("configure cmdString:" , cmdString);
			
			const state = useSpawn(cmdString);
			const output = await state.promise();
			
			if (fileSystemData.mountpoint) {
				let newCmdString = 'zfs mount ' + fileSystemData.name;
				console.log("mounting newCmdString:" , newCmdString);
				const newState = useSpawn(newCmdString);
				const newOutput = await newState.promise();
				console.log(newOutput)
				return newOutput.stdout;
			}

			console.log(output)
			return output.stdout;

		} else {
			console.log("There are no selected properties to change.");
		}

	} catch (state) {
		console.error(errorString(state));
		return null;
	}
}

export async function destroyDataset(fileSystemData : FileSystemData, forceDestroy? : boolean) {

	let cmdString = ['zfs', 'destroy'];

	if (forceDestroy) {
		cmdString.push('-r');
	}

	cmdString.push(fileSystemData.name)

	console.log("destroy cmdString:" , cmdString);
		
	const state = useSpawn(cmdString);
	const output = await state.promise();
	console.log(output)
	return output.stdout;
}

export async function unmountChildren(fileSystemData: FileSystemData) {
	for (const child of fileSystemData.children!) {
        if (child.children!) {
            await unmountChildren(child);
        } else {
            let cmdString = ['zfs', 'unmount', child.name];
            console.log("unmount cmdString:", cmdString);

            const state = useSpawn(cmdString);
            const output = await state.promise();
            console.log(output);
            return output.stdout;
        }
    }
	
}

function hasChanges(fileSystemData) {
	const properties = [
		'readonly',
        'mountpoint',
        'canmount',
        'atime',
        'quota',
        'record',
        'refreservation',
        'aclinherit',
        'acltype',
        'dedup',
        'compression',
        'checksum',
        'dnodesize',
        'xattr',
	]

	for (const property of properties) {
		if (property in fileSystemData) {
			return true;
		}
	}

	return false;
}