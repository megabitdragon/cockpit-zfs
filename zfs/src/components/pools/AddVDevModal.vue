<template>
    <Modal @close="showAddVDevModal = false" :isOpen="showAddVDevModal" :marginTop="'mt-48'" :width="'w-8/12'" :minWidth="'min-w-8/12'">
        <template v-slot:title>
            Add Virtual Device
        </template>
        <template v-slot:content>
            <div>
                <!-- Virtual Device (Select) -->
				<div>
					<label :for="getIdKey('virtual-device')" class="block text-sm font-medium leading-6 text-default">Type</label>
					<!-- if first VDev, always either DISK, MIRROR, RAIDZ1-3 -->
					<!-- if NOT first VDev, always either CACHE, LOG, SPECIAL, SPARE, DEDUP, or TYPE OF FIRST VDEV -->
					<select id="virtual-device" v-model="newVDev.type" name="virtual-device" class="text-default bg-default mt-1 block w-full input-textlike sm:text-sm sm:leading-6">
						<option value="disk">Disk</option>
						<option value="mirror">Mirror</option>
						<option value="raidz1">RaidZ1</option>
						<option value="raidz2">RaidZ2</option>
						<option value="raidz3">RaidZ3</option>
						<option value="cache">Cache</option>
						<option value="log">Log</option> 
						<option value="special">Special</option>
						<option value="spare">Spare</option>
						<option value="dedup">Dedup</option>
					</select>
				</div>

				<!-- If (Log, Special, Dedup) -->
				<!-- If secondary VDev is LOG or SPECIAL or DEDUP, have option for them to be MIRROR also -->
				<!-- If Primary VDev is MIRROR or RAIDZ(x) then SPECIAL, LOG and DEDUP must be MIRROR -->
				<div v-if="newVDev.type == 'log' || newVDev.type == 'special' || newVDev.type == 'dedup'">
					<label :for="getIdKey('mirror-enabled')" class="mt-1 block text-sm font-medium leading-6 text-default">{{ upperCaseWord(newVDev.type) }} (Mirror)</label>

					<Switch v-model="newVDev.isMirror" :class="[newVDev.isMirror ? 'bg-primary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
						<span class="sr-only">Use setting</span>
						<span :class="[newVDev.isMirror ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
							<span :class="[newVDev.isMirror ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
								<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
									<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							</span>
							<span :class="[newVDev.isMirror ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
								<svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
									<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
								</svg>
							</span>
						</span>
					</Switch>
				</div>

				<!-- Disk selection, shows disks that are not in use and as they are selected it hides them from any additional VDevs so they cannot be selected twice -->
				<label :for="getIdKey('available-disk-list')" class="my-1 block text-sm font-medium leading-6 text-default">Select Disks</label>
				<ul :id="getIdKey('available-disk-list')" role="list" class="grid gap-4 grid-cols-4">
					<li v-for="(disk, diskIdx) in availableDisks" :key="diskIdx" class="">
						<button class="flex min-w-fit w-full h-full border border-default rounded-lg"
						:class="diskCardClass(disk.name)">
							<label :for="getIdKey(`vdev-disk-${diskIdx}`)" class="flex flex-col w-full py-4 mx-2 text-sm gap-0.5">
								<input :id="getIdKey(`vdev-disk-${diskIdx}`)" v-model="newVDev.selectedDisks" type="checkbox" :value="`${disk.name}`" :name="`disk-${disk.name}`"
								class="w-4 h-4 text-success bg-well border-default rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2"/>
								<h3 class="truncate text-sm font-medium text-default">{{ disk.name }}</h3>
								<p class="mt-1 truncate text-sm font-base text-default">{{ disk.sd_path }}</p>
								<p class="mt-1 truncate text-sm text-default">{{ disk.type }}</p>
								<p class="mt-1 truncate text-sm text-default">Capacity: {{ disk.capacity }}</p>
							</label>
						</button>
					</li>
				</ul>
            </div>
        </template>
        <template v-slot:footer>
            <!-- <div class="button-group-row mt-2">
                <div class="justify-self-start flex flex-row">
                    <div class="button-group-row">
                        <button id="add-vdev-btn" class="btn btn-primary object-left justify-start mr-4 h-fit w-full" @click="">Add VDev</button>
                    </div>

                    <div class="flex flex-row">
                        <label :for="'forcefully-create-pool'" class="mt-2 mr-2 block text-sm font-medium leading-6 text-default">Forcefully Create</label>
                        <Switch v-model="poolConfig.settings!.forceCreate" :class="[poolConfig.settings!.forceCreate ? 'bg-primary' : 'bg-accent', 'mt-2 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
                            <span class="sr-only">Use setting</span>
                            <span :class="[poolConfig.settings!.forceCreate ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
                                <span :class="[poolConfig.settings!.forceCreate ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                    <svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
                                        <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </span>
                                <span :class="[poolConfig.settings!.forceCreate ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                    <svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
                                        <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                    </svg>
                                </span>
                            </span>
                        </Switch>
                    </div>
                </div>

                <div class="justify-self-center mt-2">
                    <p class="text-danger" v-if="diskFeedback">{{ diskFeedback }}</p>
                    <p class="text-danger" v-if="diskSizeFeedback">{{ diskSizeFeedback }}</p>
                    <p class="text-danger" v-if="isProperReplicationFeedback">{{ isProperReplicationFeedback }}</p>
                    <p class="text-danger" v-if="vDevFeedback">{{ vDevFeedback }}</p>
                </div>
			</div> -->
        </template>
    </Modal>
</template>

<script setup lang="ts">
import { reactive, ref, inject, Ref, computed, provide } from 'vue';
import { Menu, MenuButton, MenuItem, MenuItems, Switch } from '@headlessui/vue';
import Modal from '../common/Modal.vue';
import { upperCaseWord, convertSizeToBytes } from '../../composables/helpers';

interface AddVDevModalProps {
	idKey: string;
    pool: PoolData;
}

const props = defineProps<AddVDevModalProps>();

const showAddVDevModal = inject<Ref<boolean>>('add-vdev-modal')!;

const newVDev : vDevData = {
    name: '',
	type: 'mirror',
	status: '',
	guid: '',
	stats: {},
	disks: [],
	selectedDisks: [],
	forceAdd: false,
	poolName: '',
	isMirror: false,
}

const diskFeedback = inject<Ref<string>>('feedback-disk')!;
const diskSizeFeedback = inject<Ref<string>>('feedback-disk-size')!;
const isProperReplicationFeedback = inject<Ref<string>>('feedback-replication-level')!;

const allDisks = inject<Ref<DiskData[]>>('disks')!;

// const vDevAvailDisks = computed<DiskData[][]>(() => {
// 	return poolConfig.value.vdevs.map((vdev, vdevIdx) => {
// 		const claimed = poolConfig.value.vdevs
// 		.filter((_, idx) => idx !== vdevIdx)
// 		.flatMap(vdev => vdev.selectedDisks);
// 		return disks.value.filter(disk => disk.usable && !claimed.includes(disk.name));
// 	});
// });
const availableDisks = allDisks.value.filter(disk => disk.usable);

//change color of disk when selected
const diskCardClass = (diskName) => {
  const isSelected = newVDev.selectedDisks.includes(diskName);
  return isSelected ? 'bg-green-300 dark:bg-green-700' : '';
};

const replicationLevelCheck = () => {
	let result = true;
	isProperReplicationFeedback.value = '';

	
    if ((newVDev.type == 'dedup' || newVDev.type == 'special') && !newVDev!.forceAdd && !newVDev.isMirror) {
        result = false;
        isProperReplicationFeedback.value = 'Mismatched replication level. Forcefully create to override.';
    } else if (newVDev.isMirror && (newVDev.type == 'special' || newVDev.type == 'dedup' || newVDev.type == 'log') && newVDev.selectedDisks.length < 2) {
        result = false;
        isProperReplicationFeedback.value = `Two or more Disks are required for Mirror (${upperCaseWord(newVDev.type)}).`;
    }

	return result;
}

const diskSizeMatch = () => {
	let result = true;
	diskSizeFeedback.value = '';

	if (newVDev!.forceAdd) {
		return true;
	}

		let previousCapacity = 0;

    newVDev.selectedDisks.forEach(selDisk => {
        const disk = allDisks.value.find(fullDisk => fullDisk.name == selDisk);
        
        if (disk) {
            const currentCapacity = convertSizeToBytes(disk.capacity);

            if (previousCapacity != 0 && currentCapacity != previousCapacity) {
                result = false;
                diskSizeFeedback.value = `Mirror contains devices of different sizes. Forcefully create to override.\n`;
            }

            previousCapacity = currentCapacity;
        }
                
    });

	return result;
}

//method for validating disk selection per vdev type
const diskCheck = () => {
	let result = true;
	diskFeedback.value = '';
	
    if (newVDev.type == 'mirror' && newVDev.selectedDisks.length < 2) {
        result = false;
        diskFeedback.value = 'Two or more Disks are required for Mirror.';
    } else if (newVDev.type == 'raidz1' && newVDev.selectedDisks.length < 2) {
        result = false;
        diskFeedback.value = 'Two or more Disks are required for RaidZ1.';
    } else if (newVDev.type == 'raidz2' && newVDev.selectedDisks.length < 3) {
        result = false;
        diskFeedback.value = 'Three or more Disks are required for RaidZ2.';
    } else if (newVDev.type == 'raidz3' && newVDev.selectedDisks.length < 4) {
        result = false;
        diskFeedback.value = 'Four or more Disks are required for RaidZ3.';
    } else if (newVDev.type == 'disk' && newVDev.selectedDisks.length < 1) {
        result = false;
        diskFeedback.value = 'At least one Disk is required.';
    } else if (newVDev.type == 'log' && newVDev.selectedDisks.length < 1) {
        result = false;
        diskFeedback.value = 'At least one Disk is required for Log.';
    } else if (newVDev.type == 'cache' && newVDev.selectedDisks.length < 1) {
        result = false;
        diskFeedback.value = 'At least one Disk is required for Cache.';		
    } else if (newVDev.type == 'special' && newVDev.selectedDisks.length < 1) {
        result = false;
        diskFeedback.value = 'At least one Disk is required for Special.';
    } else if (newVDev.type == 'spare' && newVDev.selectedDisks.length < 1) {
        result = false;
        diskFeedback.value = 'At least one Disk is required for Spare.';
    } else if (newVDev.type == 'dedup' && newVDev.selectedDisks.length < 1) {
        result = false;
        diskFeedback.value = 'At least one Disk is required for Dedup.';
    } 

	return result;
}

const getIdKey = (name: string) => `${props.idKey}-${name}`;
</script>