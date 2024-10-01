import { ref } from 'vue';
import { getImportablePools, getImportableDestroyedPools } from "./pools";
import { loadDisksExtraData } from './loadData';

// const vDevs = ref<ImportablePoolvDevData[]>([]);
const vDevs = ref<vDevData[]>([]);
const errors: string[] = [];

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
				errors: errors,
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
				errors: errors,
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
	const vDevData: vDevData = {
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

	// Regex for various disk path types
	const phyPathRegex = `\/dev\/disk\/by-path\/[0-9a-zA-Z:.\-]+(?:-part[0-9]+)?$`;
	const sdPathRegex = `\/dev\/sd[a-z0-9]+[0-9]*$`;
	const vDevPathRegex = `\/dev\/disk\/by-vdev\/[0-9a-zA-Z\-]+(?:-part[0-9]+)?$`;
	const idPathRegex = `\/dev\/disk\/by-id\/[0-9a-zA-Z:\-]+(?:-part[0-9]+)?$`;
	const labelPathRegex = `\/dev\/disk\/by-label\/[0-9a-zA-Z\-]+(?:-part[0-9]+)?$`;
	const partLabelPathRegex = `\/dev\/disk\/by-partlabel\/[0-9a-zA-Z\-]+(?:-part[0-9]+)?$`;
	const partUUIDRegex = `\/dev\/disk\/by-partuuid\/[0-9a-zA-Z\-]+$`;
	const uuidRegex = `\/dev\/disk\/by-uuid\/[0-9a-zA-Z\-]+$`;

	// Prefixes for constructing paths
	const phyPathPrefix = '/dev/disk/by-path/';
	const sdPathPrefix = '/dev/';
	const idPathPrefix = '/dev/disk/by-id/';
	const labelPathPrefix = '/dev/disk/by-label/';
	const partLabelPathPrefix = '/dev/disk/by-partlabel/';
	const partUUIDPrefix = '/dev/disk/by-partuuid/';
	const uuidPrefix = '/dev/disk/by-uuid/';

	// Function to find the correct disk based on the matching path
	function findDiskByPath(vDevData, disks) {
		return disks.value.find(disk => {
			const partitionSuffix = vDevData.path.includes('-part') ? '' : '-part1'; // Check if path has partition already
			return (
				disk.phy_path + partitionSuffix === vDevData.path ||
				disk.sd_path + (partitionSuffix ? '1' : '') === vDevData.path || // Handle sd_path with or without partitions
				disk.vdev_path + partitionSuffix === vDevData.path ||
				disk.id_path + partitionSuffix === vDevData.path ||
				disk.label_path + partitionSuffix === vDevData.path ||
				disk.part_label_path + partitionSuffix === vDevData.path ||
				disk.part_uuid === vDevData.path || // Part UUID paths don't need to append partition
				disk.uuid === vDevData.path // UUID paths also don't need partition
			);
		});
	}

	if (vDev.children.length < 1) {
		const diskVDev = ref();
		const diskName = ref('');
		const diskPath = ref('');

		diskVDev.value = findDiskByPath(vDevData, disks,);

		if (!diskVDev.value) {
			console.error(`Disk not found for path: ${vDevData.path}.`);
			diskVDev.value = createMissingDisk(vDev.path, vDev.name, vDevType, poolName);
		}

		if (vDevData.path!.match(phyPathRegex)) {
			diskPath.value = diskVDev.value.phy_path;
			diskName.value = diskVDev.value.phy_path.replace(phyPathPrefix, '');
		} else if (vDevData.path!.match(sdPathRegex)) {
			diskPath.value = diskVDev.value.sd_path;
			diskName.value = diskVDev.value.sd_path.replace(sdPathPrefix, '');
		} else if (vDevData.path!.match(vDevPathRegex)) {
			diskPath.value = diskVDev.value.vdev_path;
			diskName.value = diskVDev.value.name;
		} else if (vDevData.path!.match(idPathRegex)) {
			diskPath.value = diskVDev.value.id_path;
			diskName.value = diskVDev.value.id_path.replace(idPathPrefix, '');
		} else if (vDevData.path!.match(labelPathRegex)) {
			diskPath.value = diskVDev.value.label_path;
			diskName.value = diskVDev.value.label_path.replace(labelPathPrefix, '');
		} else if (vDevData.path!.match(partLabelPathRegex)) {
			diskPath.value = diskVDev.value.part_label_path;
			diskName.value = diskVDev.value.part_label_path.replace(partLabelPathPrefix, '');
		} else if (vDevData.path!.match(partUUIDRegex)) {
			diskPath.value = diskVDev.value.part_uuid;
			diskName.value = diskVDev.value.name;
		} else if (vDevData.path!.match(uuidRegex)) {
			diskPath.value = diskVDev.value.uuid;
			diskName.value = diskVDev.value.name;
		}

		const notAChildDisk: DiskData = {
			name: diskName!.value,
			path: diskPath.value,
			guid: vDev.guid,
			type: diskVDev.value!.type ,
			health: diskVDev.value!.status,
			stats: diskVDev.value!.stats,
			capacity: diskVDev.value!.capacity,
			model: diskVDev.value!.model,
			phy_path: diskVDev.value!.phy_path,
			sd_path: diskVDev.value!.sd_path,
			vdev_path: diskVDev.value!.vdev_path,
			serial: diskVDev.value!.serial,
			powerOnHours: diskVDev.value!.powerOnHours,
			powerOnCount: diskVDev.value!.powerOnCount,
			temp: diskVDev.value!.temp,
			rotationRate: diskVDev.value!.rotationRate,
			vDevName: vDev.name,
			poolName: poolName,
			errors: errors
		};

		if (!vDevData.disks.some(disk => disk.guid === notAChildDisk.guid)) {
			vDevData.disks.push(notAChildDisk);
		}

		vDevs.value.push(vDevData);
	} else {
		vDev.children.forEach(child => {
			handleDiskChild(child, vDevData, disks, vDev.name, poolName, vDevType);
		});

		vDevs.value.push(vDevData);
	}
}


function handleDiskChild(child, vDevData, disks, vDevName, poolName, vDevType) {
	let fullDiskData = disks.value.find(disk => {
		return disk.phy_path + '-part1' === child.path ||
			disk.sd_path + '1' === child.path ||
			disk.vdev_path + '-part1' === child.path;
	});

	if (!fullDiskData) {
		const errorMessage = `Disk not found for path: ${child.path}. Pool might be degraded.`;
		console.error(errorMessage);

		// Create missing disk and add error
		fullDiskData = createMissingDisk(child.path, child.name, vDevType, poolName);
		fullDiskData.errors!.push(errorMessage); // Add the error to disk object
	}

	const childDisk = {
		name: child.name || 'Unknown',
		path: child.path,
		guid: child.guid,
		type: fullDiskData.type,
		health: fullDiskData.status,
		stats: child.stats || {},
		capacity: fullDiskData.capacity || 'Unknown',
		model: fullDiskData.model || 'Unknown',
		phy_path: fullDiskData.phy_path,
		sd_path: fullDiskData.sd_path,
		vdev_path: fullDiskData.vdev_path,
		serial: fullDiskData.serial || 'Unknown',
		powerOnHours: fullDiskData.powerOnHours || 0,
		powerOnCount: fullDiskData.powerOnCount || 0,
		temp: fullDiskData.temp || 0,
		rotationRate: fullDiskData.rotationRate || 0,
		vDevName: vDevName,
		poolName: poolName,
		vDevType: vDevType,
		errors: errors // Propagate errors
	};

	// Add the disk only if it's not already in the vDevData.disks array
	if (!vDevData.disks.some(disk => disk.guid === childDisk.guid)) {
		vDevData.disks.push(childDisk);
	}
}

function createMissingDisk(path, vDevName, vDevType, poolName) {
	console.log(`Creating placeholder for missing disk at path: ${path}`);
	return {
		name: 'Missing Disk',
		path: path,
		guid: 'N/A',
		type: vDevType,
		health: 'MISSING',
		stats: {},
		capacity: 'N/A',
		model: 'N/A',
		phy_path: path,
		sd_path: '',
		vdev_path: '',
		serial: 'N/A',
		powerOnHours: 0,
		powerOnCount: 0,
		temp: 0,
		rotationRate: 0,
		vDevName: vDevName,
		poolName: poolName,
		vDevType: vDevType,
		errors: errors
	};
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