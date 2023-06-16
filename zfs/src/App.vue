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

const show = ref(true);
const navTag = ref('dashboard');

const currentNavigationItem = computed<NavigationItem | undefined>(() => navigation.find(item => item.current));

const pools = ref<PoolData[]>([]);


getPools().then(rawJSON => {
  const parsedJSON = (JSON.parse(rawJSON));
  console.log(parsedJSON);

  for (let i = 0; i < parsedJSON.length; i++) {
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
      vdevs: {
        cache: parsedJSON[i].groups.cache,
        data: parsedJSON[i].groups.data,
        dedup: parsedJSON[i].groups.dedup,
        log: parsedJSON[i].groups.log,
        spare: parsedJSON[i].groups.spare,
        special: parsedJSON[i].groups.special,
      },
    }
    pools.value.push(poolData);
  }  
  console.log(pools);
});

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
</script>

  