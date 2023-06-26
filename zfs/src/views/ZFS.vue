<template>
  <div>
    <div class="w-full h-full px-8 bg-well text-default grow flex flex-col overflow-y-auto py-8">

      <div v-if="props.tag === 'dashboard'" class="p-4">
          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div class="overflow-auto shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <PoolSummary/>
            </div>
          </div>

          <!-- <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div class="overflow-auto shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <DiskSummary/>
            </div>
          </div> -->
      </div>

      <div v-if="props.tag === 'pools'" class="p-4">
        <PoolDiskList/>
      </div>

      <div v-if="props.tag === 'filesystems'" class="p-4">

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
import DiskSummary from "../components/disk/DiskSummary.vue";
import PoolSummary from "../components/pool/PoolSummary.vue";
import PoolDiskList from "../components/pool/PoolDiskList.vue";
import { getPools } from "../scripts/pools";
import { getDisks } from "../scripts/disks";

interface ZFSProps {
  tag: string;
}

const props = defineProps<ZFSProps>();

const pools = ref<PoolData[]>([]);
const vDevs = ref<vDevData[]>([]);
const disks = ref<DiskData[]>([]);

getDisks().then(rawJSON => {
  const parsedJSON = (JSON.parse(rawJSON));
  console.log('Disks JSON:');
  console.log(parsedJSON);

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
  
  getPools().then(rawJSON => {
    const parsedJSON = (JSON.parse(rawJSON));
    console.log('Pools JSON:');
    console.log(parsedJSON);

    for (let i = 0; i < parsedJSON.length; i++) {

      parsedJSON[i].groups.data.forEach(vDev => parseVDevData(vDev));
      parsedJSON[i].groups.cache.forEach(vDev => parseVDevData(vDev));
      parsedJSON[i].groups.dedup.forEach(vDev => parseVDevData(vDev));
      parsedJSON[i].groups.log.forEach(vDev => parseVDevData(vDev));
      parsedJSON[i].groups.spare.forEach(vDev => parseVDevData(vDev));
      parsedJSON[i].groups.special.forEach(vDev => parseVDevData(vDev));
    
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
        vdevs: vDevs.value,
        errors: [],
      }
      pools.value.push(poolData);
      console.log("poolData:");
      console.log(poolData);
      vDevs.value = [];
    }
    console.log("Pools:");
    console.log(pools);
  });
});

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
    console.log("Not A ChildDisk:");
    console.log(notAChildDisk);
    console.log("vDevData after not a child:");
    console.log(vDevData);
    vDevs.value.push(vDevData);
  } else {
    vDev.children.forEach(disk => {
      const childDisk : DiskData = {
        name: disk.name,
        path: disk.path,
        guid: disk.guid,
        type: disk.type,
        status: disk.status,
        stats: disk.stats,
        capacity: '',
        model: '',
        phy_path: '',
        sd_path: '',
        vdev_path: '',
        serial: '',
        usable: false,
      };
      
      const fullDiskData = disks.value.find(disk => disk.name === childDisk.name);
      
      childDisk.capacity = fullDiskData?.capacity!;
      childDisk.model = fullDiskData?.model!;
      childDisk.phy_path = fullDiskData?.phy_path!;
      childDisk.sd_path = fullDiskData?.sd_path!;
      childDisk.vdev_path = fullDiskData?.vdev_path!;
      childDisk.serial = fullDiskData?.serial!;

      console.log("ChildDisk:");
      console.log(childDisk);
      vDevData.disks.push(childDisk);
    });
  
    console.log("vDevData:");
    console.log(vDevData);
    vDevs.value.push(vDevData);
  }
}

provide("pools", pools);
provide("disks", disks);
</script>

