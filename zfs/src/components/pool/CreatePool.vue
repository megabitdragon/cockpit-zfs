<template>
  <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
    <div class="flex h-16 shrink-0 items-center">
      <span>Create a New Storage Pool</span>
    </div>
    <nav class="flex flex-1 flex-col">
      <ul role="list" class="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" class="-mx-2 space-y-1">
            <li v-for="item in navigation" :key="item.name">
              <a :href="item.href" :class="[item.current ? 'bg-gray-50' : 'hover:bg-gray-50', 'block rounded-md py-2 pr-2 pl-10 text-sm leading-6 font-semibold text-gray-700']">{{ item.name }}</a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
    <div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'


const navigation = [
  { name: 'Name this pool', href: '#', current: true },
  { name: 'Select disks', href: '#', current: false },
  { name: 'Configure pool settings', href: '#', current: false },
  { name: 'Set up a file system', href: '#', current: false },
  { name: 'Review configuration', href: '#', current: false },
  
]
</script>