<template>
    <table class="min-w-full divide-y divide-gray-300">
        <tbody class="bg-gray-50">
            <Accordion>
                <template v-slot:title>
                    <span class="font-semibold text-xl">
                        <tr>
                        <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Disks</td>
                        <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"><img src="../../../public/icons/success.svg"></td>
                        <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">4 SSDs</td>
                        <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"><img src="../../../public/icons/success.svg"></td>
                        <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">5 HDDs</td>
                        <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Maximum Temp. X° C</td>
                        <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Raw Space: 0 TB</td>
                        <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"><button><ArrowPathIcon class="h-3 h-5"/></button></td>
                        </tr>
                    </span>
                </template>
                <template v-slot:content>
                  <tr>
                    <td>
                      <DiskCard name="SSD1" status="ONLINE" :spaceUsed="45"/>
                    </td>
                    <td>
                      <DiskCard name="SSD2" status="ONLINE" :spaceUsed="60"/>
                    </td>
                    <td>
                      <DiskCard name="SSD3" status="ONLINE" :spaceUsed="27"/>
                    </td>
                    <td>
                      <DiskCard name="SSD4" status="ONLINE" :spaceUsed="45"/>
                    </td>
                    <td>
                      <DiskCard name="HDD1" status="ONLINE" :spaceUsed="95"/>
                    </td>
                    <td>
                      <DiskCard name="HDD2" status="ONLINE" :spaceUsed="33"/>
                    </td>
                    <td>
                      <DiskCard name="HDD3" status="ONLINE" :spaceUsed="75"/>
                    </td>
                    <td>
                      <DiskCard name="HDD4" status="ONLINE" :spaceUsed="50"/>
                    </td>
                    <td>
                      <DiskCard name="HDD5" status="ONLINE" :spaceUsed="90"/>
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


</script>