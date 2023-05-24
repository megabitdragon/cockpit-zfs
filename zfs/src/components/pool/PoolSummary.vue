<template>
    <table class="min-w-full divide-y divide-gray-300">
        <tbody class="bg-gray-50">
            <Accordion class="ml-4">
                <template v-slot:title>
                    <span class="font-semibold text-xl">
                        <tr>
                        <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Pools</td>
                        <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"><img src="../../../public/icons/success.svg"></td>
                        <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">7</td>
                        <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Effective Space: 0 TB</td>
                        <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"><RefreshIcon class="h-3 h-5"/></td>
                        </tr>
                    </span>
                </template>
                <template v-slot:content>
                    <tr>
                        <td>
                            <Card class="mt-2 mb-4">
                            <template v-slot:title>
                                <tr>
                                <td>
                                    <img src="../../../public/icons/success.svg">
                                </td>
                                <td><span>Pool1</span></td><td><button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<DotsVerticalIcon class="h-3 h-5"/></button></td>
                                </tr>
                                <tr>
                                <span>ONLINE</span>
                                </tr>
                            </template>
                            <template v-slot:content>
                                <tr>
                                <div class="flex justify-between mb-1">
                                    <span class="text-base font-medium text-green-700 dark:text-white">Space Usage&nbsp; &nbsp;&nbsp;</span>
                                    <span class="text-sm font-medium text-green-700 dark:text-white">45%</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                    <div class="bg-green-600 h-2.5 rounded-full" style="width: 45%"></div>
                                </div>
                                </tr>
                            </template>
                            <template v-slot:footer>
                                <tr>
                                Used&nbsp; &nbsp;&nbsp;X TB
                                </tr>
                                <tr>
                                Free&nbsp; &nbsp;&nbsp;Y TB
                                </tr>
                                <tr>
                                <b>Total&nbsp; &nbsp;&nbsp;Z TB</b>
                                </tr>
                            </template>
                            </Card>
                            </td>
                            <td>
                            <Card class="mt-2 mb-4">
                            <template v-slot:title>
                                <tr>
                                <td>
                                    <img src="../../../public/icons/success.svg">
                                </td>
                                <td><span>Pool2</span></td><td><button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<DotsVerticalIcon class="h-3 h-5"/></button></td>
                                </tr>
                                <tr>
                                <span>ONLINE</span>
                                </tr>
                            </template>
                            <template v-slot:content>
                                <tr>
                                <div class="flex justify-between mb-1">
                                    <span class="text-base font-medium text-green-700 dark:text-white">Space Usage&nbsp; &nbsp;&nbsp;</span>
                                    <span class="text-sm font-medium text-green-700 dark:text-white">88%</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                    <div class="bg-green-600 h-2.5 rounded-full" style="width: 88%"></div>
                                </div>
                                </tr>
                            </template>
                            <template v-slot:footer>
                                <tr>
                                Used&nbsp; &nbsp;&nbsp;X TB
                                </tr>
                                <tr>
                                Free&nbsp; &nbsp;&nbsp;Y TB
                                </tr>
                                <tr>
                                <b>Total&nbsp; &nbsp;&nbsp;Z TB</b>
                                </tr>
                            </template>
                            </Card>
                        </td>
                        <td>
                            <Card class="mt-2 mb-4">
                                <template v-slot:title>
                                    <tr>
                                    <td>
                                        <img src="../../../public/icons/success.svg">
                                    </td>
                                    <td><span>Pool3</span></td><td><button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<DotsVerticalIcon class="h-3 h-5"/></button></td>
                                    </tr>
                                    <tr>
                                    <span>ONLINE</span>
                                    </tr>
                                </template>
                                <template v-slot:content>
                                    <tr>
                                    <div class="flex justify-between mb-1">
                                        <span class="text-base font-medium text-green-700 dark:text-white">Space Usage&nbsp;&nbsp;&nbsp;</span>
                                        <span class="text-sm font-medium text-green-700 dark:text-white">50%</span>
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                        <div class="bg-green-600 h-2.5 rounded-full" style="width: 50%"></div>
                                    </div>
                                    </tr>
                                </template>
                                <template v-slot:footer>
                                    <tr>
                                    Used&nbsp; &nbsp;&nbsp;X TB
                                    </tr>
                                    <tr>
                                    Free&nbsp; &nbsp;&nbsp;Y TB
                                    </tr>
                                    <tr>
                                    <b>Total&nbsp; &nbsp;&nbsp;Z TB</b>
                                    </tr>
                                </template>
                            </Card>
                        </td>
                    </tr>
                </template>
            </Accordion>
        </tbody>
    </table>
</template>

<script>
  import {CheckCircleIcon, DotsVerticalIcon, ExclamationCircleIcon, RefreshIcon, QuestionMarkCircleIcon} from '@heroicons/vue/outline';
  import Accordion from "../common/Accordion.vue";
  import Card from "../common/Card.vue";

  export default {

  };
</script>