<template>
  <Modal class="lg:border-b lg:border-t lg:border-gray-200">
    <template v-slot:title>
      <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Progress">
        <ol role="list" class="overflow-hidden rounded-md lg:flex lg:rounded-none lg:border-l lg:border-r lg:border-gray-200">
          <li v-for="(step, stepIdx) in steps" :key="step.id" class="relative overflow-hidden lg:flex-1">
            <div :class="[stepIdx === 0 ? 'rounded-t-md border-b-0' : '', stepIdx === steps.length - 1 ? 'rounded-b-md border-t-0' : '', 'overflow-hidden border border-gray-200 lg:border-0']">
              <a v-if="step.status === 'complete'" :href="step.href" class="group">
                <span class="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-gray-200 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full" aria-hidden="true" />
                <span :class="[stepIdx !== 0 ? 'lg:pl-9' : '', 'flex items-start px-6 py-5 text-sm font-medium']">
                  <span class="flex-shrink-0">
                    <span class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-600">
                      <CheckCircleIcon class="h-6 w-6 text-white" aria-hidden="true" />
                    </span>
                  </span>
                  <span class="ml-4 mt-0.5 flex min-w-0 flex-col">
                    <span class="text-sm font-medium">{{ step.name }}</span>
                    <!-- <span class="text-sm font-medium text-gray-500">{{ step.description }}</span> -->
                  </span>
                </span>
              </a>
              <a v-else-if="step.status === 'current'" :href="step.href" aria-current="step">
                <span class="absolute left-0 top-0 h-full w-1 bg-slate-600 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full" aria-hidden="true" />
                <span :class="[stepIdx !== 0 ? 'lg:pl-9' : '', 'flex items-start px-6 py-5 text-sm font-medium']">
                  <span class="flex-shrink-0">
                    <span class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-600">
                      <span class="text-slate-600">{{ step.id }}</span>
                    </span>
                  </span>
                  <span class="ml-4 mt-0.5 flex min-w-0 flex-col">
                    <span class="text-sm font-medium text-slate-600">{{ step.name }}</span>
                    <!-- <span class="text-sm font-medium text-gray-500">{{ step.description }}</span> -->
                  </span>
                </span>
              </a>
              <a v-else :href="step.href" class="group">
                <span class="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-gray-200 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full" aria-hidden="true" />
                <span :class="[stepIdx !== 0 ? 'lg:pl-9' : '', 'flex items-start px-6 py-5 text-sm font-medium']">
                  <span class="flex-shrink-0">
                    <span class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300">
                      <span class="text-gray-500">{{ step.id }}</span>
                    </span>
                  </span>
                  <span class="ml-4 mt-0.5 flex min-w-0 flex-col">
                    <span class="text-sm font-medium text-gray-500">{{ step.name }}</span>
                    <!-- <span class="text-sm font-medium text-gray-500">{{ step.description }}</span> -->
                  </span>
                </span>
              </a>
              <template v-if="stepIdx !== 0">
                <!-- Separator -->
                <div class="absolute inset-0 left-0 top-0 hidden w-3 lg:block" aria-hidden="true">
                  <svg class="h-full w-full text-gray-300" viewBox="0 0 12 82" fill="none" preserveAspectRatio="none">
                    <path d="M0.5 0V31L10.5 41L0.5 51V82" stroke="currentcolor" vector-effect="non-scaling-stroke" />
                  </svg>
                </div>
              </template>
            </div>
          </li>
        </ol>
      </nav>
    </template>
    <template v-slot:content>

    </template>
    <template v-slot:footer>
      <div class="button-group-row">
          <button id="back" class="btn btn-secondary object-left justify-start" @click="">Back</button>
          <button id="next" class="btn btn-primary object-right justify-end" @click="" >Next</button>
      </div>
    </template>
    
  </Modal>
</template>

<script setup lang="ts">
import Modal from '../common/Modal.vue';
import { CheckCircleIcon } from '@heroicons/vue/24/outline';

const steps = [
  { id: '01',name: 'Name this pool', href: '#', status: 'current' },
  { id: '02',name: 'Select disks', href: '#', status: 'upcoming' },
  { id: '03',name: 'Configure pool settings',href: '#', status: 'upcoming' },
  { id: '04',name: 'Set up a file system', href: '#', status: 'upcoming' },
  { id: '05',name: 'Review configuration', href: '#',  status: 'upcoming' },
]

</script>








