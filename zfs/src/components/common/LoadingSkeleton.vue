<template>
    <div role="status" class="max-w-full min-w-full border border-default divide-x divide-default rounded shadow animate-pulse">
        <div class="grid grid-cols-4 auto-rows-max gap-2">
            <Card :class="['mt-2', 'mb-4', 'min-w-fit', 'rounded-md', 'border', 'border-default', props.color]"/>
            <Card :class="['mt-2', 'mb-4', 'min-w-fit', 'rounded-md', 'border', 'border-default', props.color]"/>
            <Card :class="['mt-2', 'mb-4', 'min-w-fit', 'rounded-md', 'border', 'border-default', props.color]"/>
            <Card :class="['mt-2', 'mb-4', 'min-w-fit', 'rounded-md', 'border', 'border-default', props.color]"/>
        </div>
        <span class="sr-only">Loading...</span>
    </div>

</template>

<script setup lang="ts">
import { ref, inject, Ref, computed, provide } from "vue";
import Card from '../common/Card.vue';
interface LoadingSkeletonProps {
    color: string;
}

const props = defineProps<LoadingSkeletonProps>();

</script>