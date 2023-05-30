<template>
    <table class="min-w-full divide-y divide-gray-300">
        <tbody class="bg-gray-50">
            <Accordion>
                <template v-slot:title>
                    <span class="font-semibold text-xl">
                        <tr>
                          <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Pools</td>
                          <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"><img src="../../../public/icons/success.svg"></td>
                          <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">7</td>
                          <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Effective Space: 0 TB</td>
                          <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"><button><ArrowPathIcon class="h-3 h-5"/></button></td>
                        </tr>
                    </span>
                </template>
                <template v-slot:content>
                    <tr>
                        <td>
                          <PoolCard name="Pool1" status="ONLINE" :spaceUsed="45"/>
                        </td>
                        <td>
                          <PoolCard name="Pool2" status="ONLINE" :spaceUsed="88"/>
                        </td>
                        <td>
                          <PoolCard name="Pool3" status="ONLINE" :spaceUsed="50"/>
                        </td>
                        <td>
                          <PoolCard name="Pool4" status="ONLINE" :spaceUsed="75"/>
                        </td>
                        <td>
                          <PoolCard name="Pool5" status="ONLINE" :spaceUsed="13"/>
                        </td>
                        <td>
                          <PoolCard name="Pool6" status="ONLINE" :spaceUsed="66"/>
                        </td>
                        <td>
                          <PoolCard name="Pool7" status="ONLINE" :spaceUsed="25"/>
                        </td>
                    </tr>
                </template>
            </Accordion>
        </tbody>
    </table>
</template>

<script setup lang="ts">
import { ArrowPathIcon } from '@heroicons/vue/24/outline';
import Accordion from "../common/Accordion.vue";
import PoolCard from "../pool/PoolCard.vue";


</script>