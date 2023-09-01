import { reactive, ref, Ref, inject, computed, provide } from 'vue';
import { getPools, getImportablePools, getImportableDestroyedPools } from "./pools";
import { getDisks } from "./disks";
import { getDatasets } from "./datasets";
import { getPoolDiskType, getTimestampString, convertBytesToSize, convertSizeToBytes, isBoolOnOff, onOffToBool, upperCaseWord, getQuotaRefreservUnit, getSizeNumberFromString, getSizeUnitFromString } from "./helpers";

const vDevs = ref<ImportablePoolvDevData[]>([]);

export async function loadImportablePools(pools) {
	try {
		const rawJSON = await getImportablePools();
		const parsedJSON = JSON.parse(rawJSON);
		console.log('Importable Pools JSON:', parsedJSON);
		
		for (let i = 0; i < parsedJSON.length; i++) {
			//calls parse function for each type of VDev that could be in the Pool, then pushes the VDev data to VDev array
            parsedJSON[i].groups.data.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, 'data'));
            parsedJSON[i].groups.cache.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, 'cache'));
            parsedJSON[i].groups.dedup.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, 'dedup'));
            parsedJSON[i].groups.log.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, 'log'));
            parsedJSON[i].groups.spare.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, 'spare'));
            parsedJSON[i].groups.special.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, 'special'));
            
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
            pools.push(poolData);
            vDevs.value = [];
		}

      
	} catch (error) {
		// Handle any errors that may occur during the asynchronous operation
		console.error("An error occurred getting importable pools:", error);
	}
}

//method for parsing through VDevs to add to array (VDev array is added to Pool)
export function parseVDevData(vDev, poolName, vDevType) {
	const vDevData : ImportablePoolvDevData = {
        name: vDev.name,
        type: vDevType,
        status: vDev.status,
        guid: vDev.guid,
        stats: vDev.stats,
        disks: vDev.children,
        poolName: poolName,
    }
    vDevs.value.push(vDevData);
}

export async function loadImportableDestroyedPools(pools) {
    try {
		const rawJSON = await getImportableDestroyedPools();
		const parsedJSON = JSON.parse(rawJSON);
		console.log('Destroyed Pools JSON:', parsedJSON);
		
		for (let i = 0; i < parsedJSON.length; i++) {
			//calls parse function for each type of VDev that could be in the Pool, then pushes the VDev data to VDev array
            parsedJSON[i].groups.data.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, 'data'));
            parsedJSON[i].groups.cache.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, 'cache'));
            parsedJSON[i].groups.dedup.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, 'dedup'));
            parsedJSON[i].groups.log.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, 'log'));
            parsedJSON[i].groups.spare.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, 'spare'));
            parsedJSON[i].groups.special.forEach(vDev => parseVDevData(vDev, parsedJSON[i].name, 'special'));
            
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
            pools.push(poolData);
            vDevs.value = [];
		}

      
	} catch (error) {
		// Handle any errors that may occur during the asynchronous operation
		console.error("An error occurred getting importable pools:", error);
	}
}
