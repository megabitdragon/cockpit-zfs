<template>
  <div>
    <div class="w-full h-full px-8 bg-well text-default overflow-y-visible py-8">

      <div v-if="props.tag === 'dashboard'" class="p-4">
        <Dashboard/>
      </div>

      <div v-if="props.tag === 'pools'" class="p-4">
        <PoolDiskList/>
      </div>

      <div v-if="props.tag === 'filesystems'" class="p-4">
        <FileSystemSummary/>
      </div>

      <!-- <div v-if="props.tag === 'stats'" class="p-4">
      
      </div>

      <div v-if="props.tag === 'settings'" class="p-4">
      
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, Ref, inject, computed, provide } from 'vue';
import "@45drives/cockpit-css/src/index.css";
import "@45drives/cockpit-vue-components/dist/style.css";
import PoolDiskList from "../components/pool/PoolDiskList.vue";
import Dashboard from '../components/pool/Dashboard.vue';
import { getPools } from "../scripts/pools";
import { getDisks } from "../scripts/disks";
import { getDatasets } from "../scripts/datasets";
import FileSystemSummary from '../components/file-systems/FileSystemSummary.vue';

interface ZFSProps {
  tag: string;
}

const props = defineProps<ZFSProps>();

const pools = ref<PoolData[]>([]);
const vDevs = ref<vDevData[]>([]);
const disks = ref<DiskData[]>([]);
const fileSystems = ref<FileSystemData[]>([]);
const datasets = ref<Dataset[]>([]);

//executes python script to retrieve all disks in server and output a JSON
getDisks().then(rawJSON => {
  const parsedJSON = (JSON.parse(rawJSON));
  console.log('Disks JSON:');
  console.log(parsedJSON);

  //loops through and adds disk data from JSON to disk data object, pushes objects to disks array
  for (let i = 0; i < parsedJSON.length; i++) {
    const disk = {
      name: parsedJSON[i].name,
      capacity: parsedJSON[i].capacity,
      model: parsedJSON[i].model,
      type: parsedJSON[i].type,
      phy_path: parsedJSON[i].phy_path,
      sd_path: parsedJSON[i].sd_path,
      vdev_path: parsedJSON[i].vdev_path,
      serial: parsedJSON[i].serial,
      usable: parsedJSON[i].usable,
      path: '',
      guid: '',
      status: '',
      stats: {},
    }
    disks.value.push(disk);
    // console.log("Disk:");
    // console.log(disk);
  }
  // console.log("Disks:");
  // console.log(disks);
  
  //executes a python script to retrieve all zfs pools on server and output a JSON
  getPools().then(rawJSON => {
    const parsedJSON = (JSON.parse(rawJSON));
    console.log('Pools JSON:');
    console.log(parsedJSON);

    //loops through pool JSON
    for (let i = 0; i < parsedJSON.length; i++) {
      //calls parse function for each type of VDev that could be in the Pool, then pushes the VDev data to VDev array
      parsedJSON[i].groups.data.forEach(vDev => parseVDevData(vDev));
      parsedJSON[i].groups.cache.forEach(vDev => parseVDevData(vDev));
      parsedJSON[i].groups.dedup.forEach(vDev => parseVDevData(vDev));
      parsedJSON[i].groups.log.forEach(vDev => parseVDevData(vDev));
      parsedJSON[i].groups.spare.forEach(vDev => parseVDevData(vDev));
      parsedJSON[i].groups.special.forEach(vDev => parseVDevData(vDev));
    
      //adds pool data from JSON into pool data object, pushes into array 
      const poolData = {
        name: parsedJSON[i].name,
        status: parsedJSON[i].status,
        guid: parsedJSON[i].guid,
        properties: {
          rawsize: parsedJSON[i].properties.size.parsed,
          size: parsedJSON[i].properties.size.value,
          allocated: parsedJSON[i].properties.allocated.value,
          capacity: parsedJSON[i].properties.capacity.rawvalue,
          free: parsedJSON[i].properties.free.value,
        },
        //adds VDev array to Pool data object
        vdevs: vDevs.value,
        // fileSystems: parsedJSON[i].root_dataset.value,
      }
     
      pools.value.push(poolData);

      // if (parsedJSON[i].root_dataset.children && parsedJSON[i].root_dataset.children.length > 0) {
      //   parsedJSON[i].root_dataset.children.forEach(child => {
      //     recursiveChildCheck(child, poolData);
      //   });
      // }

      //console.log("poolData:");
      //console.log(poolData);
      vDevs.value = [];
    }
    //console.log("Pools:");
    //console.log(pools);
  });
});

//trying to figure out a way to recursively add filesystems + nested filesystems to pool data object

// function recursiveChildCheck(dataset, pool) {
//   const datasetData = {
//     name: dataset.name,
//     children: [],
//   }

//   if (dataset.children.length >= 1) {
//     dataset.children.forEach(child => {
//       recursiveChildCheck(child, datasetData)
//     });
//   }

//   pool.value.datasets.push(datasetData);
// };

function recursiveChildData(dataset) {
  if (dataset.children.length >= 1) {
    dataset.children.forEach(child => {
      recursiveChildData(child);
    });
  }
}

//executes a python script to retrieve all dataset data and outputs a JSON
getDatasets().then(rawJSON => {
    const parsedJSON = (JSON.parse(rawJSON));
    console.log('Datasets JSON:');
    console.log(parsedJSON);

    //loops through JSON data and adds data to a Dataset object
    for (let i = 0; i < parsedJSON.length; i++) {
      const dataset : Dataset = {
        name: parsedJSON[i].name,
        id: parsedJSON[i].id,
        mountpoint: parsedJSON[i].mountpoint,
        pool: parsedJSON[i].pool,
        encrypted: parsedJSON[i].encrypted,
        key_loaded: parsedJSON[i].key_loaded,
        type: parsedJSON[i].type,
        properties: {
          available: parsedJSON[i].properties.available.value,
          creation: parsedJSON[i].properties.creation.value,
          snapshotCount: parsedJSON[i].properties.snapshot_count.value,
          used: parsedJSON[i].properties.used.value,
          accessTime: parsedJSON[i].properties.atime.value,
          caseSensitivity: parsedJSON[i].properties.casesensitivity.value,
          compression: parsedJSON[i].properties.compression.value,
          deduplication: parsedJSON[i].properties.dedup.value,
          dNodeSize: parsedJSON[i].properties.dnodesize.value,
          extendedAttributes: '',
          readOnly: parsedJSON[i].properties.readonly.value,
          recordSize: parsedJSON[i].properties.recordsize.value,
          quota: parsedJSON[i].properties.quota.value,
          mounted: parsedJSON[i].properties.mounted.value,
        },
      }

      datasets.value.push(dataset);
    }
});

//method for parsing through VDevs to add to array (VDev array is added to Pool)
function parseVDevData(vDev) {
  const vDevData : vDevData = {
    name: vDev.name,
    type: vDev.type,
    status: vDev.status,
    stats: vDev.stats,
    guid: vDev.guid,
    selectedDisks: [],
    disks: [],
  };
  
  //checks if VDev has child disks and if not, stores the disk information as the VDev itself (vdev-level disks) then adds to VDev array
  if (vDev.children.length < 1) {
    const diskVDev = disks.value.find(disk => disk.name === vDev.name)!;
    const notAChildDisk : DiskData = {
      name: diskVDev.name,
      path: vDev.path,
      guid: vDev.guid,
      type: diskVDev.type,
      status: vDev.status,
      stats: vDev.stats,
      capacity: diskVDev.capacity,
      model: diskVDev.model,
      phy_path: diskVDev.phy_path,
      sd_path: diskVDev.sd_path,
      vdev_path: diskVDev.vdev_path,
      serial: diskVDev.serial,
      usable: false,
    }
    
    vDevData.disks.push(notAChildDisk);
    //console.log("Not A ChildDisk:");
    //console.log(notAChildDisk);
    //console.log("vDevData after not a child:");
    //console.log(vDevData);
    vDevs.value.push(vDevData);
  } else {
    //if VDev does have child disks, add those disks to the VDev data object + array
    vDev.children.forEach(disk1 => {
      const fullDiskData = disks.value.find(disk => disk.name === disk1.name)!;
      const childDisk : DiskData = {
        name: fullDiskData.name,
        path: fullDiskData.path,
        guid: fullDiskData.guid,
        type: fullDiskData.type,
        status: fullDiskData.status,
        stats: fullDiskData.stats,
        capacity: fullDiskData.capacity,
        model: fullDiskData.model,
        phy_path: fullDiskData.phy_path,
        sd_path: fullDiskData.sd_path,
        vdev_path: fullDiskData.vdev_path,
        serial: fullDiskData.serial,
        usable: false,
      }; 

      //console.log("ChildDisk:");
      //console.log(childDisk);
      vDevData.disks.push(childDisk);
    });
  
    //console.log("vDevData:");
    //console.log(vDevData);
    vDevs.value.push(vDevData);
  }
}

//provide data for other components to inject
provide("pools", pools);
provide("disks", disks);
provide("datasets", datasets);
</script>

