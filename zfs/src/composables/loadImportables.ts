import { ref } from 'vue';
import { getImportablePools, getImportableDestroyedPools } from "./pools";
import { VDev } from '@45drives/houston-common-lib';

// const vDevs = ref<ImportablePoolvDevData[]>([]);
const vDevs = ref<VDev[]>([]);
const errors: string[] = [];

export function parseImportVDevData(vDev, poolName, vDevType) {
    try {
        // console.log('vDevData Importing:', vDev);
        const vDevData : VDev = {
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
        // console.log('Importable Pools JSON:', parsedJSON);

        //loops through pool JSON
        for (let i = 0; i < parsedJSON.length; i++) {
            //calls parse function for each type of VDev that could be in the Pool, then pushes the VDev data to VDev array
            // parsedJSON[i].groups.data.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, allDisks, 'data'));
            // parsedJSON[i].groups.cache.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, allDisks, 'cache'));
            // parsedJSON[i].groups.dedup.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, allDisks, 'dedup'));
            // parsedJSON[i].groups.log.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, allDisks, 'log'));
            // parsedJSON[i].groups.spare.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, allDisks, 'spare'));
            // parsedJSON[i].groups.special.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, allDisks, 'special'));
			parsedJSON[i].groups.data.forEach(vDev => parseImportVDevData(vDev, parsedJSON[i].name, 'data'));
			parsedJSON[i].groups.cache.forEach(vDev => parseImportVDevData(vDev, parsedJSON[i].name, 'cache'));
			parsedJSON[i].groups.dedup.forEach(vDev => parseImportVDevData(vDev, parsedJSON[i].name, 'dedup'));
			parsedJSON[i].groups.log.forEach(vDev => parseImportVDevData(vDev, parsedJSON[i].name, 'log'));
			parsedJSON[i].groups.spare.forEach(vDev => parseImportVDevData(vDev, parsedJSON[i].name, 'spare'));
			parsedJSON[i].groups.special.forEach(vDev => parseImportVDevData(vDev, parsedJSON[i].name, 'special'));
            
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

        // await loadDisksExtraData(allDisks.value, existingPools.value);

        // console.log("loaded Disks:", allDisks);

    } catch (error) {
        // Handle any errors that may occur during the asynchronous operation
        console.error("An error occurred getting Importable pools:", error);
    }
}

export async function loadImportableDestroyedPools(importablePools, allDisks, existingPools) {
    try {
		const rawJSON = await getImportableDestroyedPools();
		const parsedJSON = JSON.parse(rawJSON);
		// console.log('Destroyed Pools JSON:', parsedJSON);
		
		for (let i = 0; i < parsedJSON.length; i++) {
			//calls parse function for each type of VDev that could be in the Pool, then pushes the VDev data to VDev array
            // parsedJSON[i].groups.data.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, allDisks, 'data'));
            // parsedJSON[i].groups.cache.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, allDisks, 'cache'));
            // parsedJSON[i].groups.dedup.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, allDisks, 'dedup'));
            // parsedJSON[i].groups.log.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, allDisks, 'log'));
            // parsedJSON[i].groups.spare.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, allDisks, 'spare'));
            // parsedJSON[i].groups.special.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, allDisks, 'special'));
			parsedJSON[i].groups.data.forEach(vDev => parseImportVDevData(vDev, parsedJSON[i].name, 'data'));
			parsedJSON[i].groups.cache.forEach(vDev => parseImportVDevData(vDev, parsedJSON[i].name, 'cache'));
			parsedJSON[i].groups.dedup.forEach(vDev => parseImportVDevData(vDev, parsedJSON[i].name, 'dedup'));
			parsedJSON[i].groups.log.forEach(vDev => parseImportVDevData(vDev, parsedJSON[i].name, 'log'));
			parsedJSON[i].groups.spare.forEach(vDev => parseImportVDevData(vDev, parsedJSON[i].name, 'spare'));
			parsedJSON[i].groups.special.forEach(vDev => parseImportVDevData(vDev, parsedJSON[i].name, 'special'));
            
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
            
        console.log("loaded Importable Destroyed Pools:", importablePools);

        // await loadDisksExtraData(allDisks.value, existingPools.value);

        // console.log("loaded Disks:", allDisks);

    } catch (error) {
        // Handle any errors that may occur during the asynchronous operation
        console.error("An error occurred getting destroyed importable pools:", error);
    }
}


/* //method for parsing through VDevs to add to array (VDev array is added to Pool)
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
		errors: [],
	};

	// let allDisksMissing = true;
	// let anyDiskMissing = false;

	// Regex for various disk path types
	const phyPathRegex = `\/dev\/disk\/by-path\/[0-9a-zA-Z:.\-]+(?:-part[0-9]+)?$`;
	const sdPathRegex = `\/dev\/sd[a-z0-9]+[0-9]*$`;
	const nvmePathRegex = `\/dev\/nvme[0-9]+n[0-9]+(?:p[0-9]+)?$`; // Added regex for NVMe paths
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

	function findDiskByPath(vDevData, disks) {
		if (!vDevData.path) {
			console.error(`vDevData.path is null or undefined for vDev: ${vDevData.name}`);
			return null; // Exit early if the path is invalid
		}

		console.log('vDevData:', vDevData);
		console.log('disks:', disks);

		// Extract the partition suffix for NVMe (e.g., p1) and standard paths (e.g., -part1)
		const partitionSuffixMatch = vDevData.path.match(/(?:-part|p)(\d+)/);
		const partitionSuffix = partitionSuffixMatch ? partitionSuffixMatch[0] : '';

		// Remove any partition suffix from the vDev path for comparison
		const cleanedVDevPath = vDevData.path.replace(/(?:-part|p)\d+$/, '');

		return disks.value.find(disk => {
			// Handle standard disks and NVMe separately
			if (disk.sd_path.includes('nvme')) {
				// NVMe paths often use 'p' for partitions (e.g., nvme0n1p1)
				return disk.sd_path + (partitionSuffix ? partitionSuffix : '') === vDevData.path;
			} else {
				// Check for other disk types with standard paths
				return (
					disk.phy_path === cleanedVDevPath ||
					disk.sd_path + (partitionSuffix ? partitionSuffix : '') === vDevData.path ||
					disk.vdev_path === cleanedVDevPath ||
					disk.id_path === cleanedVDevPath ||
					disk.label_path === cleanedVDevPath ||
					disk.part_label_path === cleanedVDevPath ||
					disk.part_uuid === vDevData.path || // Part UUID paths don't need to append partition
					disk.uuid === vDevData.path // UUID paths also don't need partition
				);
			}
		});
	}

	// Check if VDev has child disks and if not, stores the disk information as the VDev itself (vdev-level disks) then adds to VDev array
	if (vDev.children.length < 1) {
		const diskVDev = ref();
		const diskName = ref('');
		const diskPath = ref('');

		diskVDev.value = findDiskByPath(vDevData, disks);

		if (!diskVDev.value) {
			console.error(`Disk not found for path: ${vDevData.path}.`);
			diskVDev.value = createMissingDisk(vDev.path, vDev.name, vDevType, poolName);
			// vDevData.status = "DEGRADED";
			// vDevData.errors!.push("VDev is degraded due to missing disk.");
			// } else {
			// 	allDisksMissing = false;
		}

		if (vDevData.path!.match(phyPathRegex)) {
			diskPath.value = diskVDev.value.phy_path;
			diskName.value = diskVDev.value.phy_path.replace(phyPathPrefix, '');
		} else if (vDevData.path!.match(nvmePathRegex)) { // Check for NVMe path match
			diskPath.value = diskVDev.value.sd_path; // NVMe paths will use sd_path
			diskName.value = diskVDev.value.sd_path.replace(sdPathPrefix, '');
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
			type: diskVDev.value!.type,
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
			vDevType: vDevType,
			errors: errors
		};

		if (!vDevData.disks.some(disk => disk.guid === notAChildDisk.guid)) {
			vDevData.disks.push(notAChildDisk);
		}

	} else {
		vDev.children.forEach(child => {
			handleDiskChild(child, vDevData, disks, vDev.name, poolName, vDevType);
		});
	}


	vDevs.value.push(vDevData);
}

function handleDiskChild(child, vDevData, disks, vDevName, poolName, vDevType) {
	let fullDiskData: DiskData = disks.value.find(disk => {
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
		health: fullDiskData.health,
		stats: child.stats || {},
		capacity: fullDiskData.capacity || 'Unknown',
		model: fullDiskData.model || 'Unknown',
		phy_path: fullDiskData.phy_path,
		sd_path: fullDiskData.sd_path,
		vdev_path: fullDiskData.vdev_path,
		serial: fullDiskData.serial || 'Unknown',
		powerOnHours: fullDiskData.powerOnHours || 0,
		powerOnCount: fullDiskData.powerOnCount || '0',
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

	return childDisk;
}

// function createMissingDisk(path, vDevName, vDevType, poolName) {
// 	console.log(`Creating placeholder for missing disk at path: ${path}`);
// 	return {
// 		name: 'Missing Disk',
// 		path: path,
// 		guid: 'N/A',
// 		type: 'N/A',
// 		health: 'MISSING',
// 		stats: {},
// 		capacity: 'N/A',
// 		model: 'N/A',
// 		phy_path: path,
// 		sd_path: '',
// 		vdev_path: '',
// 		serial: 'N/A',
// 		powerOnHours: 0,
// 		powerOnCount: '0',
// 		temp: '0',
// 		rotationRate: 0,
// 		vDevName: vDevName,
// 		poolName: poolName,
// 		vDevType: vDevType,
// 		errors: [`Disk missing from pool: ${poolName}, vDev: ${vDevName}`],
// 	};
// }
function createMissingDisk(path, vDevName, vDevType, poolName) {
	console.warn(`Creating placeholder for missing disk at path: ${path || 'Unknown Path'}`);
	return {
		name: 'Missing Disk',
		path: path || 'Unknown Path',
		guid: 'N/A',
		type: 'N/A',
		health: 'MISSING',
		stats: {},
		capacity: 'N/A',
		model: 'N/A',
		phy_path: path || 'Unknown Path',
		sd_path: '',
		vdev_path: '',
		serial: 'N/A',
		powerOnHours: 0,
		powerOnCount: '0',
		temp: '0',
		rotationRate: 0,
		vDevName: vDevName,
		poolName: poolName,
		vDevType: vDevType,
		errors: [`Disk missing from pool: ${poolName}, vDev: ${vDevName}`],
	};
}

// Function to determine the type of disks in a VDev
function determineDiskType(vDev, disks) {
	const childDisks = vDev.children.map(child => child.name);

	const diskTypes = childDisks.map(diskName => {
		const disk = disks.value.find(disk => disk.name === diskName);
		return disk ? disk.type : 'MISSING'; // Mark as 'MISSING' if disk not found
	});

	// Determine the disk type based on the types of child disks in the VDev
	const uniqueDiskTypes = new Set(diskTypes);

	if (uniqueDiskTypes.has('MISSING')) {
		return 'MISSING';
	} else if (uniqueDiskTypes.size === 1) {
		return Array.from(uniqueDiskTypes)[0]; // Return the single type if all disks are the same
	} else if (uniqueDiskTypes.has('SSD') || uniqueDiskTypes.has('HDD') || uniqueDiskTypes.has('NVMe')) {
		return 'Hybrid'; // Mixed SSD, HDD, or NVMe
	} else {
		return 'Unknown';
	}
} */