<template>
 <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
  <div class="overflow-auto shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg bg-gray-50">
    <div class="grid grid-cols-6 grid-flow-col gap-4">
      <Accordion class="ml-4">
        <template v-slot:title>
          <span class="font-semibold"> 
            Pools
          </span>
            <div>
              <img src="../../../public/icons/success.svg">
            </div>
          <span>
            Total Effective Space: {{ totalEffectiveSpace }} T
          </span>
        </template>
        <template v-slot:content>
          <div v-for="(pool, index) in pools" :key="index" class="col-span-2">
            <DashboardPoolCard :name="pools[index].name" :status="pools[index].status" :capacity="pools[index].properties.capacity" :size="pools[index].properties.size" :free="pools[index].properties.free" :allocated="pools[index].properties.allocated"/>
          </div>
        </template>
      </Accordion>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import {computed, ref, Ref, inject} from 'vue';
import { ArrowPathIcon } from '@heroicons/vue/24/outline';
import Accordion from "../common/Accordion.vue";
import DashboardPoolCard from "../pool/DashboardPoolCard.vue";

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