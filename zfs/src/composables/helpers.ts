import { reactive, ref, inject, Ref, computed, provide } from 'vue';

//change true to 'on' and false to 'off'
export function isBoolOnOff(bool : boolean) {
	if (bool) {return 'on'} else {return 'off'}
}

//change 'on' to true and 'off' to false
export function onOffToBool(state : string) {
    if (state == 'on') { return true } else if (state == 'off') { return false }
}

//change the first letter of a word to upper case
export const upperCaseWord = (word => {
	let firstLetter  = word.charAt(0);
	let remainingLetters = word.substring(1);
	let firstLetterCap = firstLetter.toUpperCase();
	return firstLetterCap + remainingLetters;
});

//convert raw bytes to readable data size
export const convertBytesToSize = (bytes) => {
	if (bytes === 0) {
        return `0 B`;
    }

    const sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const convertedSize = (bytes / Math.pow(1024, i)).toFixed(2);
  
    return `${convertedSize} ${sizes[i]}`;
};

export const convertBytesToSizeDecimal = (bytes) => {
	if (bytes === 0) {
        return `0 B`;
    }

	const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const convertedSize = (bytes / Math.pow(1000, i)).toFixed(2);
  
    return `${convertedSize} ${sizes[i]}`;
};
  
//convert readable data size to raw bytes
export const convertSizeToBytes = (size) => {
    const sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
    const [value, unit] = size.match(/(\d+\.?\d*)\s?(\w+)/i).slice(1);

    const index = sizes.findIndex((sizeUnit) => sizeUnit.toLowerCase() === unit.toLowerCase());
    const bytes = parseFloat(value) * Math.pow(1024, index);
    
    return bytes;
};

export const convertSizeToBytesDecimal = (size) => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const [value, unit] = size.match(/(\d+\.?\d*)\s?(\w+)/i).slice(1);

    const index = sizes.findIndex((sizeUnit) => sizeUnit.toLowerCase() === unit.toLowerCase());
    const bytes = parseFloat(value) * Math.pow(1000, index); // Use 1000 for decimal prefixes

    return bytes;
};


//get size number from data size string
export const getSizeNumberFromString = (sizeString) => {
	const [value, unit] = sizeString.split(' ');
	const numericValue = parseFloat(value);
	return numericValue;
}

//get size unit from data size string
export const getSizeUnitFromString = (sizeString) => {
	const [value, unit] = sizeString.split(' ');

	return unit;
}

export const getQuotaRefreservUnit = (bytes) => {
    const sizes = ['kib', 'mib', 'gib', 'tib'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    if (i === 0) {
        return `${bytes} Bytes`;
    }
    
    const convertedSize = (bytes / Math.pow(1024, i)).toFixed(2);
  
    return `${convertedSize} ${sizes[i-1]}`;
};

//get a string output of the current timestamp
export function getTimestampString() {
	const currentDateTime = new Date();
	const timestampString = currentDateTime.toLocaleString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	});

	//console.log("timestampString:", timestampString);
	
	return timestampString;
}

export function getTimestamp() {
	const currentDateTime = new Date();
  
	const year = currentDateTime.getFullYear();
	const month = String(currentDateTime.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-based
	const day = String(currentDateTime.getDate()).padStart(2, '0');
	const hour = String(currentDateTime.getHours()).padStart(2, '0');
	const minute = String(currentDateTime.getMinutes()).padStart(2, '0');
	const second = String(currentDateTime.getSeconds()).padStart(2, '0');
  
	const timestamp = `${year}.${month}.${day}-${hour}.${minute}.${second}`;
  
	return timestamp;
}

export function convertRawTimestampToString(rawTimestamp) {
	const date = new Date(rawTimestamp * 1000);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0'); 
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');

	const timestamp = `${year}.${month}.${day}-${hours}.${minutes}.${seconds}`;
  
	return timestamp;
}

export const getPoolDiskType = (pool) => {
	let hasSSD = false;
	let hasHDD = false;
  
	pool.vdevs.forEach((vdev) => {
	  vdev.disks.forEach((disk) => {
		if (disk.type === "SSD") {
		  hasSSD = true;
		} else if (disk.type === "HDD") {
		  hasHDD = true;
		}
	  });
	});
  
	// Determine the disk configuration based on the flags.
	if (hasSSD && hasHDD) {
	  return "Hybrid";
	} else if (hasSSD) {
	  return "SSD";
	} else if (hasHDD) {
	  return "HDD";
	} else {
	  return "Unknown"; // No disks found
	}
};
  
export function getParentPath(datasetName) {
	const segments = datasetName.split('/');
	segments.pop();
	return segments.join('/');
}

export function convertSecondsToString(seconds) {
    let result = '';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
        result += `${hours} hour${hours > 1 ? 's' : ''} `;
    }
    
    if (minutes > 0) {
        result += `${minutes} minute${minutes > 1 ? 's' : ''} `;
    }

    if (hours === 0 && minutes === 0) {
        result += `${seconds} second${seconds > 1 ? 's' : ''} `;
    }
    
    return result.trim();
}