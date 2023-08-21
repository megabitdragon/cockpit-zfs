import { reactive, ref, Ref, inject, computed, provide } from 'vue';
import { getPools } from "./pools";
import { getDisks } from "./disks";
import { getDatasets } from "./datasets";
import { getTimestampString, convertBytesToSize, convertSizeToBytes, isBoolOnOff, onOffToBool, upperCaseWord, getQuotaRefreservUnit, getSizeNumberFromString, getSizeUnitFromString } from "./helpers";

const vDevs = ref<vDevData[]>([]);

export async function loadDisksThenPools(disks, pools) {
	//executes a python script to retrieve all disk data and outputs a JSON
	try {
		const rawJSON = await getDisks();
		const parsedJSON = JSON.parse(rawJSON);
		console.log('Disks JSON:');
		console.log(parsedJSON);

		//loops through and adds disk data from JSON to disk data object, pushes objects to disks array
		for (let i = 0; i < parsedJSON.length; i++) {
			const disk = {
				name: parsedJSON[i].name,
				capacity: parsedJSON[i].capacity,
				model: parsedJSON[i].model,
				type: parsedJSON[i].type,
				phy_path: parsedJSON[i].phy_path,
				sd_path: parsedJSON[i].sd_path,
				vdev_path: parsedJSON[i].vdev_path,
				serial: parsedJSON[i].serial,
				usable: parsedJSON[i].usable,
				path: '',
				guid: '',
				status: parsedJSON[i].health,
				powerOnHours: parsedJSON[i].power_on_time,
				powerOnCount: parsedJSON[i].power_on_count,
				temp: parsedJSON[i].temp,
				rotationRate: parsedJSON[i].rotation_rate,
				stats: {},
			};
			disks.value.push(disk);
		// console.log("Disk:");
		// console.log(disk);
		}
		console.log("Disks:");
		console.log(disks);

		//executes a python script to retrieve all pool data and outputs a JSON
		try {
			const rawJSON = await getPools();
			const parsedJSON = JSON.parse(rawJSON);
			console.log('Pools JSON:');
			console.log(parsedJSON);

			//loops through pool JSON
			for (let i = 0; i < parsedJSON.length; i++) {
				//calls parse function for each type of VDev that could be in the Pool, then pushes the VDev data to VDev array
				parsedJSON[i].groups.data.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, disks, 'data'));
				parsedJSON[i].groups.cache.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, disks, 'cache'));
				parsedJSON[i].groups.dedup.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, disks, 'dedup'));
				parsedJSON[i].groups.log.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, disks, 'log'));
				parsedJSON[i].groups.spare.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, disks, 'spare'));
				parsedJSON[i].groups.special.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, disks, 'special'));
				
				//adds pool data from JSON into pool data object, pushes into array 
				const poolData = {
					name: parsedJSON[i].name,
					status: parsedJSON[i].status,
					guid: parsedJSON[i].guid,
					properties: {
						rawsize: parsedJSON[i].properties.size.parsed,
						size: convertBytesToSize(parsedJSON[i].properties.size.parsed),
						allocated: convertBytesToSize(parsedJSON[i].properties.allocated.parsed),
						capacity: parsedJSON[i].properties.capacity.rawvalue,
						free:  convertBytesToSize(parsedJSON[i].properties.free.parsed),
						readOnly: parsedJSON[i].properties.readonly.parsed,
						sector: parsedJSON[i].properties.ashift.rawvalue,
						record: parsedJSON[i].root_dataset.properties.recordsize.value,
						compression: parsedJSON[i].root_dataset.properties.compression.parsed,
						deduplication: isBoolOnOff(parsedJSON[i].root_dataset.properties.dedup.parsed),
						refreservationRawSize: parsedJSON[i].root_dataset.properties.refreservation.parsed,
						autoExpand: parsedJSON[i].properties.autoexpand.parsed,
						autoReplace: parsedJSON[i].properties.autoreplace.parsed,
						autoTrim: isBoolOnOff(parsedJSON[i].properties.autotrim.parsed),
						delegation: parsedJSON[i].properties.delegation.parsed,
						displaySnapshots: parsedJSON[i].properties.listsnapshots.parsed,
						multiHost: isBoolOnOff(parsedJSON[i].properties.multihost),
					},
					failMode: parsedJSON[i].properties.failmode.parsed,
					comment: parsedJSON[i].properties.comment.value,
					
					//adds VDev array to Pool data object
					vdevs: vDevs.value,

					// fileSystems: parsedJSON[i].root_dataset.value,
				}
				
				pools.value.push(poolData);

				// console.log("poolData:");
				// console.log(poolData);
				vDevs.value = [];
			}

			console.log("Pools:");
			console.log(pools);
		} catch (error) {
			// Handle any errors that may occur during the asynchronous operation
			console.error("An error occurred getting pools:", error);
		}
	} catch (error) {
		// Handle any errors that may occur during the asynchronous operation
		console.error("An error occurred getting disks/pools:", error);
	}
}

export async function loadDatasets(datasets) {
	//executes a python script to retrieve all dataset data and outputs a JSON
	try {
		const rawJSON = await getDatasets();
		const parsedJSON = JSON.parse(rawJSON);
		console.log('Datasets JSON:');
		console.log(parsedJSON);

		//loops through JSON data and adds data to a Dataset object
		for (let i = 0; i < parsedJSON.length; i++) {
			const dataset : FileSystemData = {
				name: parsedJSON[i].name,
				id: parsedJSON[i].id,
				mountpoint: parsedJSON[i].properties.mountpoint.value,
				pool: parsedJSON[i].pool,
				encrypted: parsedJSON[i].encrypted,
				key_loaded: parsedJSON[i].key_loaded,
				type: parsedJSON[i].type,
				inherit: false,
				properties: {
					guid: parsedJSON[i].properties.guid.parsed,
					encryption: parsedJSON[i].properties.encryption.parsed,
					accessTime: parsedJSON[i].properties.atime.value,
					caseSensitivity: parsedJSON[i].properties.casesensitivity.value,
					compression: parsedJSON[i].properties.compression.value,
					deduplication: parsedJSON[i].properties.dedup.value,
					dNodeSize: parsedJSON[i].properties.dnodesize.value,
					extendedAttributes: parsedJSON[i].properties.xattr.value,
					recordSize: parsedJSON[i].properties.recordsize.value,
					quota: {
						value: parsedJSON[i].properties.quota.value,
						raw: parsedJSON[i].properties.quota.parsed,
						unit: getSizeUnitFromString(getQuotaRefreservUnit(parsedJSON[i].properties.quota.parsed)),
					},
					readOnly: parsedJSON[i].properties.readonly.value,
					isReadOnly: onOffToBool(parsedJSON[i].properties.readonly.value),
					available: parsedJSON[i].properties.available.parsed,
					creation: parsedJSON[i].properties.creation.value,
					snapshotCount: parsedJSON[i].properties.snapshot_count.value,
					mounted: parsedJSON[i].properties.mounted.value,
					usedbyRefreservation: convertBytesToSize(parsedJSON[i].properties.usedbyrefreservation.parsed),
					usedByDataset: convertBytesToSize(parsedJSON[i].properties.usedbydataset.parsed),
					canMount: parsedJSON[i].properties.canmount.value,
					aclInheritance: parsedJSON[i].properties.aclinherit.value,
					aclType: parsedJSON[i].properties.acltype.value,
					checksum: parsedJSON[i].properties.checksum.value,
					refreservation: {
						raw: parsedJSON[i].properties.refreservation.parsed,
						value: parsedJSON[i].properties.refreservation.value,
						unit: getSizeUnitFromString(getQuotaRefreservUnit(parsedJSON[i].properties.refreservation.parsed)),
					},
					used: parsedJSON[i].properties.used.parsed,
					
				},
				children: parsedJSON[i].children,
			}

			datasets.value.push(dataset);
		}

		console.log("Datasets");
		console.log(datasets);

	} catch (error) {
		// Handle any errors that may occur during the asynchronous operation
		console.error("An error occurred getting datasets:", error);
	}
}

export async function loadDisks(disks) {
	try {
		const rawJSON = await getDisks();
		const parsedJSON = JSON.parse(rawJSON);
		console.log('Disks JSON:');
		console.log(parsedJSON);
		
		//loops through and adds disk data from JSON to disk data object, pushes objects to disks array
		for (let i = 0; i < parsedJSON.length; i++) {
			const disk = {
                name: parsedJSON[i].name,
                capacity: parsedJSON[i].capacity,
                model: parsedJSON[i].model,
                type: parsedJSON[i].type,
                phy_path: parsedJSON[i].phy_path,
                sd_path: parsedJSON[i].sd_path,
                vdev_path: parsedJSON[i].vdev_path,
                serial: parsedJSON[i].serial,
                usable: parsedJSON[i].usable,
                path: '',
                guid: '',
                status: parsedJSON[i].health,
                powerOnHours: parsedJSON[i].power_on_time,
                powerOnCount: parsedJSON[i].power_on_count,
                temp: parsedJSON[i].temp,
                rotationRate: parsedJSON[i].rotation_rate,
                stats: {},
			}
			disks.value.push(disk);
			// console.log("Disk:");
			// console.log(disk);
		}
		console.log("Disks:");
		console.log(disks);

	} catch (error) {
		// Handle any errors that may occur during the asynchronous operation
		console.error("An error occurred getting disks:", error);
	}
}

//method for parsing through VDevs to add to array (VDev array is added to Pool)
export function parseVDevData(vDev, poolName, disks, vDevType) {
	const vDevData : vDevData = {
		name: vDev.name,
		type: vDevType,
		status: vDev.status,
		stats: vDev.stats,
		guid: vDev.guid,
		selectedDisks: [],
		disks: [],
		poolName: poolName,
	};
	
	//checks if VDev has child disks and if not, stores the disk information as the VDev itself (vdev-level disks) then adds to VDev array
	if (vDev.children.length < 1) {
		const diskVDev = disks.value.find(disk => disk.name === vDev.name)!;
		const notAChildDisk : DiskData = {
			name: diskVDev.name,
			path: vDev.path,
			guid: vDev.guid,
			type: diskVDev.type,
			status: diskVDev.health,
			stats: vDev.stats,
			capacity: diskVDev.capacity,
			model: diskVDev.model,
			phy_path: diskVDev.phy_path,
			sd_path: diskVDev.sd_path,
			vdev_path: diskVDev.vdev_path,
			serial: diskVDev.serial,
			usable: false,
			powerOnHours: diskVDev.powerOnHours,
			powerOnCount: diskVDev.powerOnCount,
			temp: diskVDev.temp,
			rotationRate: diskVDev.rotationRate,
			vDevName: vDev.name,
			poolName: poolName,
		}
		vDevData.type = vDevType;
		vDevData.disks.push(notAChildDisk);
		// console.log("Not A ChildDisk:");
		// console.log(notAChildDisk);
		console.log("vDevData (disk device):");
		console.log(vDevData);
		vDevs.value.push(vDevData);
	} else {
		//if VDev does have child disks, add those disks to the VDev data object + array
		vDev.children.forEach(disk1 => {
			const fullDiskData = disks.value.find(disk => disk.name === disk1.name)!;
			const childDisk : DiskData = {
				name: fullDiskData.name,
				path: fullDiskData.path,
				guid: fullDiskData.guid,
				type: fullDiskData.type,
				status: fullDiskData.status,
				stats: fullDiskData.stats,
				capacity: fullDiskData.capacity,
				model: fullDiskData.model,
				phy_path: fullDiskData.phy_path,
				sd_path: fullDiskData.sd_path,
				vdev_path: fullDiskData.vdev_path,
				serial: fullDiskData.serial,
				usable: false,
				powerOnHours: fullDiskData.powerOnHours,
				powerOnCount: fullDiskData.powerOnCount,
				temp: fullDiskData.temp,
				rotationRate: fullDiskData.rotationRate,
				vDevName: vDev.name,
				poolName: poolName,
			}; 

			// console.log("ChildDisk:");
			// console.log(childDisk);
			vDevData.disks.push(childDisk);

		});
	
		console.log("vDevData:");
		console.log(vDevData);
		vDevs.value.push(vDevData);
	}
}

export function loadSnapshots(snapshots) {
	
}