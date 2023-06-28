<template>
    <table class="min-w-full divide-y divide-gray-300">
        <tbody class="bg-gray-50">
            <Accordion class="ml-4">
                <template v-slot:title>
                    <span class="font-semibold text-xl">
                        <tr>
                          <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Pools</td>
                          <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"></td>                       
                          <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Effective Space: {{ totalEffectiveSpace }} T</td>
                        </tr>
                    </span>
                </template>
                <template v-slot:content>
                    <tr>
                      <td v-for="(pool, index) in pools" :key="index">
                        <PoolCard :name="pools[index].name" :status="pools[index].status" :capacity="pools[index].properties.capacity" :size="pools[index].properties.size" :free="pools[index].properties.free" :allocated="pools[index].properties.allocated"/>
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

const pools = inject<Ref<PoolData[]>>("pools")!;

const totalEffectiveSpace = computed(() => {
  let totalCapacity = 0;
  pools.value.forEach(pool => {
    totalCapacity += pool.properties.rawsize;
  });
  const totalBytes = (totalCapacity / 1100000000000);
  const totalString = totalBytes.toFixed(2).toString();
  return totalString;
});

</script>