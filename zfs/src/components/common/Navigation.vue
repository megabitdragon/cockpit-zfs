<template>
	<div class="bg-default">
		<div>
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
									<div class="flex items-start gap-3" v-if="notification.event === 'scrub_finish'">
										<!-- Icon Based on Scrub Status -->
										<div>
											<CheckCircleIcon 
											v-if="notification.errors === 'No' && notification.error !== 'null'" 
											class="icon-success size-icon-lg text-green-500" 
											aria-hidden="true" 
											/>
											<ExclamationCircleIcon 
											v-else 
											class="icon-warning size-icon-lg text-yellow-500" 
											aria-hidden="true" 
											/>
										</div>

										<!-- Notification Content -->
										<div class="w-full">
											<p class="text-xl font-semibold" 
											:class="{
												'text-green-500': notification.errors === 'No',
												'text-yellow-500': notification.errors !== 'No'
											}"
											>
											Scrub Finished - {{ notification.pool }}
											</p>
											<p class="pl-4 text-sm text-white-400">
											- Scrubbing of pool <strong>{{ notification.pool }}</strong> finished at <strong>{{ notification.timestamp }}</strong>
											</p>

											<!-- Show Errors if Found -->
											<p class="pl-4 text-sm" v-if="notification.errors !== '0' && notification.errors !== 'null' ">
											Errors Detected:<strong class="text-yellow-500">{{ notification.errors }}</strong>
											</p>
										</div>

										<!-- Close Button -->
										<div>
											<XMarkIcon 
											class="size-icon text-white-500 cursor-pointer hover:text-red-500" 
											aria-hidden="true" 
											@click="handleDismiss(notification.id)" 
											/> 
										</div>
									</div>

										<div class="flex items-start gap-3" v-if="notification.event === 'vdev_attach'" >
											<div >
												<CheckCircleIcon class="icon-success size-icon-lg text-green-500" aria-hidden="true" />
											</div>
											<div class="w-full">
											<p class="text-xl font-semibold text-green-500">VDev Added - {{ notification.pool }}</p>
											<p class="pl-4 text-sm" :class="{
												'text-green-500': notification.state === 'ONLINE',
												'text-yellow-500': notification.state === 'DEGRADED',
												'text-red-500': notification.state === 'FAULTED'
											}">
												Status: <strong>{{ notification.state }}</strong>
											</p>
											<p class="pl-4 text-sm text-white-500">- A new virtual device <strong>{{ notification.vdev }}</strong> has been successfully added to the pool {{ notification.pool }}
												<br> <strong>timestamp:</strong> {{ notification.timestamp }}
											</p>
											</div>
											<div>
												<XMarkIcon class="size-icon text-white-500 cursor-pointer hover:text-red-500" aria-hidden="true" @click="handleDismiss(notification.id)"  /> 
											</div>
										</div>
										<div class="flex items-start gap-3" v-if="notification.event === 'resilver_finish'" >
											<div >
												<CheckCircleIcon class="icon-success size-icon-lg text-green-500" aria-hidden="true" />
											</div>
											<div class="w-full">
											<p class="text-xl font-semibold text-green-500">Resilver Finished - {{ notification.pool }}</p>
											<p class="pl-4 text-sm text-white-500">- Resilvering completed successfully for the pool <strong>{{ notification.pool }}</strong>
												<br> <strong>timestamp: </strong> {{ notification.timestamp }}
											</p>
											</div>
											<div>
												<XMarkIcon class="size-icon text-white-500 cursor-pointer hover:text-red-500" aria-hidden="true" @click="handleDismiss(notification.id)"  /> 
											</div>
										</div>
										<div class="flex items-start gap-3" v-if="notification.event === 'vdev_clear'" >
											<div >
												<CheckCircleIcon class="icon-success size-icon-lg text-green-500" aria-hidden="true" />
											</div>
											<div class="w-full">
												<p class="text-xl font-semibold text-green-500">VDEV Cleared - {{ notification.pool }}</p>
												<p>
													- Virtual device <strong>{{ notification.vdev }}</strong> was cleared in pool <strong>{{ notification.pool }}</strong>.
												</p>

												<!-- Status -->
												<p class="pl-4 text-sm" :class="{
													'text-green-500': notification.state === 'ONLINE',
													'text-yellow-500': notification.state === 'DEGRADED',
													'text-red-500': notification.state === 'FAULTED' || notification.state === 'UNAVAIL'
													}">
													Status: {{ notification.state }}
												</p>

												<!-- Show Last Recorded Error Only If It Exists -->
												<p class="pl-4 text-sm text-white-500" v-if="notification.description && notification.description !== 'None'">
													Last Recorded Error: <strong>{{ notification.description }}</strong>
												</p>

												<!-- GUID, Error, Timestamp Section -->
												<div class="mt-2 text-sm text-white-500 border-t pt-2">
													<p v-if="notification.guid">
													 GUID: <strong>{{ notification.guid }}</strong>
													</p>
													<p v-if="notification.error && notification.error !== 'None' && notification.error !== 'null' ">
													 Error:<strong> {{ notification.error }}</strong>
													</p>
													<p><strong>Timestamp: </strong> {{ notification.timestamp }}</p>
												</div>
												</div>
											<div>
												<XMarkIcon class="size-icon text-white-500 cursor-pointer hover:text-red-500" aria-hidden="true" @click="handleDismiss(notification.id)"  /> 
											</div>
										</div>
										<div class="flex items-start gap-3" v-if="notification.event === 'pool_import'" >
											  <!-- Icon Based on Pool Health -->
											<div>
												<CheckCircleIcon v-if="notification.health === 'ONLINE'" class="icon-success size-icon-lg text-green-500" aria-hidden="true" />
												<ExclamationCircleIcon v-else-if="notification.health === 'DEGRADED'" class="icon-warning size-icon-lg text-yellow-500" aria-hidden="true" />
												<XCircleIcon v-else class="icon-error size-icon-lg text-red-500" aria-hidden="true" />
											</div>
												<!-- Event Details -->
												<div class="w-full">
													<p :class="{
														'text-green-500': notification.health === 'ONLINE',
														'text-yellow-500': notification.health === 'DEGRADED',
														'text-red-500': notification.health === 'FAULTED'
													}">ZFS Pool Imported - {{ notification.pool }}</p>
													<p class="pl-4 text-sm text-white-500">
													- Pool <strong>{{ notification.pool }}</strong> has been successfully imported.
													<br> Status:  
													<strong :class="{
														'text-green-500': notification.health === 'ONLINE',
														'text-yellow-500': notification.health === 'DEGRADED',
														'text-red-500': notification.health === 'FAULTED'
													}">
														{{ notification.health }}
													</strong>
													<br><strong> Timestamp: </strong> {{ notification.timestamp }}
													</p>
												</div>
											<div>
												<XMarkIcon class="size-icon text-white-500 cursor-pointer hover:text-red-500" aria-hidden="true" @click="handleDismiss(notification.id)"  /> 
											</div>
										</div>
										<div class="flex items-start gap-3" v-if="notification.event === 'statechange'">
										<!-- Icon Based on Scrub Status -->
										<!-- Status Icon -->
										<div>
										<CheckCircleIcon v-if="notification.state === 'ONLINE'" class="text-green-500 size-icon-lg" />
										<ExclamationCircleIcon v-else-if="notification.state === 'DEGRADED'" class="text-orange-600 size-icon-lg" />
										<ExclamationCircleIcon v-else class="text-red-500 size-icon-lg" />
										</div>

										<!-- Notification Content -->
										<div class="w-full">
										<p class="text-lg font-semibold" :class="{
											'text-green-600': notification.state === 'ONLINE',
											'text-yellow-600': notification.state === 'DEGRADED',
											'text-red-600': notification.state === 'FAULTED',
										}">
											{{ notification.event.replace("_", " ").toUpperCase() }} - {{ notification.pool }}
										</p>
										<p class="text-sm text-white-600">
											<strong>Pool:</strong> {{ notification.pool ?? "N/A" }}  
											<br><strong>VDEV:</strong> {{ notification.vdev ?? "Unknown" }}  
											<br><strong>Status: </strong>  
											<span :class="{
											'text-green-500': notification.state === 'ONLINE',
											'text-yellow-500': notification.state === 'DEGRADED',
											'text-red-500': notification.state === 'FAULTED'
											}">
											{{ notification.state }}
											</span>
										</p>

										<!-- Show Error if Exists -->
										<p v-if="notification.error !== 'None' && notification.error !== 'null'" class="text-sm text-red-500">
											<strong>Error:</strong> {{ notification.error }}
										</p>

										<!-- Show Description if Exists -->
										<p v-if="notification.description !== 'None'" class="text-sm text-white-500">
											 <strong>Description:</strong> {{ notification.description }}
										</p>

										<!-- Timestamp -->
										<p class="text-sm text-white-500">
											 <strong>Timestamp:</strong> {{ notification.timestamp }}
										</p>
										</div>
										<!-- Close Button -->
										<div>
											<XMarkIcon 
											class="size-icon text-white-500 cursor-pointer hover:text-red-500" 
											aria-hidden="true" 
											@click="handleDismiss(notification.id)"
											/> 
										</div>
									</div>
								</MenuItem>
								</div>

								<!-- Dismiss Button -->
								<div class="text-md p-4 flex justify-center border-t border-gray-300">
								<button   @click="dismissAllNotifications()" class=" hover:underline">Dismiss all Notifications</button>
								</div>
							
							</MenuItems>
							</Menu>


				</nav>
			</div>
		</div>

	
	</div>
</template>

<script setup lang="ts">
import { NavigationItem, NavigationCallback } from '../../types';

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

async function handleDismiss(notificationId) {
  await notificationStore.markNotificationAsRead(notificationId);
 notificationStore.removeNotification(notificationId);
}
async function dismissAllNotifications() {
  await notificationStore.clearAllNotifications();
 notificationStore.removeAllNotifications();
}
onMounted(() => {
  notificationStore.fetchMissedNotifications();
  console.log("hello from navigation notification")
});

const props = defineProps<NavigationProps>();

</script>