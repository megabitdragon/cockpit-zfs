<template>
    <table class="min-w-full divide-y divide-gray-300">
        <tbody class="bg-gray-50">
            <Accordion class="ml-4">
                <template v-slot:title>
                    <span class="font-semibold text-xl">
                        <tr>
                        <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Disks</td>
                        <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"><img src="../../../public/icons/success.svg"></td>
                        <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{{ props.disks.length }} SSDs</td>
                        <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"><img src="../../../public/icons/success.svg"></td>
                        <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">0 HDDs</td>
                        <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Maximum Temp. X° C</td>
                        <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Raw Space: 0 TB</td>
                        <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"><button><ArrowPathIcon class="h-3 h-5"/></button></td>
                        </tr>
                    </span>
                </template>
                <template v-slot:content>
                  <tr>
                    <td v-for="(disk, index) in props.disks" :key="index">
                      <DiskCard :name="disk.name" :member="disk.member" :type="disk.type" :status="disk.status" :spaceUsed="disk.usagePercent!" :totalSize="disk.totalSize!"/>
                    </td>
                  </tr>
                </template>
            </Accordion>
        </tbody>
    </table>
</template>

<script setup lang="ts">
import { ArrowPathIcon } from '@heroicons/vue/24/outline';
import Accordion from '../common/Accordion.vue';
import DiskCard from '../disk/DiskCard.vue';

interface DiskSummaryProps {
  disks: Disk[];
}

const props = defineProps<DiskSummaryProps>();

</script>