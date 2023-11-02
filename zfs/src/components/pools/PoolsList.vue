<template>
	<div class="inline-block min-w-full py-4 align-middle sm:px-6 lg:px-8 overflow-visible sm:rounded-lg bg-accent rounded-md border border-default">
		<!-- buttons for creating/importing pools and refreshing list -->
		<div class="flex">
			<div class="button-group-row">
				<button id="createPool" class="btn btn-primary" @click="newPoolWizardBtn">Create Storage Pool</button>
				<button id="importPool" class="btn btn-secondary" @click="importNewPoolBtn">Import Storage Pool</button>
				<button id="refreshPools" class="btn btn-secondary" @click="refreshAllData"><ArrowPathIcon class="w-5 h-5"/></button>
			</div>			
		</div>

		<div class="mt-8 overflow-visible rounded-md">
			<div class="inline-block min-w-full min-h-full shadow align-middle rounded-md border border-default">

				<div class="overflow-visible ring-1 ring-black ring-opacity-5 sm:rounded-lg">

					<table class="min-w-full divide-y divide-default rounded-md">
						<thead class="rounded-md">
							<tr class="bg-well rounded-t-md grid grid-cols-10">
								<th class="relative py-3.5 rounded-tl-md col-span-1">
									<span class="sr-only"></span>
								</th>
								<th class="py-3.5 font-semibold text-default col-span-1">Name</th>
								<th class="py-3.5 font-semibold text-default col-span-1">Status</th>
								<th class="py-3.5 font-semibold text-default col-span-1">Used (%)</th>
								<th class="py-3.5 font-semibold text-default col-span-1">Used</th>
								<th class="py-3.5 font-semibold text-default col-span-1">Free</th>
								<th class="py-3.5 font-semibold text-default col-span-1">Total</th>
								<th class="py-3.5 font-semibold text-default col-span-2">Message</th>
								<th class="relative py-3.5 sm:pr-6 lg:pr-8 rounded-tr-md col-span-1">
									<span class="sr-only"></span>
								</th>
							</tr>
						</thead>
					</table>
					
					<div v-if="poolData.length > 0 && poolsLoaded == true">
						<div v-for="pool, poolIdx in poolData" :key="poolIdx" >
							<PoolListElement :poolIdx="poolIdx" :pool="pool"/>
						</div>
					</div>
					
					<div v-if="poolsLoaded == false" class="p-2 flex justify-center bg-default rounded-md">
						<LoadingSpinner class="font-semibold text-lg my-0.5" baseColor="text-gray-200" fillColor="fill-slate-500"/>
					</div>
					<div v-if="poolData.length < 1 && poolsLoaded == true" class="p-2 flex bg-default justify-center rounded-md">
						<span class="font-semibold text-lg my-2">No Pools Found</span>
					</div>
	
				</div>
			</div>
		</div>
	</div>

	<div v-if="showWizard">
		<CreatePool @close="showWizard = false"/>
	</div>

	<div v-if="showImportModal">
		<ImportPool :idKey="'import-pool'"/>
	</div>
</template>

<script setup lang="ts">
import { ref, inject, Ref, provide } from "vue";
import { ArrowPathIcon } from '@heroicons/vue/24/outline';
import { loadDatasets, loadDisksThenPools } from '../../composables/loadData';
import CreatePool from '../wizard-components/CreatePool.vue';
import PoolListElement from './PoolListElement.vue';
import ImportPool from "./ImportPool.vue";
import LoadingSpinner from '../common/LoadingSpinner.vue';

///////// Values for Confirmation Modals ////////////
/////////////////////////////////////////////////////
const operationRunning = ref(false);
const firstOptionToggle = ref(false);
const secondOptionToggle = ref(false);
const thirdOptionToggle = ref(false);
const fourthOptionToggle = ref(false);

/////////////// Loading/Refreshing //////////////////
/////////////////////////////////////////////////////
const poolData = inject<Ref<PoolData[]>>("pools")!;
const diskData = inject<Ref<DiskData[]>>("disks")!;
const filesystemData = inject<Ref<FileSystemData[]>>('datasets')!;
const disksLoaded = inject<Ref<boolean>>('disks-loaded')!;
const poolsLoaded = inject<Ref<boolean>>('pools-loaded')!;
const fileSystemsLoaded = inject<Ref<boolean>>('datasets-loaded')!;

async function refreshAllData() {
	disksLoaded.value = false;
	poolsLoaded.value = false;
	fileSystemsLoaded.value = false;
	diskData.value = [];
	poolData.value = [];
	filesystemData.value = [];
	await loadDisksThenPools(diskData, poolData);
	await loadDatasets(filesystemData);
	disksLoaded.value = true;
	poolsLoaded.value = true;
	fileSystemsLoaded.value = true;
}

/////////////// Create/Import Pool //////////////////
/////////////////////////////////////////////////////
const showWizard = ref(false);
const showImportModal = ref(false);

function newPoolWizardBtn() {
	if (!showWizard.value) {
		showWizard.value = true;	
	} else {
		showWizard.value = false;
	}
}

function importNewPoolBtn() {
	showImportModal.value = true;
}


provide('show-wizard', showWizard);

provide("show-import-modal", showImportModal);

provide('modal-confirm-running', operationRunning);
provide('modal-option-one-toggle', firstOptionToggle);
provide('modal-option-two-toggle', secondOptionToggle);
provide('modal-option-three-toggle', thirdOptionToggle);
provide('modal-option-four-toggle', fourthOptionToggle);
</script>