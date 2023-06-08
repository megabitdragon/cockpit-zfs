<template>
    <table class="min-w-full divide-y divide-gray-300">
        <tbody class="bg-gray-50">
            <Accordion class="ml-4">
                <template v-slot:title>
                    <span class="font-semibold text-xl">
                        <tr>
                          <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Pools</td>
                          <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"><img src="../../../public/icons/success.svg"></td>
                          <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{{ pools.length }}</td>
                          <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Effective Space: 0 TB</td>
                          <!-- <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"><button @onClick=""><ArrowPathIcon class="h-5 w-5"/></button></td> -->
                        </tr>
                    </span>
                </template>
                <template v-slot:content>
                    <tr>
                      <td v-for="(pool, index) in pools" :key="index">
                        <PoolCard :name="pool.name" :status="pool.status" :spaceUsed="pool.usagePercent!" :totalSize="pool.totalSize!"/>
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
import Accordion from "../common/Accordion.vue";
import PoolCard from "../pool/PoolCard.vue";

const pools = inject<Ref<Pool[]>>('pools')!;

</script>