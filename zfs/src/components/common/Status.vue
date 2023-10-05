<template>
    <div>
        <div v-if="ongoingScan">
            <div v-if="!isPoolList">
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
        <!-- <div v-if="ongoingTrim && trimObjectGroup[props.pool.name].state !== null ">
            <div v-if="!isPoolList">
                <div class="grid grid-cols-4 gap-1 justify-items-center">
                    <span class="col-span-4" :class="stateMessageClass()">
                        Trim {{ trimObjectGroup[props.pool.name].state }} at {{ trimObjectGroup[props.pool.name].stateTimestamp }}
                    </span>

                    <div class="col-span-4 grid grid-cols-4 justify-items-center">
                        <div class="col-span-4 min-w-max w-full bg-well rounded-full relative flex h-6 min-h-min max-h-max overflow-hidden">
                            <div :class="progressBarClass()" class="h-6 min-h-min max-h-max" :style="{ width: `${trimObjectGroup[props.pool.name].percent}%` }">
                                <div class="absolute inset-0 flex items-center justify-center text-s font-medium text-default text-center p-0.5 leading-none">
                                    {{ trimObjectGroup[props.pool.name].percent }}%
                                </div>
                            </div>
                        </div>

                        <span v-if="ongoingTrim && trimPaused" class="col-span-4">
                            Resume to continue or cancel to stop.                    
                        </span>
                    </div>

                </div>
            </div>

            <div v-if="isPoolList">
                <div class="grid-grid-cols-2 gap-1 justify items-center">
                    <div v-if="trimObjectGroup[props.pool.name].state !== null" class="col-span-2">
                        <span :class="stateMessageClass()">
                            Trim {{ trimObjectGroup[props.pool.name].state }} ({{ trimObjectGroup[props.pool.name].percent }}%)
                        </span>
                        <div :class="progressBarClass()" class="h-6 min-h-min max-h-max" :style="{ width: `${trimObjectGroup[props.pool.name].percent}%` }">
                            <div class="absolute inset-0 flex items-center justify-center text-s font-medium text-default text-center p-0.5 leading-none">
                                {{ trimObjectGroup[props.pool.name].percent }}%
                            </div>
                        </div>
                    </div>
                    <div v-if="trimObjectGroup[props.pool.name].state === null" class="col-span-2">
                        <span class="mt-2" :class="stateMessageClass()">
                            Trim not supported.
                        </span>
                    </div>
                </div>
            </div>
        </div> -->
        
        
    </div>
</template>
<script setup lang="ts">
import { ref, inject, Ref, computed, provide, watch, watchEffect } from "vue";
import { convertBytesToSize, convertSecondsToString } from "../../composables/helpers";

interface StatusProps {
    pool: PoolData;
    scanObjectGroup: PoolScanObjectGroup;
    // trimObjectGroup: TrimStatusObjectGroup;
    isPoolList: boolean;
    isPoolDetail: boolean;
    isScanning: boolean;
    // isTrimming: boolean;
}

const props = defineProps<StatusProps>();
const notifications = inject<Ref<any>>('notifications')!;

const scanObjectGroup = inject<Ref<PoolScanObjectGroup>>('scan-object-group')!;
// const trimObjectGroup = inject<Ref<TrimStatusObjectGroup>>('trim-object-group')!;
    
const isScanning = inject<Ref<boolean>>('is-scanning')!;
const isFinished = inject<Ref<boolean>>('is-finished')!;
const isCanceled = inject<Ref<boolean>>('is-canceled')!;
const isPaused = inject<Ref<boolean>>('is-paused')!;

// const trimPaused = inject<Ref<boolean>>('trim-paused')!;

// const ongoingTrim = ref(props.isTrimming);
const ongoingScan = ref(props.isScanning);

const emit = defineEmits(['scan_now']);
// const emit = defineEmits(['scan_now', 'scan_trim_now']);
const scanNow = () => {
    emit('scan_now');
}
// const trimScanNow = () => {
//     emit('scan_trim_now');
// }

scanNow();
// trimScanNow();

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
    if (ongoingScan.value) {
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
    // else if (ongoingTrim.value) {
    //     switch (trimObjectGroup.value[props.pool.name].state) {
    //         case 'started':
    //             return 'text-default';
    //         case 'completed':
    //             return 'text-success';
    //         case 'suspended':
    //             return 'text-orange-600';
    //         default:
    //             return 'text-default';
    //     }
    // }
}

function progressBarClass() {
    if (ongoingScan.value) {
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
    // else if (ongoingTrim.value) {
    //     switch (trimObjectGroup.value[props.pool.name].state) {
    //         case 'started':
    //             return 'bg-blue-600';
    //         case 'completed':
    //             return 'bg-green-600';
    //         case 'suspended':
    //             return 'bg-orange-600';
    //         default:
    //             return 'text-default';
    //     }
    // }
}

</script>