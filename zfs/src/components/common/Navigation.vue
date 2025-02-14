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
					
						<Menu>
							<!-- Menu Button (Bell Icon & Badge) -->
							<MenuButton class="relative rounded-full p-1 bg-default text-default hover:text-gray-600">
								<span class="sr-only">Open notifications</span>
								
								<!-- Bell Icon (Fixed Positioning) -->
								<div class="relative">
								<BellIcon class="w-6 h-6 text-gray-700" aria-hidden="true" />
								
								<!-- Notification Badge -->
								<span class="absolute -top-2 -right-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold px-1">
									50
								</span>
								</div>
							</MenuButton>

							<!-- Dropdown Menu Items -->
							<MenuItems @click.stop class="absolute right-0 z-10 w-[30rem] origin-top-right rounded-md bg-default shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
								
								Header
								<div class="flex items-center justify-between text-xl p-4 border-b border-gray-300">
								<p>Notifications</p>
								<Cog6ToothIcon class="w-[2rem] h-[2rem]" />
								</div>

								<!-- Notification Items -->
								<div class="py-4 px-4 space-y-4">
								
								<!-- Scrub Finished Notification -->
								<!-- <MenuItem as="div" v-slot="{ active }">
									<div class="flex items-start gap-3">
										<div > 
											<CheckCircleIcon class="icon-success size-icon-lg" aria-hidden="true" />

										</div>
									<div class="w-full">
										<p class="text-xl font-semibold text-green-500" >Scrub Finished - Test</p>
										<p class="pl-4 text-sm text-gray-400 ">- Scrubbing of pool Test finished at 2023-02-11 15:50:43</p>
									</div>
									<div>
										<XMarkIcon class="size-icon" aria-hidden="true" />

									</div>
									</div>
								</MenuItem> -->

								<!-- Pool Degraded (Admin Action) -->
								<!-- <MenuItem as="div" v-slot="{ active }">
									<div class="flex items-start gap-3">
										<div>
											<ExclamationCircleIcon class="icon-warning size-icon-lg" aria-hidden="true" />

										</div>
									<div class="w-full">
										<p class="text-xl font-semibold text-yellow-400">Pool Degraded - Tank</p>
										<p class="pl-4 text-sm text-gray-400"><span class="text-bold">-</span> One or more devices have been taken offline by the administrator. The pool continues functioning in a degraded state.</p>
									</div>
									<div>
										<XMarkIcon class="size-icon" aria-hidden="true" />

									</div>
									</div>
								</MenuItem> -->

								<!-- Pool Degraded (Unrecoverable Error) -->
								<!-- <MenuItem as="div" v-slot="{ active }">
									<div class="flex items-start gap-3">
										<div>
											<ExclamationCircleIcon class="icon-error size-icon-lg" aria-hidden="true" />

										</div>
									<div class="w-full">
										<p class="text-xl font-semibold text-red-600">Pool Degraded - Tank</p>
										<p class="pl-4 text-md text-gray-400">- One or more devices have experienced an unrecoverable error. An attempt was made to correct the error. Applications remain unaffected.</p>
									</div>
									<div>
										<XMarkIcon class="size-icon" aria-hidden="true" />

									</div>
									</div>
								</MenuItem> -->
								
								
								<!-- Pool Degraded (Unrecoverable Error) -->
								<MenuItem as="div" v-for="notification in notificationStore.notifications" :key="notification.id" v-slot="{ active }">
										<div class="flex items-start gap-3" v-if="notification.event === 'scrub_finish'" >
											<div >
												<CheckCircleIcon class="icon-success size-icon-lg text-green-500" aria-hidden="true" />
											</div>
											<div class="w-full">
											<p class="text-xl font-semibold text-green-500">Scrub Finished - {{ notification.pool }}</p>
											<p class="pl-4 text-sm text-gray-400">- Scrubbing of pool {{ notification.pool }} finished at {{ notification.timestamp }}</p>
											</div>
											<div>
												<XMarkIcon class="size-icon text-gray-500 cursor-pointer hover:text-red-500" aria-hidden="true" @click="" /> 
											</div>
										</div>
										<div class="flex items-start gap-3" v-if="notification.event === 'scrub_finish'" >
											<div >
												<CheckCircleIcon class="icon-success size-icon-lg text-green-500" aria-hidden="true" />
											</div>
											<div class="w-full">
											<p class="text-xl font-semibold text-green-500">Scrub Finished - {{ notification.pool }}</p>
											<p class="pl-4 text-sm text-gray-400">- Scrubbing of pool {{ notification.pool }} finished at {{ notification.timestamp }}</p>
											</div>
											<div>
												<XMarkIcon class="size-icon text-gray-500 cursor-pointer hover:text-red-500" aria-hidden="true" @click="" /> 
											</div>
										</div>
								</MenuItem>
								</div>

								<!-- Dismiss Button -->
								<div class="text-md p-4 flex justify-center border-t border-gray-300">
								<button class=" hover:underline">Dismiss all Notifications</button>
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
import { BellIcon, Cog6ToothIcon, CheckCircleIcon,ExclamationCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import {Menu,MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { notificationStore } from "../../store/notification";
interface NavigationProps {
	show: boolean;
	navigationItems: NavigationItem[];
	currentNavigationItem?: NavigationItem;
	navigationCallback: NavigationCallback;
}

const props = defineProps<NavigationProps>();

</script>