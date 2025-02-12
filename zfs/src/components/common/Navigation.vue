<template>
	<div class="bg-default">
		<div class="sm:hidden">
			<label for="tabs" class="sr-only">Select a tab</label>
			<!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
			<select id="tabs" name="tabs" class="block w-full rounded-md border-default py-2 pl-3 pr-10 text-base focus:border-fefault focus:outline-none focus:ring-slate-500 sm:text-sm">
				<option v-for="item in props.navigationItems" :key="item.name" @change="navigationCallback(item)" :selected="item.current">{{ item.name }}</option>
			</select>
		</div>
		<!--^^^ Mobile or very small screen --- DOES NOT WORK YET (onChange wont work for some reason) ^^^-->

		<!--vvv Desktop/Regular version vvv-->
		<div class="hidden sm:block">
			<div class="border-b border-default">
				<nav class="-mb-px flex justify-center" aria-label="Tabs">
					<a v-for="item in props.navigationItems" :key="item.name"
						@click.prevent="navigationCallback(item)"
						:class="[item.current ? 'border-default text-default' : 'border-transparent text-secondary hover:border-default hover:text-default', 'whitespace-nowrap border-b-4 py-4 px-4 text-sm font-medium']" :aria-current="item.current ? 'page' : undefined">{{ item.name }}</a>
					
						<Menu @click="isMenuOpen = !isMenuOpen" @mouseleave="isMenuOpen = false">
							<div>
							<p>Notifications</p>
						</div>
						<MenuButton class="rounded-full p-1 bg-default text-default hover:text-gray-600">
								<span class="sr-only">Open options</span>
								<BellIcon class="w-6 pt-[1rem] right-10" aria-hidden="true" />
								<span 
								class="relative top-[-2.25rem] ml-[0.5625rem] flex min-w-[1.25rem] px-1 h-5 items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold"								>
								50
							</span>
							</MenuButton>

					<MenuItems @click.stop
									class="absolute  z-10 w-max origin-top-right rounded-md bg-default shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
									<div class="py-1">
										<MenuItem as="div" v-slot="{ active }">
										<a href="#" 
											:class="[active ? 'bg-accent text-default' : 'text-muted', 'block px-4 py-2 text-sm']">
											Pool Details</a>
										</MenuItem>
										
										<MenuItem as="div" v-slot="{ active }">
										<a href="#" 
											:class="[active ? 'bg-accent text-default' : 'text-muted', 'block px-4 py-2 text-sm']">
											Export Pool</a>
										</MenuItem>
										<MenuItem as="div" v-slot="{ active }">
										<a href="#" 
											:class="[active ? 'bg-danger text-default' : 'text-muted', 'block px-4 py-2 text-sm']">
											Destroy Pool</a>
										</MenuItem>
									</div>
					</MenuItems>
				</Menu>

				</nav>
				<!-- <Notifications
					:notificationFIFO="notificationFIFO"
					ref="notifications"
				/> -->
			</div>
		</div>

	
	</div>
</template>

<script setup lang="ts">
import { BellIcon } from '@heroicons/vue/24/outline';
import {Menu,MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { ref, watch, onMounted, onUnmounted } from 'vue';
interface NavigationProps {
	show: boolean;
	navigationItems: NavigationItem[];
	currentNavigationItem?: NavigationItem;
	navigationCallback: NavigationCallback;
}
const isMenuOpen = ref(false);
watch(isMenuOpen, (newVal) => {
  if (newVal) {
    document.body.classList.add('no-scroll');
  } else {
    document.body.classList.remove('no-scroll');
  }
});

// Ensure cleanup when the component is unmounted
onUnmounted(() => {
  document.body.classList.remove('no-scroll');
});
const props = defineProps<NavigationProps>();

</script>