<template>
    <div>
        <div v-if="!isDisk">
            <div v-if="!isPoolList">
                <div v-if="!isTrim">
                    <div class="grid grid-cols-4 gap-1 justify-items-center">
                        <span class="col-span-4" :class="stateMessageClass()">
                            {{ stateMessage }}
                        </span>

                        <div v-if="scanObjectGroup[props.pool.name].state !== null" class="col-span-4 grid grid-cols-4 justify-items-center">
                            <div class="col-span-4 min-w-max w-full bg-well rounded-full relative flex h-6 min-h-min max-h-max overflow-hidden">
                                <div :class="progressBarClass()" class="h-6 min-h-min max-h-max" :style="{ width: `${parseFloat(scanPercentage.toFixed(2))}%` }">
                                    <div class="absolute inset-0 flex items-center justify-center text-s font-medium text-default text-center p-0.5 leading-none">
                                        {{ parseFloat(scanPercentage.toFixed(2)) }}%
                                    </div>
                                </div>
                            </div>

                            <span class="text-muted col-span-4">
                                {{ amountProcessed }} of {{ amountTotal }} processed. <br/>
                            </span>

                            <span v-if="isScanning && !isPaused" class="col-span-4">
                                Completes in {{ timeRemaining }}.                    
                            </span>
                            <span v-if="isScanning && isPaused" class="col-span-4">
                                Resume to continue or cancel to stop.                    
                            </span>
                        </div>
                    </div>
                </div>
                <div v-if="isTrim">
                    <div class="grid grid-cols-4 gap-1 justify-items-center">
                        <div v-if="isTrimActive || isTrimSuspended || isTrimFinished || isTrimCanceled" v-for="disk, idx in poolDiskStats[props.pool.name]" class="col-span-4">
                            <span class="col-span-4" :class="trimMessageClass()">
                                {{ trimMessage(disk) }}
                            </span>
                            <div class="col-span-4 grid grid-cols-4 justify-items-center">
                                
                                <div class="col-span-4 min-w-max w-full bg-well rounded-full relative flex h-4 min-h-min max-h-max overflow-hidden">
                                    <div :class="trimProgressBarClass()" class="h-4 min-h-min max-h-max" :style="{ width: `${handleTrimPercentage(parseFloat(getTrimPercentage(disk).toFixed(2)))}%` }">
                                        <div class="absolute inset-0 flex items-center justify-center text-s font-medium text-default text-center p-0.5 leading-none">
                                            {{ handleTrimPercentage(parseFloat(getTrimPercentage(disk).toFixed(2))) }}%
                                        </div>
                                    </div>
                                </div>
                                <span class="text-muted col-span-4">
                                    {{ getTrimmedAmount(disk) }} of {{ getTrimmedTotal(disk) }} processed. <br/>
                                </span>
                            </div>
                        </div>
                        <div v-if="isTrimSuspended" class="col-span-4">
                            Resume to continue or cancel to stop.     
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="isPoolList">
                <div class="grid-grid-cols-2 gap-1 justify items-center">
                    <div v-if="scanObjectGroup[props.pool.name].state !== null" class="col-span-2">
                        <span :class="stateMessageClass()">
                            {{ miniStateMsg }}
                        </span>
                        <div class="min-w-max w-full bg-well rounded-full relative flex h-4 min-h-min max-h-max overflow-hidden">
                            <div :class="progressBarClass()" class="h-4 min-h-min max-h-max" :style="{ width: `${parseFloat(scanPercentage.toFixed(2))}%` }">
                                <div class="absolute inset-0 flex items-center justify-center text-xs font-medium text-default text-center p-0.5 leading-none">
                                    {{ amountProcessed }}/{{ amountTotal }} 
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="scanObjectGroup[props.pool.name].state === null" class="col-span-2">
                        <span class="mt-2" :class="stateMessageClass()">
                            {{ miniStateMsg }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isDisk">
            <div class="grid grid-cols-2">
                <div v-if="selectedDisk!.stats.trim_notsup === 0" class="col-span-2 flex flex-col items-center justify-center">
                    <span :class="trimMessageClass()">
                        Disk {{selectedDisk!.name}} Trim {{ upperCaseWord(getTrimState(selectedDisk!.stats.trim_state)) }}:  {{ handleTrimPercentage(parseFloat(getTrimPercentage(selectedDisk!).toFixed(2))) }}%
                    </span>
                    <div class="min-w-fit w-full bg-well rounded-full relative flex h-4 min-h-min max-h-max overflow-hidden">
                        <div :class="trimProgressBarClass()" class="h-4 min-h-min max-h-max" :style="{ width: `${handleTrimPercentage(parseFloat(getTrimPercentage(selectedDisk!).toFixed(2)))}%` }">
                            <div class="absolute inset-0 flex items-center justify-center text-xs font-medium text-default text-center p-0.5 leading-none">
                                {{ getTrimmedAmount(selectedDisk!) }}/{{ getTrimmedTotal(selectedDisk!) }}
                            </div>
                        </div>
                    </div>
                 
                </div>
                <div v-if="selectedDisk!.stats.trim_notsup === 1" class="col-span-2 flex items-center justify-center">
                    <span class="mt-2 text-muted">
                        Trim not suppported.
                    </span>
                </div>    
            </div>
            
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, inject, Ref, computed, ComputedRef, onMounted, watch } from "vue";
import { convertBytesToSize, convertSecondsToString, convertRawTimestampToString, upperCaseWord } from "../../composables/helpers";
import { loadScanObjectGroup, loadDiskStats } from "../../composables/loadData";

interface StatusProps {
    pool: PoolData;
    disk?: DiskData;
    isPoolList: boolean;
    isPoolDetail: boolean;
    isDisk: boolean;
    isTrim: boolean;
    pollScan?: boolean;
    pollTrim?: boolean;
}

const props = defineProps<StatusProps>();
const notifications = inject<Ref<any>>('notifications')!;


/////////////////////////////////////////////////////

const emit = defineEmits(['scanDone', 'trimDone']);

// onMounted(() => {
//     doPollScan();
//     doTrimScan();
// });

///////////////////// Scanning //////////////////////
/////////////////////////////////////////////////////

const scanObjectGroup = inject<Ref<PoolScanObjectGroup>>('scan-object-group')!;

const isScanning = inject<Ref<boolean>>('is-scanning')!;
const isFinished = inject<Ref<boolean>>('is-finished')!;
const isCanceled = inject<Ref<boolean>>('is-canceled')!;
const isPaused = inject<Ref<boolean>>('is-paused')!;

const pollScan = inject<Ref<boolean>>('poll-scan-now')!;
const scanActivity = inject<Ref<Activity>>('scan-activity')!;

const doPollScan = () => {
    watch(pollScan, (newVal, oldVal) => {
        if (pollScan.value) {
            pollScanStatus();
            scanActivity.value.isActive = isScanning.value;
            scanActivity.value.isPaused = isPaused.value;
            emit('scanDone', scanActivity.value);
        }
    });
}

function getScanStateBool(state) : ComputedRef<boolean> {
	return computed(() => {
		return scanObjectGroup.value[props.pool.name].state === state;
	});
}

function getScanPauseBool(pause) : ComputedRef<boolean> {
	return computed(() => {
		return scanObjectGroup.value[props.pool.name].pause !== pause;
	});
}

// const isScanning = ref(false);
// const isFinished = ref(false);
// const isCanceled = ref(false);
// const isPaused = ref(false);

async function getScanComputedProps() {
	isScanning.value = getScanStateBool('SCANNING').value;
	isFinished.value = getScanStateBool('FINISHED').value;
	isCanceled.value = getScanStateBool('CANCELED').value;
	isPaused.value = getScanPauseBool('None').value;
}

const scanIntervalID = inject<Ref<any>>('scan-interval')!;
const scanning = ref(false);

async function scanNow() {
	await loadScanObjectGroup(scanObjectGroup);
}

function startScanInterval() {
	if (!scanIntervalID.value) {
        console.log('scan interval set', scanIntervalID.value);
		scanIntervalID.value = setInterval(scanNow, 3000);
	}
}

function stopScanInterval() {
	if (scanIntervalID.value) {
        console.log('scan interval cleared', scanIntervalID.value);
		clearInterval(scanIntervalID.value);
		scanIntervalID.value = null;
	}
}

watch(scanning, (newVal, oldVal) => {
	if (scanning.value) {
		startScanInterval();
	} else if (!scanning.value) {
		stopScanInterval();
	}
}, {immediate: true});

function displayScanBools() {
	console.log('--------scan-values-------');
	console.log('SCAN:', props.pool.name, 'isScanning:', isScanning.value);
	console.log('SCAN:', props.pool.name, 'scanning:', scanning.value);
	console.log('SCAN:', props.pool.name, 'isPaused:', isPaused.value);
	console.log('SCAN:', props.pool.name, 'isCanceled:', isCanceled.value);
	console.log('SCAN:', props.pool.name, 'isFinished:', isFinished.value);
	console.log('--------------------------');
}

async function pollScanStatus() {
	console.log('pollScanStatus fired');
	await scanNow();
	await getScanComputedProps();
	console.log('computed updated');
	if (isScanning.value) {
		if (!isPaused.value) {
			console.log('scan active');
			scanning.value = true;
		} else if (isPaused.value) {
			console.log('scan paused');
			scanning.value = false;
		}
	} else if (isCanceled.value) {
		console.log('scan canceled');
		scanning.value = false;
	} else if (isFinished.value) {
		console.log('scan finished');
		scanning.value = false;
	}

	console.log('scan set:', scanning.value);
	// displayScanBools();
}

//////////////////////////////////////////////////////////////////

const scanFunction = computed(() => {
    switch (scanObjectGroup.value[props.pool.name].function) {
        case 'RESILVER':
            return 'Resilvering';
        case 'SCRUB':
            return 'Scrubbing';
        case 'NONE':
            return 'N/A';
        default:
            return;
    }
});

const stateMessage = computed(() => {
    if (scanObjectGroup.value[props.pool.name].state === null) {
        return `No scan data found.`;
    } else {
        if (scanObjectGroup.value[props.pool.name].pause !== 'None') {
           return `${scanFunction.value} paused at  ${scanObjectGroup.value[props.pool.name].pause}`;
        } else {
            switch (scanObjectGroup.value[props.pool.name].state) {
                case 'SCANNING':
                    return `${scanFunction.value} started at ${scanObjectGroup.value[props.pool.name].start_time}`;
                case 'FINISHED':
                    return `${scanFunction.value} finished at ${scanObjectGroup.value[props.pool.name].end_time}`;
                case 'CANCELED':
                    return `${scanFunction.value} canceled at ${scanObjectGroup.value[props.pool.name].end_time}`;
                case 'NONE':
                    return 'N/A';
                default:
                    return '';
            }
        }
    }
});

const miniStateMsg = computed(() => {
    if (scanObjectGroup.value[props.pool.name].state === null) {
        return `No scan data found.`;
    } else {
        if (scanObjectGroup.value[props.pool.name].pause !== 'None') {
            return `${scanFunction.value} Paused (${ parseFloat(scanPercentage.value.toFixed(1)) }%)`;
        } else {
            switch (scanObjectGroup.value[props.pool.name].state) {
                case 'SCANNING':
                    return `${scanFunction.value}... (${ parseFloat(scanPercentage.value.toFixed(1)) }%)`;
                case 'FINISHED':
                    return `${scanFunction.value} Complete`;
                case 'CANCELED':
                    return `${scanFunction.value} Canceled (${ parseFloat(scanPercentage.value.toFixed(1)) }%)`;
                case 'NONE':
                    return 'N/A';
                default:
                    return '';
            }
        }
    }
});

const scanPercentage = computed(() => {
    return scanObjectGroup.value[props.pool.name].percentage;
});

const amountProcessed = computed(() => {
    return convertBytesToSize(scanObjectGroup.value[props.pool.name].bytes_issued);
});

const amountTotal = computed(() => {
    return convertBytesToSize(scanObjectGroup.value[props.pool.name].bytes_processed);
});

const timeRemaining = computed(() => {
    return convertSecondsToString(scanObjectGroup.value[props.pool.name].total_secs_left);
});

function stateMessageClass() {
    if (scanObjectGroup.value[props.pool.name].pause === 'None') {
        switch (scanObjectGroup.value[props.pool.name].state) {
            case 'SCANNING':
                return 'text-default';
            case 'FINISHED':
                return 'text-success'; 
            case 'CANCELED':
                return 'text-danger'; 
            case 'NONE':
                return 'text-muted';
            default:
                return 'text-default'; 
        } 
    } else {
        return 'text-orange-600'
    }
}

function progressBarClass() {
    if (scanObjectGroup.value[props.pool.name].pause === 'None') {
        switch (scanObjectGroup.value[props.pool.name].state) {
            case 'SCANNING':
                return 'bg-blue-600';
            case 'FINISHED':
                return 'bg-green-600'; 
            case 'CANCELED':
                return 'bg-danger'; 
            case 'NONE':
                return 'text-muted';
            default:
                return 'text-default'; 
        }
    } else {
        return 'bg-orange-600';
    }
}

//////////// Checking Disk Stats (Trim) /////////////
/////////////////////////////////////////////////////

const poolDiskStats = inject<Ref<PoolDiskStats>>('pool-disk-stats')!;

const selectedDisk = computed(() => {
    return poolDiskStats.value[props.pool.name].find(disk => disk.name == props.disk!.name);
});

const isTrimActive = inject<Ref<boolean>>('is-trim-active')!;
const isTrimSuspended = inject<Ref<boolean>>('is-trim-suspended')!;
const isTrimCanceled = inject<Ref<boolean>>('is-trim-canceled')!;
const isTrimFinished = inject<Ref<boolean>>('is-trim-finished')!;

const pollTrim = inject<Ref<boolean>>('poll-trim-now')!;
const trimActivity = inject<Ref<Activity>>('trim-activity')!;

const doTrimScan = () => {
    watch(pollTrim, (newVal, oldVal) => {
        if (pollTrim.value) {
            pollTrimStatus();
            trimActivity.value.isActive = isTrimActive.value;
            trimActivity.value.isPaused = isTrimSuspended.value;
            emit('trimDone', trimActivity.value);
        }
    });
}

function getTrimStateRef(state) : ComputedRef<boolean> {
	return computed(() => {
		return poolDiskStats.value[props.pool.name].some(disk => disk.stats.trim_notsup !== 1 && disk.stats.trim_state === state);
	});
}

// const isTrimActive = ref(false);
// const isTrimCanceled = ref(false);
// const isTrimSuspended = ref(false);
// const isTrimFinished = ref(false);

async function getTrimComputedProps() {
	isTrimActive.value = getTrimStateRef(1).value;
	isTrimCanceled.value = getTrimStateRef(2).value;
	isTrimSuspended.value = getTrimStateRef(3).value;
	isTrimFinished.value = getTrimStateRef(4).value;
}

const diskStatsIntervalID = inject<Ref<any>>('disk-stats-interval')!;
const checkingDiskStats = ref(false);

async function checkDiskStats() {
	await loadDiskStats(poolDiskStats);
}

function startDiskStatsInterval() {
	if (!diskStatsIntervalID.value) {
        console.log('trim interval set', diskStatsIntervalID.value);
		diskStatsIntervalID.value = setInterval(checkDiskStats, 3000);
	}
}

function stopDiskStatsInterval() {
	if (diskStatsIntervalID.value) {
        console.log('trim interval cleared', diskStatsIntervalID.value);
		clearInterval(diskStatsIntervalID.value);
		diskStatsIntervalID.value = null;
	}
}

watch(checkingDiskStats, (newVal, oldVal) => {
	if (checkingDiskStats.value) {
		startDiskStatsInterval();
	} else if (!checkingDiskStats.value) {
		stopDiskStatsInterval();
	}
}, {immediate: true});

function displayTrimBools() {
	console.log('********trim*values*******');
	console.log('TRIM:', props.pool.name, 'isTrimActive:', isTrimActive.value);
	console.log('TRIM:', props.pool.name, 'checkingDiskStats:', checkingDiskStats.value);
	console.log('TRIM:', props.pool.name, 'isTrimSuspended:', isTrimSuspended.value);
	console.log('TRIM:', props.pool.name, 'isTrimCanceled:', isTrimCanceled.value);
	console.log('TRIM:', props.pool.name, 'isTrimFinished:', isTrimFinished.value);
	console.log('**************************');
}

async function pollTrimStatus() {
	console.log('pollTrimStatus fired');
	await checkDiskStats();
	await getTrimComputedProps();
	console.log('computed updated');
	if (isTrimActive.value) {
		console.log('trim active');
		checkingDiskStats.value = true;
	} else if (isTrimCanceled.value) {
		console.log('trim canceled');
		checkingDiskStats.value = false;
	} else if (isTrimFinished.value) {
		console.log('trim finished');
		checkingDiskStats.value = false;
	} else if (isTrimSuspended.value) {
		console.log('trim paused');
		checkingDiskStats.value = false;
	}

	console.log('checkingDiskStats set:', checkingDiskStats.value);
	// displayTrimBools();
}

//////////////////////////////////////////////////////////////////

function getTrimTimestamp(disk) {
    return (convertRawTimestampToString(disk.stats.trim_action_time));
}

function getTrimPercentage(disk) {
    return (disk.stats.trim_bytes_done / disk.stats.trim_bytes_est) * 100;
}

function handleTrimPercentage(percentage : number) {
    if (percentage <= 0) {
        return 0;
    } else if (percentage >= 99.95) {
        return 100;
    } else if (percentage > 0 && percentage < 99.5){
        return percentage;
    } else {
        return 0;
    }
}

function getTrimmedAmount(disk) {
    return convertBytesToSize(disk.stats.trim_bytes_done);
}

function getTrimmedTotal(disk) {
    return convertBytesToSize(disk.stats.trim_bytes_est);
}

function trimMessage(disk) {
    if (isTrimActive.value) {
        return `${disk.name} Trim ${getTrimState(disk.stats.trim_state)}, started at ${getTrimTimestamp(disk)}.`; 
    } else if (isTrimCanceled.value) {
        return `${disk.name} Trim ${getTrimState(disk.stats.trim_state)}.`;
    } else if (isTrimSuspended.value) {
        return `${disk.name} Trim is ${getTrimState(disk.stats.trim_state)}.`;
    } else if (isTrimFinished.value) {
        return `${disk.name} Trim ${getTrimState(disk.stats.trim_state)} at ${getTrimTimestamp(disk)}.`;
    }
}

function getTrimState(state_num) {
    switch (state_num) {
        case 0:
            return 'none';
        case 1:
            return 'active';
        case 2:
            return 'canceled';
        case 3:
            return 'suspended';
        case 4:
            return 'finished';
        default:
            break;
    }
}

function trimMessageClass() {
    if (isTrimActive.value) {
        return 'text-default';
    } else if (isTrimCanceled.value) {
        return 'text-danger';
    } else if (isTrimSuspended.value) {
        return 'text-orange-600';
    } else if (isTrimFinished.value) {
        return 'text-success';
    }
}

function trimProgressBarClass() {
    if (isTrimActive.value) {
        return 'bg-blue-600';
    } else if (isTrimCanceled.value) {
        return 'bg-danger';
    } else if (isTrimSuspended.value) {
        return 'bg-orange-600';
    } else if (isTrimFinished.value) {
        return 'bg-green-600';
    }
}

</script>