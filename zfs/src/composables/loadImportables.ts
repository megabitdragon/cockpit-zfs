import { ref } from 'vue';
import { getImportablePools, getImportableDestroyedPools } from "./pools";
import { loadDisksExtraData, parseVDevData } from './loadData';

const vDevs = ref<ImportablePoolvDevData[]>([]);

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
            
        console.log("loaded Importable Pools:", importablePools);

        await loadDisksExtraData(allDisks.value, existingPools.value);

        console.log("loaded Disks:", allDisks);

    } catch (error) {
        // Handle any errors that may occur during the asynchronous operation
        console.error("An error occurred getting Importable pools:", error);
    }
}
