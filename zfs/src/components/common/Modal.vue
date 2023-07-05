<template>
	<TransitionRoot as="template" :show="open">
		<Dialog as="div" class="relative z-10" @close="open = false">
			<TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
				<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
			</TransitionChild>

			<div class="fixed inset-0 z-10 overflow-y-auto">
				<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
					<TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
						<DialogPanel class="w-full h-full min-w-full min-h-full overflow-auto rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all">
						<!-- <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
								<button type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2" @click="open = false">
									<span class="sr-only">Close</span>
									<XMarkIcon class="h-6 w-6" aria-hidden="true" />
								</button>
							</div> -->
							<div class="sm:flex sitems-center">
								<div class="w-full mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
									<DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
										<slot name="title"/>
									</DialogTitle>
									<div class="mt-2 w-full">
										<p class="text-sm text-gray-500">
											<slot name="content"/>
										</p>
									</div>
								</div>
							</div>
							<div class="w-full mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
								<slot name="footer"/>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>

		</Dialog>
	</TransitionRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const open = ref(true)
</script>