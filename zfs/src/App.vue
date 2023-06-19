<template>
 <div class="h-full flex flex-col overflow-auto">
    <HoustonHeader moduleName="ZFS" sourceURL=""
      issuesURL="" :pluginVersion="Number(pluginVersion)"
      :infoNudgeScrollbar="true" />
    <Navigation :navigationItems="navigation" :currentNavigationItem="currentNavigationItem" :navigationCallback="navigationCallback" :show="show"/>
    <ZFS :tag="navTag" :next="next"/>
  </div>
</template>

<script setup lang="ts">

import { reactive, ref, computed, provide } from 'vue';

import "@45drives/cockpit-css/src/index.css";
import "@45drives/cockpit-vue-components/dist/style.css";

import { pluginVersion } from "./version";
import { HoustonHeader } from "@45drives/cockpit-vue-components";

import Navigation from "./components/common/Navigation.vue";
import ZFS from './views/ZFS.vue';
import { getPools } from "./scripts/pools";
import { getDisks } from "./scripts/disks";

const show = ref(true);
const navTag = ref('dashboard');

const currentNavigationItem = computed<NavigationItem | undefined>(() => navigation.find(item => item.current));

const pools = ref<PoolData[]>([]);
const vDevs = ref<vDevData[]>([]);
const disks = ref<DiskData[]>([]);

function parseVDevData(vDev) {
  const vDevData : vDevData = {
    name: vDev.name,
    type: vDev.type,
    status: vDev.status,
    stats: vDev.stats,
    guid: vDev.guid,
    disks: [],
  };
  
  if (!vDev.children) {return}

  vDev.children.forEach(disk => {
    const childDisk : ChildDisk = {
      name: disk.name,
      path: disk.path,
      guid: disk.type,
      type: disk.type,
      status: disk.status,
      stats: disk.stats,
    };
    
    console.log(childDisk);
    vDevData.disks.push(childDisk);
  });
  
  console.log(vDevData);
  vDevs.value.push(vDevData);
}

getPools().then(rawJSON => {
  const parsedJSON = (JSON.parse(rawJSON));
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
        size: parsedJSON[i].properties.size.value,
        allocated: parsedJSON[i].properties.allocated.value,
        capacity: parsedJSON[i].properties.capacity.rawvalue,
        free: parsedJSON[i].properties.free.value,
      },
      vdevs: vDevs.value,
    }
    pools.value.push(poolData);
    console.log(poolData);
    vDevs.value = [];
  }
  console.log(pools);
});

getDisks().then(rawJSON => {
  const parsedJSON = (JSON.parse(rawJSON));
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
    }
    disks.value.push(disk);
    // console.log(disk);
  }
  // console.log(disks);
})

const navigationCallback: NavigationCallback = (item: NavigationItem) => {
	navTag.value = item.tag;
};

const next = () => {
	const currentTag = navTag.value;
	const currentItem = navigation.find(item => item.tag === currentTag);
	const currentIndex = navigation.indexOf(currentItem!);
	const nextIndex = currentIndex + 1;
	if (nextIndex >= navigation.length) return;
	const nextItem = navigation[nextIndex];
	navTag.value = nextItem.tag;
};

const navigation = reactive<NavigationItem[]>([
	{ name: 'Dashboard', tag: 'dashboard', current: computed(() => navTag.value == 'dashboard') as unknown as boolean, show: true, },
  { name: 'Pools', tag: 'pools', current: computed(() => navTag.value == 'pools') as unknown as boolean, show: true, },
  // { name: 'File Systems', tag: 'filesystems', current: computed(() => navTag.value == 'filesystems') as unknown as boolean, show: true, },
  // { name: 'Stats', tag: 'stats', current: computed(() => navTag.value == 'stats') as unknown as boolean, show: true, },
  // { name: 'Settings', tag: 'settings', current: computed(() => navTag.value == 'settings') as unknown as boolean, show: true, },
].filter(item => item.show));

provide("pool-data", pools);
provide("disks", disks);
</script>

  