import { reactive, ref, Ref, inject, computed, provide } from 'vue';
import { getPools } from "./pools";
import { getDisks } from "./disks";
import { getDatasets } from "./datasets";

// const pools = ref<PoolData[]>([]);
const vDevs = ref<vDevData[]>([]);
// const disks = ref<DiskData[]>([]);
// const datasets = ref<Dataset[]>([]);
// const pools = inject<Ref<PoolData[]>>('pools')!;
// const disks = inject<Ref<DiskData[]>>('disks')!;
//const datasets = inject<Ref<Dataset[]>>('datasets')!;

export function loadDisksThenPools(disks, pools) {
	//executes python script to retrieve all disks in server and output a JSON
	getDisks().then(rawJSON => {
		const parsedJSON = (JSON.parse(rawJSON));
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
		// console.log("Disks:");
		// console.log(disks);

		//executes a python script to retrieve all zfs pools on server and output a JSON
		getPools().then(rawJSON => {
				const parsedJSON = (JSON.parse(rawJSON));
				console.log('Pools JSON:');
				console.log(parsedJSON);

				//loops through pool JSON
				for (let i = 0; i < parsedJSON.length; i++) {
					//calls parse function for each type of VDev that could be in the Pool, then pushes the VDev data to VDev array
					parsedJSON[i].groups.data.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, disks));
					parsedJSON[i].groups.cache.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, disks));
					parsedJSON[i].groups.dedup.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, disks));
					parsedJSON[i].groups.log.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, disks));
					parsedJSON[i].groups.spare.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, disks));
					parsedJSON[i].groups.special.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, disks));
					
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
						},
						//adds VDev array to Pool data object
						vdevs: vDevs.value,
						// fileSystems: parsedJSON[i].root_dataset.value,
					}
					
					pools.value.push(poolData);

					// console.log("poolData:");
					// console.log(poolData);
					vDevs.value = [];
				}
				// console.log("Pools:");
				// console.log(pools);
		});
	});
}

export function loadDatasets(datasets) {
	//executes a python script to retrieve all dataset data and outputs a JSON
	getDatasets().then(rawJSON => {
		const parsedJSON = (JSON.parse(rawJSON));
		console.log('Datasets JSON:');
		console.log(parsedJSON);

		//loops through JSON data and adds data to a Dataset object
		for (let i = 0; i < parsedJSON.length; i++) {
			const dataset : Dataset = {
					name: parsedJSON[i].name,
					id: parsedJSON[i].id,
					mountpoint: parsedJSON[i].mountpoint,
					pool: parsedJSON[i].pool,
					encrypted: parsedJSON[i].encrypted,
					key_loaded: parsedJSON[i].key_loaded,
					type: parsedJSON[i].type,
					properties: {
						available: convertBytesToSize(parsedJSON[i].properties.available.parsed),
						creation: parsedJSON[i].properties.creation.value,
						snapshotCount: parsedJSON[i].properties.snapshot_count.value,
						usedbyRefreservation: convertBytesToSize(parsedJSON[i].properties.usedbyrefreservation.parsed),
						usedByDataset: convertBytesToSize(parsedJSON[i].properties.usedbydataset.parsed),
						accessTime: parsedJSON[i].properties.atime.value,
						caseSensitivity: parsedJSON[i].properties.casesensitivity.value,
						compression: parsedJSON[i].properties.compression.value,
						deduplication: parsedJSON[i].properties.dedup.value,
						dNodeSize: parsedJSON[i].properties.dnodesize.value,
						extendedAttributes: '',
						readOnly: parsedJSON[i].properties.readonly.value,
						recordSize: parsedJSON[i].properties.recordsize.value,
						quota: parsedJSON[i].properties.quota.value,
						mounted: parsedJSON[i].properties.mounted.value,
					},
			}

			datasets.value.push(dataset);
		}
	});
}

export function loadDisks(disks) {
	getDisks().then(rawJSON => {
		const parsedJSON = (JSON.parse(rawJSON));
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
		// console.log("Disks:");
		// console.log(disks);

	});
}

export function loadData(disks, pools, datasets) {
	loadDisksThenPools(disks, pools);
	loadDatasets(datasets);
}

//method for parsing through VDevs to add to array (VDev array is added to Pool)
export function parseVDevData(vDev, poolName, disks) {
	const vDevData : vDevData = {
		name: vDev.name,
		type: vDev.type,
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
			status: vDev.status,
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
		
		vDevData.disks.push(notAChildDisk);
		//console.log("Not A ChildDisk:");
		//console.log(notAChildDisk);
		//console.log("vDevData after not a child:");
		//console.log(vDevData);
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
	
		//console.log("vDevData:");
		//console.log(vDevData);
		vDevs.value.push(vDevData);
	}
}

//convert raw bytes to readable data size
const convertBytesToSize = (bytes) => {
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	const convertedSize = (bytes / Math.pow(1024, i)).toFixed(2);
	return `${convertedSize} ${sizes[i]}`;
};

export function loadSnapshots(snapshots) {
	
}