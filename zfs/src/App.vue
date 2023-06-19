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

const vDevData : vDevData = {
  name: '',
  type: '',
  status: '',
  stats: {},
  guid: '',
  disks: []
};

const childDisk : ChildDisk = {
  name: '',
  path: '',
  guid: '',
  type: '',
  status: '',
  stats: {},
};

getPools().then(rawJSON => {
  const parsedJSON = (JSON.parse(rawJSON));
  console.log(parsedJSON);

  for (let i = 0; i < parsedJSON.length; i++) {
    parsedJSON[i].groups.data.forEach(vDev => {
      vDevData.name = vDev.name;
      vDevData.guid = vDev.guid;
      vDevData.type = vDev.type;
      vDevData.status = vDev.status;
      vDevData.stats = vDev.stats;
      vDev.children.forEach(disk => {
        childDisk.name = disk.name;
        childDisk.guid = disk.guid;
        childDisk.type = disk.type;
        childDisk.path = disk.path;
        childDisk.status = disk.status;
        childDisk.stats = disk.stats;
        vDevData.disks.push(childDisk);
      });
      vDevs.value.push(vDevData);
    });

    // parsedJSON[i].groups.cache.forEach(vDev => {
    //  vDevData.name = vDev.name;
    //   vDevData.guid = vDev.guid;
    //   vDevData.type = vDev.type;
    //   vDevData.status = vDev.status;
    //   vDevData.stats = vDev.stats;
    //   vDevData.disks = vDev.children;
    //   vDevs.value.push(vDevData);
    // });

    // parsedJSON[i].groups.dedup.forEach(vDev => {
    //  vDevData.name = vDev.name;
    //   vDevData.guid = vDev.guid;
    //   vDevData.type = vDev.type;
    //   vDevData.status = vDev.status;
    //   vDevData.stats = vDev.stats;
    //   vDevData.disks = vDev.children;
    //   vDevs.value.push(vDevData);
    // });

    // parsedJSON[i].groups.log.forEach(vDev => {
    //  vDevData.name = vDev.name;
    //   vDevData.guid = vDev.guid;
    //   vDevData.type = vDev.type;
    //   vDevData.status = vDev.status;
    //   vDevData.stats = vDev.stats;
    //   vDevData.disks = vDev.children;
    //   vDevs.value.push(vDevData);
    // });

    // parsedJSON[i].groups.spare.forEach(vDev => {
    //  vDevData.name = vDev.name;
    //   vDevData.guid = vDev.guid;
    //   vDevData.type = vDev.type;
    //   vDevData.status = vDev.status;
    //   vDevData.stats = vDev.stats;
    //   vDevData.disks = vDev.children;
    //   vDevs.value.push(vDevData);
    // });

    // parsedJSON[i].groups.special.forEach(vDev => {
    //  vDevData.name = vDev.name;
    //   vDevData.guid = vDev.guid;
    //   vDevData.type = vDev.type;
    //   vDevData.status = vDev.status;
    //   vDevData.stats = vDev.stats;
    //   vDevData.disks = vDev.children;
    //   vDevs.value.push(vDevData);
    // });

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
    }
    disks.value.push(disk);
  }
  console.log(disks);
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

  