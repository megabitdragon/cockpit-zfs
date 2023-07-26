<template>
 <div class="h-full flex flex-col bg-default">
		<HoustonHeader moduleName="ZFS" sourceURL=""
			issuesURL="" :pluginVersion="Number(pluginVersion)"
			:infoNudgeScrollbar="true" />
		<Navigation :navigationItems="navigation" :currentNavigationItem="currentNavigationItem" :navigationCallback="navigationCallback" :show="show"/>
		<ZFS :tag="navTag"/>
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

//navigation for tabs
const navigationCallback: NavigationCallback = (item: NavigationItem) => {
	navTag.value = item.tag;
};

//tabs for navigation
const navigation = reactive<NavigationItem[]>([
	{ name: 'Dashboard', tag: 'dashboard', current: computed(() => navTag.value == 'dashboard') as unknown as boolean, show: true, },
	{ name: 'Pools', tag: 'pools', current: computed(() => navTag.value == 'pools') as unknown as boolean, show: true, },
	{ name: 'File Systems', tag: 'filesystems', current: computed(() => navTag.value == 'filesystems') as unknown as boolean, show: true, },
	// { name: 'Stats', tag: 'stats', current: computed(() => navTag.value == 'stats') as unknown as boolean, show: true, },
	// { name: 'Settings', tag: 'settings', current: computed(() => navTag.value == 'settings') as unknown as boolean, show: true, },
].filter(item => item.show));
</script>

	