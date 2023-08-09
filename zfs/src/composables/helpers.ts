import { reactive, ref, inject, Ref, computed, provide } from 'vue';

export function isBoolOnOff(bool : boolean) {
	if (bool) {return 'on'} else {return 'off'}
}

export function onOffToBool(state : string) {
    if (state == 'on') { return true } else if (state == 'off') { return false }
}

export const upperCaseWord = (word => {
	let firstLetter  = word.charAt(0);
	let remainingLetters = word.substring(1);
	let firstLetterCap = firstLetter.toUpperCase();
	return firstLetterCap + remainingLetters;
});

//convert raw bytes to readable data size
export const convertBytesToSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const convertedSize = (bytes / Math.pow(1024, i)).toFixed(2);
  
    return `${convertedSize} ${sizes[i]}`;
};
  
  //convert readable data size to raw bytes
export const convertSizeToBytes = (size) => {
    const sizes = ['B', 'KiB', 'MiB'];
    const [value, unit] = size.match(/(\d+\.?\d*)\s?(\w+)/i).slice(1);

    const index = sizes.findIndex((sizeUnit) => sizeUnit.toLowerCase() === unit.toLowerCase());
    const bytes = parseFloat(value) * Math.pow(1024, index);
    
    return bytes;
};

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