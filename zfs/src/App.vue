<template>
 <div class="h-full flex flex-col overflow-hidden">
    <HoustonHeader moduleName="ZFS" sourceURL=""
      issuesURL="" :pluginVersion="Number(pluginVersion)"
      :infoNudgeScrollbar="true" />
    <Navigation :navigationItems="navigation" :currentNavigationItem="currentNavigationItem" :navigationCallback="navigationCallback" :show="show"/>
    <ZFS :tag="navTag" :next="next" :pools="pools" :disks="disks"/>
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

const disks =  reactive<Disk[]>([
  {name: '1-11', type: 'ssd', usagePercent: 66, status: 'ONLINE'},
  {name: '1-12', type: 'ssd', usagePercent: 66, status: 'ONLINE'},
  {name: '1-13', type: 'ssd', usagePercent: 23, status: 'ONLINE'},
  {name: '2-11', type: 'ssd', usagePercent: 75, status: 'ONLINE'},
  {name: '2-12', type: 'ssd', usagePercent: 88, status: 'WARNING'},
  {name: '2-13', type: 'ssd', usagePercent: 92, status: 'WARNING'}
])

const pools = reactive<Pool[]>([
  {
    name: 'tank',
    vdevs: [
      {type: 'mirror',
      disks: [disks[0], disks[1]],
      isPrimary: true,
      forceAdd: false,},
      {type: 'cache',
      disks: [disks[2]],
      isPrimary: false,
      forceAdd: false,},
    ],
    sector: '4kib',
    record: '128kib',
    compression: true,
    deduplication: false,
    refreservation: 0.10,
    autoExpand: true,
    autoReplace: false,
    autoTrim: false,
    forceCreate: false,
    usagePercent: 45,
    status: 'ONLINE',
  },
  {
    name: 'battletank',
    vdevs: [
      {type: 'raidz2',
      disks: [disks[3], disks[4], disks[5]],
      isPrimary: true,
      forceAdd: false,},
    ],
    sector: '4kib',
    record: '128kib',
    compression: true,
    deduplication: false,
    refreservation: 0.10,
    autoExpand: true,
    autoReplace: false,
    autoTrim: false,
    forceCreate: false,
    usagePercent: 88,
    status: 'WARNING',
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
  { name: 'Disks', tag: 'disks', current: computed(() => navTag.value == 'disks') as unknown as boolean, show: true, },
  { name: 'Stats', tag: 'stats', current: computed(() => navTag.value == 'stats') as unknown as boolean, show: true, },
  { name: 'Settings', tag: 'settings', current: computed(() => navTag.value == 'settings') as unknown as boolean, show: true, },
].filter(item => item.show));

</script>

  