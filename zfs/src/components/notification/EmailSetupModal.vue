<template>
    <OldModal :isOpen="emailSetUpModal" @close="closeModal()" :marginTop="'mt-28'" :width="'w-3/5'" :minWidth="'min-w-3/5'" :closeOnBackgroundClick="false">
        <!-- <OldModal @close="closeModal" :isOpen="showAddVDevModal" :marginTop="props.marginTop" :width="'w-3/5'"
        :minWidth="'min-w-3/5'" :closeOnBackgroundClick="false"> -->
            <template v-slot:title>
                Email Notification Settings
            </template>
            <!-- <template v-slot:content> -->
            <template v-slot:content>

            <div>
                <div class="space-y-4">
                    <div class="flex justify-center space-x-2">
                    <!-- Email Provider Selection -->
                    <label class="block text-md w-[25%] py-2 font-medium">Select Email Provider</label>
                    <select v-model="emailProvider" class="w-[50%] p-2 border rounded">
                        <option value="smtp">SMTP</option>
                        <option value="gmail">Google (OAuth)</option>
                    </select>
                </div>

                    <!-- SMTP Settings -->
                    <div v-if="emailProvider === 'smtp'" class="space-y-3">
                        
                        <div class="flex justify-center space-x-2">
                            <label class="block w-[25%] text-md font-medium">Email Address  <InfoTile class="ml-1"
                                :title="`The sender's email address used for sending notifications. This should be a valid email that matches the SMTP provider's domain.`" />                            </label>
                            <input v-model="emailConfig.email" type="email" placeholder="your-email@example.com" class="w-[50%] p-2 border rounded" />
                        </div>
                        <div v-if="formValidationAttempted && (!emailConfig.email || !isEmailValid)" class="flex justify-center space-x-2">
                            <div class="w-[25%]"></div>
                            <p class="text-red-500 text-sm w-[50%]">
                                {{ !emailConfig.email ? "Email Address is required." : "Invalid email format." }}
                            </p>
                        </div>
                        <div class="flex justify-center space-x-2">
                            <label class="block w-[25%] text-md font-medium">Recievers Email Address  <InfoTile class="ml-1"
                                :title="`The sender's email address used for sending notifications. This should be a valid email that matches the SMTP provider's domain.`" />                            </label>
                            <input v-model="emailConfig.recieversEmail" type="email" placeholder="your-email@example.com" class="w-[50%] p-2 border rounded" />
                        </div>
                        <div v-if="formValidationAttempted && (!emailConfig.email || !isEmailValid)" class="flex justify-center space-x-2">
                            <div class="w-[25%]"></div>
                            <p class="text-red-500 text-sm w-[50%]">
                                {{ !emailConfig.email ? "Email Address is required." : "Invalid email format." }}
                            </p>
                        </div>
                        <div class="flex justify-center space-x-2">
                            <label class="block w-[25%] text-md font-medium">SMTP Server <InfoTile class="ml-1"
                                :title="`The address of the outgoing mail server. Example: smtp.gmail.com for Gmail, or smtp.office365.com for Outlook.`" />
                            </label>
                            <input v-model="emailConfig.smtpServer" type="text" placeholder="smtp.example.com" class="w-[50%] p-2 border rounded" />
                        </div>
                        <div v-if="formValidationAttempted && !emailConfig.smtpServer" class="flex justify-center space-x-2">
                            <div class="w-[25%]"></div>
                            <p  class="text-red-500 text-sm w-[50%]">SMTP Server is required.</p>

                        </div> 
                        <div class="flex justify-center space-x-2">
                            <label class="block w-[25%] text-md font-medium">SMTP Port <InfoTile class="ml-1"
                                :title="`The port number used to connect to the SMTP server.\nCommon values:\n- 25: Non-secure SMTP\n- 465: Secure SMTP (SSL)\n- 587: Secure SMTP (STARTTLS)`" />
                            </label>
                            <input v-model="emailConfig.smtpPort" type="number" placeholder="587" class="w-[50%] p-2 border rounded" />
                        </div>    
                        <div v-if="formValidationAttempted && !emailConfig.smtpPort" class="flex justify-center space-x-2">
                            <div class="w-[25%]"></div>
                            <p  class="text-red-500 w-[50%] text-sm">SMTP Port is required.</p>

                        </div>                      

                        <div class="flex justify-center space-x-2">
                            <label class="block w-[25%] text-md font-medium">Username <InfoTile class="ml-1"
                                :title="`The login username for authentication with the SMTP server. Usually the same as the sender email address.`" />                            </label>
                            <input v-model="emailConfig.username" type="text" placeholder="your-email@example.com" class="w-[50%] p-2 border rounded" />

                        </div>     
                        <div v-if="formValidationAttempted && !emailConfig.username" class="flex justify-center space-x-2">
                            <div class="w-[25%]"></div>
                            <p  class="text-red-500 text-sm w-[50%]">Username is required.</p>
                        </div>                    

                        <div  class="flex justify-center space-x-2">  
                            <label class="block  w-[25%] text-md font-medium">Password <InfoTile class="ml-1"
                                :title="`The password or app-specific password used for authenticating with the SMTP server.\nNote: Some providers require an app password instead of the regular account password.`" />
                            </label>
                            <input  v-model="emailConfig.password" type="password" placeholder="••••••••" class="w-[50%] p-2 border rounded" />
                        </div>
                        <div v-if="formValidationAttempted && !emailConfig.password" class="flex justify-center space-x-2">
                            <div class="w-[25%]"></div>
                            <p class="text-red-500 text-sm w-[50%]">Password is required.</p>
                        </div>                      

                        <div class="flex justify-center space-x-2 w-[25%]">
                            <input type="checkbox" v-model="emailConfig.tls" class="h-4 w-4" />
                            <label>Enable TLS             <InfoTile class="ml-1"
                                :title="`Enable Transport Layer Security (TLS) encryption for secure email transmission.\nThis is required for most modern SMTP providers using port 587.`" />
                            </label>
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
                            <button @click="updateSMTPConfig" class="bg-green-500 text-white p-2 rounded">Save</button>
                        </div>
                    </div>            
                </div>
            </div>
         </template>
        <!-- </OldModal> -->
    </OldModal>
</template>

<style>
.switch-class,
input[type="checkbox"] {
    pointer-events: auto !important;
}
</style>

<script setup lang="ts">
import { ref, inject, Ref, computed, watch, onMounted } from 'vue';
import {Modal, CardContainer } from '@45drives/houston-common-ui';
import InfoTile from '../common/InfoTile.vue';
import OldModal from '../common/OldModal.vue';

const emailSetUpModal = ref(false);
const emailProvider = ref("smtp");
const emailConfig = ref({
    email: "",
    smtpServer: "",
    smtpPort: 587,
    username: "",
    password: "",
    recieversEmail: "",
    tls: true
});
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isEmailValid = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailConfig.value.email) && emailRegex.test(emailConfig.value.recieversEmail);
});

const formValidationAttempted = ref(false); // Tracks if validation has been triggered

const isFormValid = () => {
    formValidationAttempted.value = true; // Mark validation as triggered
    return (
        emailConfig.value.email.trim() !== "" &&
        emailConfig.value.recieversEmail.trim() !== "" &&
        emailConfig.value.smtpServer.trim() !== "" &&
        emailConfig.value.smtpPort > 0 &&
        emailConfig.value.username.trim() !== "" &&
        emailConfig.value.password.trim() !== ""
    );
};
const closeModal = () => {
    emit('close');
}
const emit = defineEmits(['close']);

onMounted(() => {
    fetchMsmtpDetails();  // ✅ Fetch SMTP details on mount
    emailSetUpModal.value = true;
    console.log("modal is mounted")
});

const fetchMsmtpDetails = async () => {
    try {
        console.log("🔄 Fetching stored SMTP details...");

        const cockpit = (window as any).cockpit;
        const dbus = cockpit.dbus("org._45drives.Houston");

        // ✅ Call the method WITHOUT arguments
        const response = await dbus.call(
            "/org/_45drives/Houston",
            "org._45drives.Houston",
            "FetchMsmtpDetails",
            []  // ✅ Empty array since no arguments are needed
        );

        const smtpData = JSON.parse(response);
        if (smtpData.error) {
            console.error("❌ Error fetching SMTP details:", smtpData.error);
            alert("❌ Failed to fetch SMTP details.");
            return;
        }

        // ✅ Populate Vue state with fetched values
        emailConfig.value.email = smtpData.email;
        emailConfig.value.recieversEmail = smtpData.recieversEmail;
        emailConfig.value.smtpServer = smtpData.smtpServer;
        emailConfig.value.smtpPort = smtpData.smtpPort;
        emailConfig.value.username = smtpData.username;
        emailConfig.value.password = smtpData.password;
        emailConfig.value.tls = smtpData.tls;

        console.log("✅ SMTP details fetched successfully:", smtpData);
    } catch (error) {
        console.error("❌ Error fetching SMTP details:", error);
        alert("❌ Failed to fetch SMTP details.");
    }
};


const updateSMTPConfig = async () => {
    if (!isFormValid() || !isEmailValid ) {
        if(!isEmailValid){
            alert("⚠️ Please fill valid email address  before sending a test email.");

        }else{
            alert("⚠️ Please fill in all fields before sending a test email.");

        }
        return;
    }
    try {
        console.log("🔄 Updating SMTP Config via D-Bus...");

        const cockpit = (window as any).cockpit;
        const dbus = cockpit.dbus("org._45drives.Houston");

        const config = {
            email: emailConfig.value.email,
            smtpServer: emailConfig.value.smtpServer,
            smtpPort: emailConfig.value.smtpPort,
            username: emailConfig.value.username,
            password: emailConfig.value.password,
            recieversEmail: emailConfig.value.recieversEmail,
            tls: emailConfig.value.tls
        };

        // ✅ Ensure the correct D-Bus method call structure
        const response = await dbus.call(
            "/org/_45drives/Houston",   // ✅ Object path
            "org._45drives.Houston",    // ✅ Interface
            "UpdateSMTPConfig",         // ✅ Method name
            [JSON.stringify(config)]    // ✅ Argument (as an array)
        );

        console.log(`✅ D-Bus Response: ${response}`);
        alert("✅ SMTP Configuration updated successfully!");
        closeModal()

    } catch (error) {
        console.error("❌ Error updating SMTP settings via D-Bus:", error);
        alert("❌ Failed to update SMTP settings: " + error.message);
    }
};
const testEmail = async () => {

    if (!isFormValid() || !isEmailValid ) {
        if(!isEmailValid){
            alert("⚠️ Please fill valid email address  before sending a test email.");

        }else{
            alert("⚠️ Please fill in all fields before sending a test email.");

        }
        return;
    }
    try {
        console.log("🔄 Sending test email via D-Bus...");

        const cockpit = (window as any).cockpit;
        const dbus = cockpit.dbus("org._45drives.Houston");

        // ✅ Ensure all required fields are included
        const config = {
            email: emailConfig.value.email,
            smtpServer: emailConfig.value.smtpServer,
            smtpPort: emailConfig.value.smtpPort,
            username: emailConfig.value.username,
            password: emailConfig.value.password,
            tls: emailConfig.value.tls,
            recipientEmail: emailConfig.value.recieversEmail  // ✅ Added missing recipient
        };

        // ✅ Ensure correct D-Bus method call
        const response = await dbus.call(
            "/org/_45drives/Houston",  // ✅ Object path
            "org._45drives.Houston",   // ✅ Interface
            "SendTestEmail",           // ✅ Method name
            [JSON.stringify(config)]   // ✅ Argument (as an array)
        );

        console.log(`✅ D-Bus Response: ${response}`);

        // ✅ Display actual response
        alert(response.includes("✅") ? response : `✅ Test email sent: ${response}`);

    } catch (error) {
        console.error("❌ Error sending test email via D-Bus:", error);

        // ✅ Display backend error message
        alert(`❌ Failed to send test email: ${error.message || error}`);
    }
};



</script>