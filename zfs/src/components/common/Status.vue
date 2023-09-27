<template>
    <div>
        <div v-if="operationRunning && !operationCompleted" class="grid grid-cols-4 gap-0.5 justify-items-center">
            <span class="text-muted col-span-4 mt-2">{{ operating }} began at {{ scanObject.start_time }}</span>
            <CircleProgress :justCircle="true" :id="'operation-progress-visual'" :fillColor="'text-success'" :percentage="parseFloat(scanObject.percentage.toFixed(2))" :radius="50" :coordX="60" :coordY="60" :strokeWidth="10" :strokeDashArr="314"/>
        </div>
        <div v-if="!operationRunning && operationCompleted" class="grid grid-cols-4 gap-0.5 justify-items-center">
            <span class="text-muted col-span-4 mt-2">
                {{ scanObject.function }} {{ scanObject.state }} at {{ scanObject.end_time }}
            </span>
        </div>
        <div v-if="!operationRunning && !operationCompleted" class="grid grid-cols-4 gap-0.5 justify-items-center">
              <span class="text-muted col-span-4 mt-2">
                N/A
            </span>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, inject, Ref, computed, provide, watch, watchEffect } from "vue";
import { loadScanObject } from '../../composables/loadData';
import CircleProgress from "./CircleProgress.vue";

interface StatusProps {
    poolName: string;
}

const props = defineProps<StatusProps>();
const operationRunning = ref(false);
const operationCompleted = ref(false);
const scanObject = inject<Ref<PoolScanObject>>('scan-object')!;

// const scanObject = ref<PoolScanObject>();

setInterval(async () => {
    await loadScanObject(scanObject.value, props.poolName);
    console.log(scanObject.value);
}, 10000);

const operating = ref('');

//scan function : NONE | SCRUB | RESILVER
//scan state: NONE | SCANNING | FINISHED | CANCELED

switch (scanObject.value.function) {
    case 'RESILVER':
        operating.value = 'Resilvering';
        break;
    case 'SCRUB':
        operating.value = 'Scrubbing';
        break;
    case 'NONE':
        operating.value = "None";
        break;
    default:
        break;
}

if (scanObject.value.state == 'SCANNING') {
    
} else if (scanObject.value.state == 'FINISHED') {

} else if (scanObject.value.state == 'CANCELED') {

} else if (scanObject.value.state == 'NONE') {

}

if (scanObject.value.pause != 'None') {

}

</script>