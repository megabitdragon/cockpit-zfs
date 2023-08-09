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
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const convertedSize = (bytes / Math.pow(1024, i)).toFixed(2);
  
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
  
    return `${convertedSize} ${sizes[i]}`;
};

//get a string output of the current timestamp
export const getTimestampString = computed(() => {
	const currentDateTime = new Date();
	const timestampString = currentDateTime.toLocaleString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	});

	return timestampString;
});