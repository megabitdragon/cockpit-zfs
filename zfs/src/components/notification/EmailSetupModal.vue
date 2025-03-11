<template>
    <Modal :show="emailSetUpModal" class=" !w-3/5 !mt-28 rounded-lg">
        <!-- <OldModal @close="closeModal" :isOpen="showAddVDevModal" :marginTop="props.marginTop" :width="'w-3/5'"
        :minWidth="'min-w-3/5'" :closeOnBackgroundClick="false"> -->
        <CardContainer class="!w-3/5 !mt-28 mx-auto rounded-lg">
            <template v-slot:header>
                Email Notification Settings
            </template>
            <!-- <template v-slot:content> -->
            <div>
                <div class="space-y-4">
                    <div class="flex justify-center space-x-2">
                    <!-- Email Provider Selection -->
                    <label class="block text-md w-[25%] py-2 font-medium">Select Email Provider</label>
                    <select v-model="emailProvider" class="w-[50%] p-2 border rounded">
                        <option value="smtp">SMTP</option>
                        <option value="gmail">Google (OAuth)</option>
                        <option value="outlook">Outlook (OAuth)</option>
                    </select>
                </div>

                    <!-- SMTP Settings -->
                    <div v-if="emailProvider === 'smtp'" class="space-y-3">
                        <div class="flex justify-center space-x-2">
                            <label class="block w-[25%] text-md font-medium">Email Address  <InfoTile class="ml-1"
                            :title="`How long to keep source snapshots for. Leave at 0 to keep ALL snapshots.\nWARNING: Disabling an automated task's schedule for a period of time longer than the retention interval and re-enabling the schedule may result in a purge of snapshots.`" />
                            </label>
                            <input v-model="emailConfig.email" type="email" placeholder="your-email@example.com" class="w-[50%] p-2 border rounded" />
                        </div>
                        <div class="flex justify-center space-x-2">
                            <label class="block w-[25%] text-md font-medium">SMTP Server <InfoTile class="ml-1"
                                :title="`How long to keep source snapshots for. Leave at 0 to keep ALL snapshots.\nWARNING: Disabling an automated task's schedule for a period of time longer than the retention interval and re-enabling the schedule may result in a purge of snapshots.`" />
                            </label>
                            <input v-model="emailConfig.smtpServer" type="text" placeholder="smtp.example.com" class="w-[50%] p-2 border rounded" />
                        </div>
                        <div class="flex justify-center space-x-2">
                            <label class="block w-[25%] text-md font-medium">SMTP Port <InfoTile class="ml-1"
                                :title="`How long to keep source snapshots for. Leave at 0 to keep ALL snapshots.\nWARNING: Disabling an automated task's schedule for a period of time longer than the retention interval and re-enabling the schedule may result in a purge of snapshots.`" />
                            </label>
                            <input v-model="emailConfig.smtpPort" type="number" placeholder="587" class="w-[50%] p-2 border rounded" />
                        </div>
                        <div class="flex justify-center space-x-2">
                            <label class="block w-[25%] text-md font-medium">Username <InfoTile class="ml-1"
                                :title="`How long to keep source snapshots for. Leave at 0 to keep ALL snapshots.\nWARNING: Disabling an automated task's schedule for a period of time longer than the retention interval and re-enabling the schedule may result in a purge of snapshots.`" />
                            </label>
                            <input v-model="emailConfig.username" type="text" placeholder="your-email@example.com" class="w-[50%] p-2 border rounded" />
                        </div>
                        <div class="flex justify-center space-x-2">  
                            <label class="block  w-[25%] text-md font-medium">Password <InfoTile class="ml-1"
                                :title="`How long to keep source snapshots for. Leave at 0 to keep ALL snapshots.\nWARNING: Disabling an automated task's schedule for a period of time longer than the retention interval and re-enabling the schedule may result in a purge of snapshots.`" />
                            </label>
                            <input  v-model="emailConfig.password" type="password" placeholder="••••••••" class="w-[50%] p-2 border rounded" />
                        </div>
                        <div class="flex justify-center space-x-2">
                            <input type="checkbox" v-model="emailConfig.tls" class="h-4 w-4" />
                            <label>Enable TLS</label>
                        </div>
                    </div>

                    <!-- OAuth Setup for Google -->
                    <div v-if="emailProvider !== 'smtp'" class="space-y-3 text-center">
                        <div class="w-[100%] mt-[1rem]">
                            <p class="text-sm text-gray-500">OAuth setup requires authentication via your email provider.</p>
                        </div>
                        <div>
                            <button @click="connectOAuth" class="w-[30%] bg-blue-600 text-white p-2 mb-[1rem]rounded">Connect with Google</button>
                        </div>
                    </div>

                    <!-- Test Email & Save -->
                    <div class="flex justify-between mt-4">
                        <button @click="testEmail" class="bg-gray-500 text-white p-2 rounded">Send Test Email</button>
                        <div class="space-x-2">
                            <button @click="closeModal" class="bg-red-500 text-white p-2 rounded">Cancel</button>
                            <button @click="saveSettings" class="bg-green-500 text-white p-2 rounded">Save</button>
                        </div>
                    </div>            
                </div>
            </div>
         
        </CardContainer>
        <!-- </OldModal> -->
    </Modal>
</template>

<style>
.switch-class,
input[type="checkbox"] {
    pointer-events: auto !important;
}
</style>

<script setup lang="ts">
import { ref, inject, Ref, computed, watch, onMounted } from 'vue';
import { Switch } from '@headlessui/vue';
import {Modal, CardContainer } from '@45drives/houston-common-ui';
import InfoTile from '../common/InfoTile.vue';

const emailSetUpModal = ref(false);
const emailProvider = ref("smtp");
const emailConfig = ref({
    email: "",
    smtpServer: "",
    smtpPort: 587,
    username: "",
    password: "",
    tls: true
});
const closeModal = () => {
    emailSetUpModal.value = false;
    emit('close');
}
const emit = defineEmits(['close']);

onMounted(() => {
    emailSetUpModal.value = true;
    console.log("modal is mounted")
});

</script>