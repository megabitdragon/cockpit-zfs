<template>
	<div>

	</div>
</template>

<script setup lang="ts">
import { reactive, ref, Ref, inject, computed, provide, watch } from 'vue';
import { loadDisksThenPools, loadDatasets, loadSnapshots } from '../../composables/loadData';

interface SnapshotsTabProps {
  	tag: string;
}

const props = defineProps<SnapshotsTabProps>();

const pools = ref<PoolData[]>([]);

const snapshots = ref<Snapshot[]>([]);

const snapshotsLoaded = ref(false);

</script>

