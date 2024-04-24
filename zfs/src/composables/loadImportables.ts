import { ref } from 'vue';
import { getImportablePools, getImportableDestroyedPools } from "./pools";
import { loadDisksExtraData } from './loadData';

// const vDevs = ref<ImportablePoolvDevData[]>([]);
const vDevs = ref<vDevData[]>([]);

export function parseImportVDevData(vDev, poolName, vDevType) {
    try {
        console.log('vDevData Importing:', vDev);
        const vDevData : vDevData = {
            name: vDev.name,
            type: vDevType,
            status: vDev.status,
            guid: vDev.guid,
            stats: vDev.stats,
            disks: vDev.children,
            poolName: poolName,
            selectedDisks: [],
            // console.log("loaded Disks:", allDisks);
        }

        vDevs.value.push(vDevData);

    } catch (error) {
        // Handle any errors that may occur during the asynchronous operation
        console.error("An error occurred getting vdevs for Importable pools:", error);
    }
}

export async function loadImportablePools(importablePools, allDisks, existingPools) {
    try {
        const rawJSON = await getImportablePools();
        const parsedJSON = JSON.parse(rawJSON);
        console.log('Importable Pools JSON:', parsedJSON);

        //loops through pool JSON
        for (let i = 0; i < parsedJSON.length; i++) {
            //calls parse function for each type of VDev that could be in the Pool, then pushes the VDev data to VDev array
            parsedJSON[i].groups.data.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, allDisks, 'data'));
            parsedJSON[i].groups.cache.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, allDisks, 'cache'));
            parsedJSON[i].groups.dedup.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, allDisks, 'dedup'));
            parsedJSON[i].groups.log.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, allDisks, 'log'));
            parsedJSON[i].groups.spare.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, allDisks, 'spare'));
            parsedJSON[i].groups.special.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, allDisks, 'special'));
            
            //adds pool data from JSON into pool data object, pushes into array 
            const poolData : ImportablePoolData = {
                name: parsedJSON[i].name,
                status: parsedJSON[i].status,
                guid: parsedJSON[i].guid,
                properties: parsedJSON[i].properties,
                scan: parsedJSON[i].scan,
                vdevs: vDevs.value,
                isDestroyed: false,
            }
           // console.log("ImportablePoolData", i , ": ", poolData);
            importablePools.push(poolData);
            vDevs.value = [];
        }
            
        console.log("loaded Importable Pools:", importablePools);

        await loadDisksExtraData(allDisks.value, existingPools.value);

        console.log("loaded Disks:", allDisks);

    } catch (error) {
        // Handle any errors that may occur during the asynchronous operation
        console.error("An error occurred getting Importable pools:", error);
    }
}

export async function loadImportableDestroyedPools(importablePools, allDisks, existingPools) {
    try {
		const rawJSON = await getImportableDestroyedPools();
		const parsedJSON = JSON.parse(rawJSON);
		console.log('Destroyed Pools JSON:', parsedJSON);
		
		for (let i = 0; i < parsedJSON.length; i++) {
			//calls parse function for each type of VDev that could be in the Pool, then pushes the VDev data to VDev array
            parsedJSON[i].groups.data.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, allDisks, 'data'));
            parsedJSON[i].groups.cache.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, allDisks, 'cache'));
            parsedJSON[i].groups.dedup.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, allDisks, 'dedup'));
            parsedJSON[i].groups.log.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, allDisks, 'log'));
            parsedJSON[i].groups.spare.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, allDisks, 'spare'));
            parsedJSON[i].groups.special.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, allDisks, 'special'));
            
            const poolData : ImportablePoolData = {
                name: parsedJSON[i].name,
                status: parsedJSON[i].status,
                guid: parsedJSON[i].guid,
                properties: parsedJSON[i].properties,
                scan: parsedJSON[i].scan,
                vdevs: vDevs.value,
                isDestroyed: true,
            }
           // console.log("DestroyedImportablePoolData", i , ": ", poolData);
            importablePools.push(poolData);
            vDevs.value = [];
		}
            
        console.log("loaded Importable/Destroyed Pools:", importablePools);

        await loadDisksExtraData(allDisks.value, existingPools.value);

        console.log("loaded Disks:", allDisks);

    } catch (error) {
        // Handle any errors that may occur during the asynchronous operation
        console.error("An error occurred getting destroyed Importable pools:", error);
    }
}


//method for parsing through VDevs to add to array (VDev array is added to Pool)
export function parseVDevData(vDev, poolName, disks, vDevType) {
	// vDevs.value = [];
	
	const vDevData : vDevData = {
		name: vDev.name,
		type: vDevType,
		status: vDev.status,
		stats: vDev.stats,
		guid: vDev.guid,
		selectedDisks: [],
		disks: [],
		poolName: poolName,
		path: vDev.path,
		diskType: determineDiskType(vDev, disks),
	};
	
	const phyPathRegex = `\/dev\/disk\/by-path\/[0-9a-zA-Z:.\-]+(?:-part[0-9]+)?$`;
	const sdPathRegex = `\/dev\/sd[a-z][0-9]+$`;
	const vDevPathRegex = `\/dev\/disk\/by-vdev\/[0-9\-]+(?:-part[0-9]+)?$`;
	const phyPathPrefix = '/dev/disk/by-path/';
	const sdPathPrefix = '/dev/';

	//checks if VDev has child disks and if not, stores the disk information as the VDev itself (vdev-level disks) then adds to VDev array
	if (vDev.children.length < 1) {

		const diskVDev = ref();
		const diskName = ref('');
		const diskPath = ref('');

		if (vDevData.path!.match(phyPathRegex)) {
			diskVDev.value = disks.value.find(disk => disk.phy_path + '-part1' === vDevData.path)!;
			//console.log('phyPath match');
			diskPath.value = diskVDev.value.phy_path;
			diskName.value = diskVDev.value.phy_path.replace(phyPathPrefix, '');
			// console.log('disk:', diskName.value);
		} else if (vDevData.path!.match(sdPathRegex)) {
			diskVDev.value = disks.value.find(disk => disk.sd_path + '1' === vDevData.path)!;
			//console.log('sdPath match');
			diskPath.value = diskVDev.value.sd_path;
			diskName.value = diskVDev.value.sd_path.replace(sdPathPrefix, '');
			// console.log('disk:', diskName.value);
		} else if (vDevData.path!.match(vDevPathRegex)) {
			diskVDev.value = disks.value.find(disk => disk.vdev_path  + '-part1' === vDevData.path)!;
			//console.log('vDevPath match');
			diskPath.value = diskVDev.value.vdev_path;
			diskName.value = diskVDev.value!.name;
		}

		// console.log('vDev', vDev);
		console.log('diskVDev:', diskVDev);

		const notAChildDisk : DiskData = {
			name: diskName!.value,
			path: diskPath.value,
			guid: vDev.guid,
			type: diskVDev.value!.type,
			health: diskVDev.value!.status,
			stats: diskVDev.value!.stats,
			capacity: diskVDev.value!.capacity,
			model: diskVDev.value!.model,
			phy_path: diskVDev.value!.phy_path,
			sd_path: diskVDev.value!.sd_path,
			vdev_path: diskVDev.value!.vdev_path,
			serial: diskVDev.value!.serial,
			// usable: false,
			powerOnHours: diskVDev.value!.powerOnHours,
			powerOnCount: diskVDev.value!.powerOnCount,
			temp: diskVDev.value!.temp,
			rotationRate: diskVDev.value!.rotationRate,
			vDevName: vDev.name,
			poolName: poolName,
		}
		vDevData.type = vDevType;
		vDevData.disks.push(notAChildDisk);
		console.log("Not A ChildDisk:", notAChildDisk);
		console.log("vDevData (disk device):", vDevData);
		
		vDevs.value.push(vDevData);
	} else {
		//if VDev does have child disks, add those disks to the VDev data object + array
		vDev.children.forEach(child => {
			const fullDiskData = ref();
			const diskName = ref('');
			const diskPath = ref('');
			const newChildren = ref<ChildDiskData[]>([]);

			if (child.type === 'disk') {
			/* 	if (child.path!.match(phyPathRegex)) {
					fullDiskData.value = disks.value.find(disk => disk.phy_path + '-part1' === child.path || disk.phy_path === child.path)!;
					//console.log('phyPath match');
					diskPath.value = fullDiskData.value.phy_path;
					diskName.value = fullDiskData.value.phy_path.replace(phyPathPrefix, '');
					// console.log('disk:', diskName.value);
				} else if (child.path!.match(sdPathRegex)) {
					fullDiskData.value = disks.value.find(disk => disk.sd_path + '1' === child.path || disk.sd_path === child.path)!;
					//console.log('sdPath match');
					diskPath.value = fullDiskData.value.sd_path;
					diskName.value = fullDiskData.value.sd_path.replace(sdPathPrefix, '');
					// console.log('disk:', diskName.value);
				} else if (child.path!.match(vDevPathRegex)) {
					fullDiskData.value = disks.value.find(disk => disk.vdev_path + '-part1' === child.path || disk.vdev_path === child.path)!;
					//console.log('vDevPath match');
					diskPath.value = fullDiskData.value.vdev_path;
					diskName.value = fullDiskData.value!.name;
					// console.log('disk:', diskName.value);
				} */
				let normalizedPath = child.path.replace('-part1', ''); // Normalize the path by removing '-part1'
				fullDiskData.value = disks.value.find(disk =>
					disk.vdev_path === normalizedPath ||
					disk.phy_path === normalizedPath ||
					disk.sd_path + '1' === child.path // Adding '1' to match `/dev/sdx1` style paths
				);

				if (!fullDiskData.value) {
					console.error('No matching disk found for path:', child.path);
					return; // Optionally return or handle the error
				}
								
				const childDisk : DiskData = {
					name: diskName.value,
					path: diskPath.value,
					guid: child.guid,
					type: fullDiskData.value.type,
					health: fullDiskData.value.status,
					stats: child.stats,
					capacity: fullDiskData.value.capacity,
					model: fullDiskData.value.model,
					phy_path: fullDiskData.value.phy_path,
					sd_path: fullDiskData.value.sd_path,
					vdev_path: fullDiskData.value.vdev_path,
					serial: fullDiskData.value.serial,
					// usable: false,
					powerOnHours: fullDiskData.value.powerOnHours,
					powerOnCount: fullDiskData.value.powerOnCount,
					temp: fullDiskData.value.temp,
					rotationRate: fullDiskData.value.rotationRate,
					vDevName: vDev.name,
					poolName: poolName,
					// children: newChildren.value,
				}; 

				console.log("ChildDisk:", childDisk);
				vDevData.disks.push(childDisk);
		
			} else if (child.type === 'replacing') {			
					child.children.forEach(childchild => {
						const newChild : ChildDiskData = {
							name: childchild.name,
							guid: childchild.guid,
							path: childchild.path,
							stats: childchild.stats,
							status: childchild.status,
							type: childchild.type,
							children: childchild.children,
						}
						newChildren.value.push(newChild);
					});

					const childDisk : DiskData = {
						name: child.name,
						path: child.path,
						guid: child.guid,
						type: child.type,
						health: child.status,
						stats: child.stats,
						capacity: '',
						model: '',
						phy_path: '',
						sd_path: '',
						vdev_path: '',
						serial: '',
						// usable: false,
						powerOnHours: 0,
						powerOnCount: '',
						temp: '',
						rotationRate: 0,
						vDevName: vDev.name,
						poolName: poolName,
						children: newChildren.value,
					}

					console.log("ChildDisk:", childDisk);
					vDevData.disks.push(childDisk);

			} else {
				console.error('error getting disk information');
			}
	
		});
	
		console.log("loaded vDevData:", vDevData);
		vDevs.value.push(vDevData);
	}

}

function determineDiskType(vDev, disks) {
    const childDisks = vDev.children.map(child => child.name);

    const diskTypes = childDisks.map(diskName => {
        const disk = disks.value.find(disk => disk.name === diskName);
        return disk ? disk.type : 'unknown'; // Default to 'unknown' if disk not found
    });

    // Determine the disk type based on the types of child disks in the VDev
    if (diskTypes.every(type => type === 'SSD')) {
        return 'SSD';
    } else if (diskTypes.every(type => type === 'HDD')) {
        return 'HDD';
    } else {
        return 'Hybrid'; // Mixed SSD and HDD
    }
}
