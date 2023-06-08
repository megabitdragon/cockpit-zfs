<template>
 <div class="h-full flex flex-col overflow-auto">
    <HoustonHeader moduleName="ZFS" sourceURL=""
      issuesURL="" :pluginVersion="Number(pluginVersion)"
      :infoNudgeScrollbar="true" />
    <Navigation :navigationItems="navigation" :currentNavigationItem="currentNavigationItem" :navigationCallback="navigationCallback" :show="show"/>
    <ZFS :tag="navTag" :next="next" :pools="pools" :disks="allDisks"/>
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

const show = ref(true);
const navTag = ref('dashboard');

const currentNavigationItem = computed<NavigationItem | undefined>(() => navigation.find(item => item.current));

const allDisks =  reactive<Disk[]>([
  {id: 1, name: '1-11', type: 'ssd', usagePercent: 66, status: 'ONLINE', available: false, pool: 'tank', totalSize: 101,},
  {id: 2, name: '1-12', type: 'ssd', usagePercent: 66, status: 'ONLINE', available: false, pool: 'tank', totalSize: 102,},
  {id: 3, name: '1-13', type: 'ssd', usagePercent: 23, status: 'ONLINE', available: false, pool: 'tank', totalSize: 103,},
  {id: 4, name: '2-11', type: 'ssd', usagePercent: 75, status: 'ONLINE', available: false, pool: 'battletank', totalSize: 104,},
  {id: 5, name: '2-12', type: 'ssd', usagePercent: 88, status: 'WARNING', available: false, pool: 'battletank', totalSize: 105,},
  {id: 6, name: '2-13', type: 'ssd', usagePercent: 92, status: 'WARNING', available: false, pool: 'battletank', totalSize: 106,},
  {id: 7, name: '3-11', type: 'ssd', usagePercent: 0, status: 'ONLINE', available: true, totalSize: 107, description: "test test test test test"},
  {id: 8, name: '3-12', type: 'ssd', usagePercent: 0, status: 'ONLINE', available: true, totalSize: 108,},
  {id: 9, name: '3-13', type: 'ssd', usagePercent: 0, status: 'ONLINE', available: true, totalSize: 109,},
  {id: 10, name: '3-14', type: 'ssd', usagePercent: 0, status: 'ONLINE', available: true, totalSize: 110,},
  {id: 11, name: '4-11', type: 'ssd', usagePercent: 0, status: 'ONLINE', available: true, totalSize: 111,},
  {id: 12, name: '4-12', type: 'ssd', usagePercent: 0, status: 'ONLINE', available: true, totalSize: 112,},
  {id: 13, name: '4-13', type: 'ssd', usagePercent: 0, status: 'ONLINE', available: true, totalSize: 113,},
  {id: 14, name: '4-14', type: 'ssd', usagePercent: 0, status: 'ONLINE', available: true, totalSize: 114,},
]);

const pools = reactive<Pool[]>([
  {
    name: 'tank',
    vdevs: [
      {type: 'mirror',
      name: 'mirror-0',
      disks: [allDisks[0], allDisks[1]],
      forceAdd: false,
      availableDisks: [allDisks[0], allDisks[1],]},
      {type: 'cache',
      name: 'cache-0',
      disks: [allDisks[2]],
      forceAdd: false,
      availableDisks: [allDisks[2],]},
    ],
    settings: { 
      sector: '4kib',
      record: '128kib',
      compression: true,
      deduplication: false,
      refreservation: 0.10,
      autoExpand: true,
      autoReplace: false,
      autoTrim: false,
      forceCreate: false,
    },
    createFileSystem: false,
    usagePercent: 45,
    status: 'ONLINE',
    // claimedDisks: {
    //   'mirror-0': [allDisks[0].name, allDisks[1].name],
    //   'cache-0': [allDisks[2].name],
    // }
  },
  {
    name: 'battletank',
    vdevs: [
      {type: 'raidz2',
      name: 'raidz2-0',
      disks: [allDisks[3], allDisks[4], allDisks[5]],
      forceAdd: false,
      availableDisks: [allDisks[3], allDisks[4], allDisks[5]]},
    ],
    settings: {
      sector: '4kib',
      record: '128kib',
      compression: true,
      deduplication: false,
      refreservation: 0.10,
      autoExpand: true,
      autoReplace: false,
      autoTrim: false,
      forceCreate: false,
    },
    createFileSystem: false,
    usagePercent: 88,
    status: 'WARNING',
    // claimedDisks: {
    //   'raidz2-0': [allDisks[3].name, allDisks[4].name, allDisks[5].name],
    // }
  },
])

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
  { name: 'File Systems', tag: 'filesystems', current: computed(() => navTag.value == 'filesystems') as unknown as boolean, show: true, },
  // { name: 'Stats', tag: 'stats', current: computed(() => navTag.value == 'stats') as unknown as boolean, show: true, },
  // { name: 'Settings', tag: 'settings', current: computed(() => navTag.value == 'settings') as unknown as boolean, show: true, },
].filter(item => item.show));

provide("all-disks", allDisks);
provide("pools", pools);
</script>

  