import { useSpawn, errorString, process } from '@45drives/cockpit-helpers';
import { convertBytesToSize, convertSizeToBytes, getSizeNumberFromString, getSizeUnitFromString, getQuotaRefreservUnit } from './helpers';
// @ts-ignore
import get_datasets_script from "../scripts/get-datasets.py?raw";
// @ts-ignore
import create_encrypted_dataset_script from "../scripts/create-encrypted-dataset.py?raw";
// @ts-ignore
import change_passphrase_script from "../scripts/change-encrypted-key.py?raw";
// @ts-ignore
import unlock_dataset_script from "../scripts/unlock-encrypted-dataset.py?raw";
// @ts-ignore
import validate_passphrase_script from "../scripts/encryption-key-validation.py?raw";
// @ts-ignore
import send_dataset_script from "../scripts/send-dataset.py?raw";

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

export async function createDataset(fileSystemData : NewDataset) {
    try {
        let cmdString = ['zfs', 'create', '-o', 'atime=' + fileSystemData.atime, '-o', 'casesensitivity=' + fileSystemData.casesensitivity, '-o', 'compression=' + fileSystemData.compression, '-o', 'dedup=' + fileSystemData.dedup, '-o', 'dnodesize=' + fileSystemData.dnodesize, '-o', 'xattr=' + fileSystemData.xattr, '-o', 'recordsize=' + fileSystemData.recordsize, '-o', 'readonly=' + fileSystemData.readonly]
		
		
		if (Number(fileSystemData.quota) == 0) {
			cmdString.push('-o', 'quota=none');
		} else {
			cmdString.push('-o', 'quota=' + fileSystemData.quota);
		}

		cmdString.push(fileSystemData.parent + '/' + fileSystemData.name);

		console.log("create cmdString:" , cmdString);
		
		const state = useSpawn(cmdString);
		const output = await state.promise();
		console.log(output)
		return output.stdout;
		
	} catch (state) {
        console.error(errorString(state));
        return null;
    }
}

export async function createEncryptedDataset(fileSystemData : NewDataset, passphrase? : string) {
	try {
		let quota = '';
		if (Number(fileSystemData.quota) == 0) {
			quota = 'quota=none';
		} else {
			quota = ('quota=' + fileSystemData.quota);
		}
		let args = {
			cmd: 'zfs',
			atime : 'atime=' + fileSystemData.atime,
			case : 'casesensitivity=' + fileSystemData.casesensitivity,
			compress : 'compression=' + fileSystemData.compression,
			dedup : 'dedup=' + fileSystemData.dedup,
			dnode : 'dnodesize=' + fileSystemData.dnodesize,
			xattr : 'xattr=' + fileSystemData.xattr,
			record : 'recordsize=' + fileSystemData.recordsize,
			quota : quota,
			readonly : 'readonly=' + fileSystemData.readonly,
			encryption : 'encryption=' + fileSystemData.encryption!,
			keyformat: 'keyformat=passphrase',
			keylocation: 'keylocation=prompt',
			path : (fileSystemData.parent + '/' + fileSystemData.name),
			passphrase : passphrase!,
		}
		const state = useSpawn(['/usr/bin/env', 'python3', '-c', create_encrypted_dataset_script, args.cmd, args.atime, args.case, args.compress, args.dedup, args.dnode, args.xattr, args.record, args.quota, args.readonly, args.encryption, args.keyformat, args.keylocation, args.path, args.passphrase], { superuser: 'try', stderr: 'out'});

		const output = await state.promise();
		console.log(output)
		return output.stdout;
		
	} catch (state) {
		console.error(errorString(state));
		return null;
	}
}

export async function changePassphrase(fileSystemName : string, newPassphrase : string) {
	try {
		const state = useSpawn(['/usr/bin/env', 'python3', '-c', change_passphrase_script, fileSystemName, newPassphrase], { superuser: 'try', stderr: 'out'});
		const output = await state.promise();
		console.log(output);
		return output.stdout;
	} catch (state) {
		console.error(errorString(state));
		return null;
	}
}

export async function isPassphraseValid(fileSystemName : string, passphrase : string) {
	try {
		const state = useSpawn(['/usr/bin/env', 'python3', '-c', validate_passphrase_script, fileSystemName, passphrase], { superuser: 'try', stderr: 'out'});
		const output = await state.promise();
		console.log(`fileSystemName: ${fileSystemName}, pass: ${passphrase}, function call output: ${output.stdout}`);

		if (output.stdout.includes('true')) {
			return true;
		} else {
			return false;
		}

	} catch (state) {
		console.error(errorString(state));
		return false;
	}
}

export async function configureDataset(fileSystemData : FileSystemEditConfig) {
	try {
		let cmdString = ['zfs', 'set'];

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

export async function destroyDataset(fileSystemData : FileSystemData, forceDestroy? : boolean, destroyChildren?: boolean, destroyDependents?: boolean) {
	try {
		let cmdString = ['zfs', 'destroy'];

		if (destroyDependents) {
			cmdString.push('-R');
		}

		if (forceDestroy) {
			cmdString.push('-f');
		}

		if (destroyChildren) {
			cmdString.push('-r');
		}

		cmdString.push(fileSystemData.name)

		console.log("destroy cmdString:" , cmdString);
			
		const state = useSpawn(cmdString);
		const output = await state.promise();
		console.log(output)
		return output.stdout;
	} catch (state) {
		console.error(errorString(state));
		return null;
	}
}

export async function unmountFileSystem(fileSystemData: FileSystemData, forceUnmount?: boolean) {
	try {
		let cmdString = ['zfs', 'unmount'];
		
		if (forceUnmount) {
			cmdString.push('-f');
		}

		cmdString.push(fileSystemData.name);

		console.log("***\ncmdString:", cmdString, "\n***");
		const state = useSpawn(cmdString);
		const output = await state.promise();
		console.log(output)
		return output.stdout;
	} catch (state) {
		console.error(errorString(state));
		return null;
	}
}

export async function mountFileSystem(fileSystemData: FileSystemData, forceMount?: boolean) {
	try {
		let cmdString = ['zfs', 'mount'];
		
		if (forceMount) {
			cmdString.push('-f');
		}

		cmdString.push(fileSystemData.name)

		console.log("***\ncmdString:", cmdString, "\n***");
		const state = useSpawn(cmdString);
		const output = await state.promise();
		console.log(output)
		return output.stdout;
	} catch (state) {
		console.error(errorString(state));
		return null;
	}
}

export async function lockFileSystem(fileSystemData: FileSystemData) {
	try {
		let cmdString = ['zfs', 'unload-key'];

		cmdString.push(fileSystemData.name);
		console.log("***\ncmdString:", cmdString, "\n***");
		const state = useSpawn(cmdString);
		const output = await state.promise();
		console.log(output)
		return output.stdout;
	} catch (state) {
		console.error(errorString(state));
		return null;
	}
}

export async function unlockFileSystem(fileSystemData: FileSystemData, passphrase : string) {
	try {
		const state = useSpawn(['/usr/bin/env', 'python3', '-c', unlock_dataset_script, fileSystemData.name, passphrase], { superuser: 'try', stderr: 'out'});
		const output = await state.promise();
		console.log(output);
		return output.stdout;
	} catch (state) {
		console.error(errorString(state));
		return null;
	}
}

export async function sendFileSystem(sendingData : SendingDataset) {
	try {
		// const state = useSpawn(['/usr/bin/env', 'python3', '-c', send_dataset_script, sendingData.sendName, sendingData.recvName, sendingData.recvHost, sendingData.recvPort, sendingData.sendOpts.compressed, sendingData.sendOpts.raw], { superuser: 'try', stderr: 'out'});
		const state = useSpawn(['/usr/bin/env', 'python3', '-c', send_dataset_script, sendingData.sendName, sendingData.recvName, sendingData.sendOpts.forceOverwrite!], { superuser: 'try', stderr: 'out'});
		
		const output = await state.promise();
		console.log(output);
		return output.stdout;
	} catch (state) {
		console.error(errorString(state));
		return null;
	}
}

export async function renameFileSystem(oldPath, newPath, forceUnmount?, createParent?) {
	try {
		let cmdString = ['zfs', 'rename'];

		if (createParent) {
			cmdString.push('-p');
		}

		if (forceUnmount) {
			cmdString.push('-f');
		}

		cmdString.push(oldPath);
		cmdString.push(newPath);

		console.log("***\ncmdString:", cmdString, "\n***");
		const state = useSpawn(cmdString);
		const output = await state.promise();
		console.log(output)
		return output.stdout;
	} catch (state) {
		console.error(errorString(state));
		return null;
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

