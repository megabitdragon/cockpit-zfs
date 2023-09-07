<template>
    <Modal @close="showAddVDevModal = false" :isOpen="showAddVDevModal" :marginTop="props.marginTop" :width="'w-8/12'" :minWidth="'min-w-8/12'">
        
        <template v-slot:title>
            Add Virtual Device
        </template>
        <template v-slot:content>
            <div v-for="(vDev, vDevIdx) in props.pool.vdevs" :key="vDevIdx">
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

                <!-- Disk ID (Select) -->
				<div>
					<label :for="getIdKey('disk-identifier')" class="block text-sm font-medium leading-6 text-default">Disk Identifier</label>
					<select :id="getIdKey('disk-identifier')" v-model="diskIdentifier" name="disk-identifier" class="text-default bg-default mt-1 block w-full input-textlike sm:text-sm sm:leading-6">
						<option value="sd_path">Block Device</option>
						<!-- <option value="">Disk/WWN</option> -->
						<option value="phy_path">Hardware Path</option>
						<option value="vdev_path">Device Alias</option>
					</select>
				</div>

				<!-- Disk selection, shows disks that are not in use and as they are selected it hides them from any additional VDevs so they cannot be selected twice -->
				<label :for="getIdKey('available-disk-list')" class="my-1 block text-sm font-medium leading-6 text-default">Select Disks</label>
                <ul :id="getIdKey('available-disk-list')" role="list" class="flex flex-row flex-wrap gap-2">
                    <li v-for="(disk, diskIdx) in availableDisks" :key="diskIdx" class="my-2">
                        <button class="flex min-w-fit w-full h-full border border-default rounded-lg"
                        :class="diskCardClass(disk.name)">
                            <label :for="getIdKey(`disk-${diskIdx}`)" class="flex flex-col w-full py-4 mx-2 text-sm gap-0.5 justify-start">
                                <input :id="getIdKey(`disk-${diskIdx}`)" v-model="selectedDisks" type="checkbox" :value="`${disk.name}`" :name="`disk-${disk.name}`"
                                class="w-4 h-4 text-success bg-well border-default rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2"/>
                                <h3 class="truncate text-sm font-medium text-default">{{ disk.name }}</h3>
                                <p class="mt-1 truncate text-sm text-default">{{ disk.type }}</p>
                                <p class="mt-1 truncate text-sm text-default">{{ disk[diskIdentifier] }}</p>
                                <p class="mt-1 truncate text-sm text-default">Capacity: {{ disk.capacity }}</p>
                            </label>
                        </button>
                    </li>
                </ul>

            </div>
        </template>
        <template v-slot:footer>
            <div class="w-full grid grid-rows-2">
				<div class="w-full row-start-1 justify-center items-center">
                    <div class="justify-self-start mt-2">
                        <p class="text-danger" v-if="diskFeedback">{{ diskFeedback }}</p>
                        <p class="text-danger" v-if="diskSizeFeedback">{{ diskSizeFeedback }}</p>
                        <p class="text-danger" v-if="isProperReplicationFeedback">{{ isProperReplicationFeedback }}</p>
                    </div>
				</div>
				
				<div class="button-group-row w-full justify-between row-start-2">
					<div class="button-group-row mt-2">
                        <button @click="showAddVDevModal = false" :id="getIdKey('close-add-vdev-btn')" name="close-add-vdev-btn" class="mt-1 btn btn-danger">Close</button>
                        <div class="flex flex-row">
                            <label :for="'forcefully-add-vdev'" class="mt-2 mr-2 block text-sm font-medium leading-6 text-default">Forcefully Add</label>
                            <Switch v-model="newVDev.forceAdd" :class="[newVDev.forceAdd ? 'bg-primary' : 'bg-accent', 'mt-2 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
                                <span class="sr-only">Use setting</span>
                                <span :class="[newVDev.forceAdd ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
                                    <span :class="[newVDev.forceAdd ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                        <svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
                                            <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </span>
                                    <span :class="[newVDev.forceAdd ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                        <svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
                                            <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                        </svg>
                                    </span>
                                </span>
                            </Switch>
                        </div>
					</div>
					<div class="button-group-row mt-2">
                        <button id="add-vdev-btn" class="btn btn-primary object-right justify-end mr-4 h-fit w-full" @click="addVDevBtn">Add VDev</button>
					</div>
				</div>
			</div>
        </template>
    </Modal>
</template>

<script setup lang="ts">
import { reactive, ref, inject, Ref, computed, provide } from 'vue';
import { Menu, MenuButton, MenuItem, MenuItems, Switch } from '@headlessui/vue';
import Modal from '../common/Modal.vue';
import { upperCaseWord, convertSizeToBytes } from '../../composables/helpers';
import { addVDev } from '../../composables/pools';
import { loadDisksThenPools, loadDatasets } from '../../composables/loadData';

interface AddVDevModalProps {
	idKey: string;
    pool: PoolData;
    marginTop: string;
}

const props = defineProps<AddVDevModalProps>();

const showAddVDevModal = inject<Ref<boolean>>('show-vdev-modal')!;

const newVDev : newVDevData = {
	type: 'mirror',
	disks: [],
    isMirror: false,
    forceAdd: false,
}

const selectedDisks = ref<string[]>([])!;

const diskFeedback = ref('')
const diskSizeFeedback = ref('')
const isProperReplicationFeedback = ref('')

const pools = inject<Ref<PoolData[]>>('pools')!;

const allDisks = inject<Ref<DiskData[]>>('disks')!;
const datasets = inject<Ref<FileSystemData[]>>('datasets')!;

const diskIdentifier = ref<DiskIdentifier>('vdev_path');

const disksLoaded = inject<Ref<boolean>>('disks-loaded')!;
const poolsLoaded = inject<Ref<boolean>>('pools-loaded')!;
const fileSystemsLoaded = inject<Ref<boolean>>('datasets-loaded')!;

const availableDisks = computed<DiskData[]>(() => {
    return allDisks.value.filter(disk => disk.usable);
})

//change color of disk when selected
const diskCardClass = (diskName) => {
    const isSelected = selectedDisks.value.includes(diskName);
    return isSelected ? 'bg-green-300 dark:bg-green-700' : '';
};

const phyPathPrefix = '/dev/disk/by-path/';
const sdPathPrefix = '/dev/';
const newDisk = ref();
const diskName = ref('');
const diskPath = ref('');

async function addVDevBtn() {
    if (replicationLevelCheck()) {
        if (diskSizeMatch()) {
            if (diskCheck()) {
                selectedDisks.value.forEach(selectedDisk => {
                    newDisk.value = allDisks.value.find(disk => disk.name === selectedDisk);
                    switch (diskIdentifier.value) {
                        case 'vdev_path':
                            diskPath.value = newDisk.value!.vdev_path;
                            diskName.value = selectedDisk;
                            break;
                        case 'phy_path':
                            diskPath.value = newDisk.value!.phy_path;
                            diskName.value = diskPath.value.replace(phyPathPrefix, '');
                            break;
                        case 'sd_path':
                            diskPath.value = newDisk.value!.sd_path;
                            diskName.value = diskPath.value.replace(sdPathPrefix, '');
                            break;	
                        default:
                            console.log('error with selectedDisks/diskIdentifier'); 
                            break;
                    }
                    console.log('disk:', diskName.value);
                    newVDev.disks.push(diskName.value);
                    console.log('newVdev.disks:', newVDev.disks);
                });

                addVDev(props.pool, newVDev);

                showAddVDevModal.value = false;
               disksLoaded.value = false;
                poolsLoaded.value = false;
                fileSystemsLoaded.value = false;
                allDisks.value = [];
                pools.value = [];
                datasets.value = [];
                await loadDisksThenPools(allDisks, pools);
                await loadDatasets(datasets);
                disksLoaded.value = true;
                poolsLoaded.value = true;
                fileSystemsLoaded.value = true;
            }
        }
    }
    
   
}

const replicationLevelCheck = () => {
	let result = true;
	isProperReplicationFeedback.value = '';
	
    if ((newVDev.type == 'dedup' || newVDev.type == 'special') && !newVDev.forceAdd && !newVDev.isMirror) {
        result = false;
        isProperReplicationFeedback.value = 'Mismatched replication level. Forcefully create to override.';
    } else if (newVDev.isMirror && (newVDev.type == 'special' || newVDev.type == 'dedup' || newVDev.type == 'log') && selectedDisks.value.length < 2) {
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

    selectedDisks.value.forEach(selDisk => {
        const disk = allDisks.value.find(fullDisk => fullDisk.name == selDisk);
        
        if (disk) {
            const currentCapacity = convertSizeToBytes(disk.capacity);

            if (previousCapacity != 0 && currentCapacity != previousCapacity) {
                diskSizeFeedback.value = `Mirror contains devices of different sizes. Forcefully create to override.\n`;
                result = false;
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
	
    if (newVDev.type == 'mirror' &&  selectedDisks.value.length < 2) {
        diskFeedback.value = 'Two or more Disks are required for Mirror.';
        result = false;
    } else if (newVDev.type == 'raidz1' &&  selectedDisks.value.length < 2) {
        diskFeedback.value = 'Two or more Disks are required for RaidZ1.';
        result = false;
    } else if (newVDev.type == 'raidz2' &&  selectedDisks.value.length < 3) {
        diskFeedback.value = 'Three or more Disks are required for RaidZ2.';
        result = false;
    } else if (newVDev.type == 'raidz3' &&  selectedDisks.value.length < 4) {
        diskFeedback.value = 'Four or more Disks are required for RaidZ3.';
        result = false;
    } else if (newVDev.type == 'disk' &&  selectedDisks.value.length < 1) {
        diskFeedback.value = 'At least one Disk is required.';
        result = false;
    } else if (newVDev.type == 'log' &&  selectedDisks.value.length < 1) {
        diskFeedback.value = 'At least one Disk is required for Log.';
        result = false;
    } else if (newVDev.type == 'cache' &&  selectedDisks.value.length < 1) {
        diskFeedback.value = 'At least one Disk is required for Cache.';		
        result = false;
    } else if (newVDev.type == 'special' &&  selectedDisks.value.length < 1) {
        diskFeedback.value = 'At least one Disk is required for Special.';
        result = false;
    } else if (newVDev.type == 'spare' &&  selectedDisks.value.length < 1) {
        diskFeedback.value = 'At least one Disk is required for Spare.';
        result = false;
    } else if (newVDev.type == 'dedup' &&  selectedDisks.value.length < 1) {
        diskFeedback.value = 'At least one Disk is required for Dedup.';
        result = false;
    } 

	return result;
}

const getIdKey = (name: string) => `${props.idKey}-${name}`;
</script>