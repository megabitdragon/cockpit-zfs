<template>
    <div class="flex flex-row justify-between items-center min-w-max w-full px-2 bg-default rounded-2xl h-20 mt-2">
        <div class="flex basis-2/3 flex-col min-w-0 ml-8">
            <p class="mr-auto font-medium text-default text-xl max-w-sm" :class="truncateText" :title="props.name!">{{ props.name!}}</p>
            <span class="mr-auto text-xl font-medium hidden sm:block" :class="props.fillColor">{{ props.totalSize }}</span>
        </div>
        <div class="flex basis-1/3 items-center justify-center overflow-visible bg-default rounded-full">
            <svg class="w-32 h-32 transform translate-x-1 translate-y-1" aria-hidden="true">
                <circle :id="getIdKey('circle-empty')" class="text-gray-300 dark:text-gray-500" :stroke-width="props.strokeWidth" stroke="currentColor" fill="transparent" :r="props.radius" :cx="props.coordX" :cy="props.coordY" />
                <circle :id="getIdKey('circle-filled')" :class="props.fillColor" :stroke-width="props.strokeWidth" :stroke-dasharray="circumference" :stroke-dashoffset="offset" stroke-linecap="round" stroke="currentColor" fill="transparent" :r="props.radius" :cx="props.coordX" :cy="props.coordY" />
            </svg>
            <span :class="['absolute', props.percentFontSize, props.fillColor]">{{props.percentage}}%</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, Ref, computed } from 'vue';

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

const truncateText = inject<Ref<string>>('style-truncate-text')!;

const circumference = computed(() => {
    const radius = props.radius;
    return 2 * Math.PI * radius;
});

const offset = computed(() => {
    const percentage = props.percentage;
    return circumference.value - (circumference.value * percentage) / 100;
});

const getIdKey = (name: string) => `${name}`;
</script>