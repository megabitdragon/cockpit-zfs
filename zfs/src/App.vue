<template>
    <div class="h-full flex flex-col overflow-hidden">
      <HoustonHeader moduleName="ZFS" sourceURL=""
        issuesURL="" :pluginVersion="pluginVersion"
        :infoNudgeScrollbar="true" />
  
      <div class="w-full px-8 bg-well text-default grow flex flex-col overflow-y-auto py-8">
        <div>
          <div class="sm:hidden">
            <label for="tabs" class="sr-only">Select a tab</label>
            <!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
            <select id="tabs" name="tabs" class="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-slate-500 focus:outline-none focus:ring-slate-500 sm:text-sm">
              <option v-for="tab in tabs" :key="tab.name" :selected="tab.current">{{ tab.name }}</option>
            </select>
          </div>
          <!--^^^ Mobile or very small screen ^^^-->
  
          <!--vvv Desktop/Regular version vvv-->
          <div class="hidden sm:block">
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                <a v-for="tab in tabs" :key="tab.name" :href="tab.href" :class="[tab.current ? 'border-slate-500 text-slate-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium']" :aria-current="tab.current ? 'page' : undefined">{{ tab.name }}</a>
              </nav>
            </div>
          </div>
        </div>
        
        <div id="app" class="p-4">
            <div class="button-group-row justify-end">
                <button id="createPool" class="btn btn-primary object-right" @click="">Create Storage Pool</button>
                <button id="importPool" class="btn btn-secondary object-right" @click="" disabled>Import Storage Pool</button>
            </div>

            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-300">
                  <tbody class="bg-gray-50">
                    <Accordion class="ml-4">
                        <template v-slot:title>
                            <span class="font-semibold text-xl">
                              <tr>
                                <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Pools</td>
                                <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"><img src="../public/icons/success.svg"></td>
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
                                      <img src="../public/icons/success.svg">
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
                                      <img src="../public/icons/success.svg">
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
                                      <img src="../public/icons/success.svg">
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
              </div>
            </div>

            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-300">
                  <tbody class="bg-gray-50">
                    <Accordion class="ml-4">
                        <template v-slot:title>
                            <span class="font-semibold text-xl">
                              <tr>
                                <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Disks</td>
                                <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"><img src="../public/icons/success.svg"></td>
                                <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">4 SSDs</td>
                                <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"><img src="../public/icons/success.svg"></td>
                                <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">5 HDDs</td>
                                <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Maximum Temp. X° C</td>
                                <td scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Raw Space: 0 TB</td>
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
                                      <img src="../public/icons/success.svg">
                                    </td>
                                    <td><span>SSD1</span></td><td><button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<DotsVerticalIcon class="h-3 h-5"/></button></td>
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
                                      <img src="../public/icons/warning.svg">
                                    </td>
                                    <td><span>SSD 2</span></td><td><button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<DotsVerticalIcon class="h-3 h-5"/></button></td>
                                  </tr>
                                  <tr>
                                    <span>ONLINE</span>
                                  </tr>
                                </template>
                                <template v-slot:content>
                                  <tr>
                                    <div class="flex justify-between mb-1">
                                      <span class="text-base font-medium text-red-700 dark:text-white">Space Usage&nbsp; &nbsp;&nbsp;</span>
                                      <span class="text-sm font-medium text-red-700 dark:text-white">95%</span>
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                      <div class="bg-red-600 h-2.5 rounded-full" style="width: 95%"></div>
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
                                      <img src="../public/icons/success.svg">
                                    </td>
                                    <td><span>HDD 4</span></td><td><button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<DotsVerticalIcon class="h-3 h-5"/></button></td>
                                  </tr>
                                  <tr>
                                    <span>ONLINE</span>
                                  </tr>
                                </template>
                                <template v-slot:content>
                                  <tr>
                                    <div class="flex justify-between mb-1">
                                      <span class="text-base font-medium text-green-700 dark:text-white">Space Usage&nbsp; &nbsp;&nbsp;</span>
                                      <span class="text-sm font-medium text-green-700 dark:text-white">15%</span>
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                      <div class="bg-green-600 h-2.5 rounded-full" style="width: 15%"></div>
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
              </div>
            </div>
            
        </div>
        
      </div>
    </div>
</template>

<script setup>
  import "@45drives/cockpit-css/src/index.css";
  import "@45drives/cockpit-vue-components/dist/style.css";
  import { useSpawn, objectURLDownload } from "@45drives/cockpit-helpers";
  import { ref, computed, watch } from "vue";
  import { pluginVersion } from "./version";
  import { HoustonHeader } from "@45drives/cockpit-vue-components";
  import {CheckCircleIcon, DotsVerticalIcon, ExclamationCircleIcon, RefreshIcon, QuestionMarkCircleIcon} from '@heroicons/vue/outline';
  import Accordion from "./components/common/Accordion.vue";
  import Card from "./components/common/Card.vue";
  
  const tabs = [
    { name: 'Dashboard', href: '#', current: true },
    { name: 'Pools', href: '#', current: false },
    { name: 'Disks', href: '#', current: false },
    { name: 'Stats', href: '#', current: false },
    { name: 'Settings', href:'#', current: false}
  ];


</script>

<style>

</style>
  