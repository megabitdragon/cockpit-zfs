<template>
    <table class="min-w-full divide-y divide-gray-300">
        <tbody class="bg-gray-50">
            <Accordion class="ml-4">
                <template v-slot:title>
                    <span class="font-semibold text-xl">
                        <tr>
                          <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Disks</td>
                          <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"><img src="../../../public/icons/success.svg"></td>
                          <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{{ disks.length }} SSDs</td>
                          <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"><img src="../../../public/icons/success.svg"></td>
                          <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">0 HDDs</td>
                          <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Maximum Temp. X° C</td>
                          <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Raw Space: 0 TB</td>
                          <!-- <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"><button><ArrowPathIcon class="h-5 w-5"/></button></td> -->
                        </tr>
                    </span>
                </template>
                <template v-slot:content>
                  <tr>
                    <td v-for="(disk, index) in disks" :key="index">
                      <DiskCard :name="disk.name" :type="disk.type" :status="disk.status" :spaceUsed="0" :usable="disk.usable" :totalSize="disk.capacity!"/>
                    </td>
                  </tr>
                </template>
            </Accordion>
        </tbody>
    </table>
</template>

<script setup lang="ts">
import { ref, inject, Ref } from "vue";
import { ArrowPathIcon } from '@heroicons/vue/24/outline';
import Accordion from '../common/Accordion.vue';
import DiskCard from '../disk/DiskCard.vue';

const disks = inject<Ref<DiskData[]>>('disks')!;

</script>