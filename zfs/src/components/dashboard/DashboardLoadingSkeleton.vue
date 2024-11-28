<template>
    <div role="status" class="max-w-full min-w-full animate-pulse grid grid-cols-3 auto-rows-max gap-2">
        <Card :bgColor="'bg-default'" :titleSection="true" :contentSection="true" :footerSection="true" :class="['mt-2', 'mb-4', 'min-w-96', 'min-h-96', 'w-full', 'h-full', 'rounded-md', 'border', 'border-default', props.color]"/>
        <Card :bgColor="'bg-default'" :titleSection="true" :contentSection="true" :footerSection="true" :class="['mt-2', 'mb-4', 'min-w-96', 'min-h-96', 'w-full', 'h-full', 'rounded-md', 'border', 'border-default', props.color]"/>
        <Card :bgColor="'bg-default'" :titleSection="true" :contentSection="true" :footerSection="true" :class="['mt-2', 'mb-4', 'min-w-96', 'min-h-96', 'w-full', 'h-full', 'rounded-md', 'border', 'border-default', props.color]"/>
        <span class="sr-only">Loading...</span>
    </div>
</template>

<script setup lang="ts">
import Card from '../common/Card.vue';
interface DashboardLoadingSkeletonProps {
    color: string;
}

const props = defineProps<DashboardLoadingSkeletonProps>();

</script>