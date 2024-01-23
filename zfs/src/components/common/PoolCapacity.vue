<template>
    <div class="flex flex-row justify-between items-center flex-wrap max-w-sm px-10 bg-default rounded-2xl h-20">
        <div class="flex items-center justify-center overflow-visible bg-default rounded-full">
            <svg class="w-32 h-32 transform translate-x-1 translate-y-1" aria-hidden="true">
                <circle :id="getIdKey('circle-empty')" class="text-gray-300 dark:text-gray-500" :stroke-width="props.strokeWidth" stroke="currentColor" fill="transparent" :r="props.radius" :cx="props.coordX" :cy="props.coordY" />
                <circle :id="getIdKey('circle-filled')" :class="props.fillColor" :stroke-width="props.strokeWidth" :stroke-dasharray="circumference" :stroke-dashoffset="offset" stroke-linecap="round" stroke="currentColor" fill="transparent" :r="props.radius" :cx="props.coordX" :cy="props.coordY" />
            </svg>
            <span :class="['absolute', props.percentFontSize, props.fillColor]">{{props.percentage}}%</span>
        </div>
        <div class="flex flex-col">
            <p class="font-medium text-default sm:text-xl overflow-hidden whitespace-nowrap text-ellipsis" :title="props.name">{{ truncateName(props.name!, 12 )}}</p>
            <span class="ml-auto text-xl font-medium hidden sm:block" :class="props.fillColor">{{ props.totalSize }}</span>
        </div>
     
    </div>
</template>

<script setup lang="ts">
import { computed} from 'vue';
import { truncateName } from '../../composables/helpers';

interface PoolCapacity {
    id: string;
    fillColor: string;
	radius: number;
    coordX: number;
    coordY: number;
    strokeWidth: number;
    percentage: number;
    name?: string;
    totalSize?: string;
    percentFontSize: string;
}

const props = defineProps<PoolCapacity>();

const circumference = computed(() => {
    const radius = props.radius;
    return 2 * Math.PI * radius;
});

const offset = computed(() => {
    const percentage = props.percentage;
    return circumference.value - (circumference.value * percentage) / 100;
});

// const filledAmount = computed(() => {
// 	//return (props.capacity / 100) * (2 * Math.PI * props.radius);
//     const capacity = props.percentage;
//     const circumference = 2 * Math.PI * props.radius;
//     const filledCircumference = (capacity / 100) * circumference;
//     return circumference - filledCircumference;
// });

const getIdKey = (name: string) => `${name}`;
</script>