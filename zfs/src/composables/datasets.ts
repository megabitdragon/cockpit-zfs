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

/*
export async function newPool(pool: newPoolData) {
	try {
		newVDevs.value = [];
		newPoolDisks.value = [];

		let cmdString = ['zpool', 'create', '-o', 'ashift=' + pool.sectorsize, '-o', 'autoexpand=' + pool.autoexpand, '-o', 'autoreplace=' + pool.autoreplace, '-o', 'autotrim=' + pool.autotrim, '-O', 'aclinherit=passthrough', '-O',
			'acltype=posixacl', '-O', 'casesensitivity=sensitive', '-O', 'compression=' + pool.compression, '-O', 'normalization=formD', '-O', 'recordsize=' + pool.recordsize, '-O', 'sharenfs=off', '-O', 'sharesmb=off', '-O', 
			'utf8only=on', '-O', 'xattr=sa', '-O', 'dedup=' + pool.dedup, pool.name];

		if (pool.forceCreate) {
			cmdString.push('-f');
		}

		if (pool.vdevs[0].type != 'disk') {
			pool.vdevs.forEach(vDev => {
				if (vDev.isMirror && (vDev.type == 'special' || vDev.type == 'dedup' || vDev.type == 'log')) {
					cmdString.push(vDev.type);
					cmdString.push('mirror');
					vDev.disks.forEach(disk => {
						cmdString.push(disk);
					});
				} else {
					cmdString.push(vDev.type);
					vDev.disks.forEach(disk => {
						cmdString.push(disk);
					});
				}
			});
			
		} else {
			pool.vdevs.forEach(vDev => {
				if (vDev.type == 'disk') {
					vDev.disks.forEach(disk => {
						if (!newPoolDisks.value.includes(disk)) {
							newPoolDisks.value.push(disk);
						}
					});
				} else if (vDev.type == 'cache' || vDev.type == 'log' || vDev.type == 'special' || vDev.type == 'spare' || vDev.type == 'dedup') {
					if ((vDev.type == 'log' || vDev.type == 'special' || vDev.type == 'dedup') && vDev.isMirror) {
						newVDevData.value.type = vDev.type;
						newVDevData.value.isMirror = true;
						vDev.disks.forEach(disk => {
							newVDevData.value.disks.push(disk);
						});
						newVDevs.value.push(newVDevData.value);
						newVDevData.value = {type: '', disks: [], isMirror: false};			
					} else {
						newVDevData.value.type = vDev.type;
						vDev.disks.forEach(disk => {
							newVDevData.value.disks.push(disk);
						});
						newVDevs.value.push(newVDevData.value);
						newVDevData.value = {type: '', disks: [], isMirror: false};
					}
				}
			});

			if (newPoolDisks.value.length > 0) {
				cmdString.push(...newPoolDisks.value);
				if (newVDevs.value.length > 0) {
					newVDevs.value.forEach(vDev => {
						if (vDev.isMirror) {
							cmdString.push(vDev.type);
							cmdString.push('mirror');
							cmdString.push(...vDev.disks);
						} else {
							cmdString.push(vDev.type);
							cmdString.push(...vDev.disks);
						}
					});
				}
			}
		}
		
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

*/
