<template>
    <div class="flex items-center flex-wrap max-w-sm px-10 bg-default rounded-2xl h-20">
        <div class="flex items-center justify-center -m-6 overflow-visible bg-default rounded-full">
            <svg class="w-32 h-32 transform translate-x-1 translate-y-1" aria-hidden="true">
                <circle :id="getIdKey('circle-empty')" class="text-muted" :stroke-width="props.strokeWidth" stroke="currentColor" fill="transparent" :r="props.radius" :cx="props.coordX" :cy="props.coordY" />
                <circle :id="getIdKey('circle-filled')" :class="props.fillColor" :stroke-width="props.strokeWidth" :stroke-dasharray="props.strokeDashArr" :stroke-dashoffset="-filledAmount" stroke-linecap="round" stroke="currentColor" fill="transparent" r="50" cx="60" cy="60" />
            </svg>
            <span :class="['absolute', 'text-2xl', props.fillColor]">{{props.capacity}}%</span>
        </div>
        <p class="ml-10 font-medium text-default sm:text-xl">{{ props.name }}</p>
        <span :class="['ml-auto', 'text-xl', 'font-medium', props.fillColor, 'hidden', 'sm:block']">{{ props.totalSize }}</span>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, provide } from 'vue';


interface CircleProgress {
    id: string;
    fillColor: string;
	radius: number;
    coordX: number;
    coordY: number;
    strokeWidth: number;
    strokeDashArr: number;
    capacity: number;
    name: string;
    totalSize: string;
}

const props = defineProps<CircleProgress>();

const filledAmount = computed(() => {
	return (props.capacity / 100) * (2 * Math.PI * props.radius);
});

const getIdKey = (name: string) => `${name}`;
</script>