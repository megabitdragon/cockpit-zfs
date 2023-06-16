<template>
    <table class="min-w-full divide-y divide-gray-300">
        <tbody class="bg-gray-50">
            <Accordion class="ml-4">
                <template v-slot:title>
                    <span class="font-semibold text-xl">
                        <tr>
                          <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Pools</td>
                          <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"><img src="../../../public/icons/success.svg"></td>
                          <!-- <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{{ pools.length }}</td> -->
                          <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Effective Space: X TB</td>
                          <!-- <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"><button @onClick=""><ArrowPathIcon class="h-5 w-5"/></button></td> -->
                        </tr>
                    </span>
                </template>
                <template v-slot:content>
                    <tr>
                      <!-- <td v-for="(pool, index) in pools" :key="index">
                        <PoolCard :name="pool.name" :status="pool.status" :spaceUsed="pool.usagePercent!" :totalSize="pool.totalSize!"/>
                      </td> -->
                      <td v-for="(pool, index) in poolData" :key="index">
                        <PoolCard :name="poolData[index].name" :status="poolData[index].status" :capacity="poolData[index].properties.capacity" :size="poolData[index].properties.size" :free="poolData[index].properties.free" :allocated="poolData[index].properties.allocated"/>
                      </td>
                    </tr>
                </template>
            </Accordion>
        </tbody>
    </table>
</template>

<script setup lang="ts">
import {computed, ref, Ref, inject} from 'vue';
import { ArrowPathIcon } from '@heroicons/vue/24/outline';
import Accordion from "../common/Accordion.vue";
import PoolCard from "../pool/PoolCard.vue";

const poolData = inject<Ref<PoolData[]>>("pool-data")!;

</script>