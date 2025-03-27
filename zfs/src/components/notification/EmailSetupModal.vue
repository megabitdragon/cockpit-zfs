<template>		
    <OldModal :isOpen="emailSetUpModal" @close="closeModal()" :marginTop="'mt-28'" :width="'w-3/5'" :minWidth="'min-w-3/5'" :closeOnBackgroundClick="false">
        <!-- <OldModal @close="closeModal" :isOpen="showAddVDevModal" :marginTop="props.marginTop" :width="'w-3/5'"
        :minWidth="'min-w-3/5'" :closeOnBackgroundClick="false"> -->
            <template v-slot:title>
                Email Notification Settings
            </template>
            <!-- <template v-slot:content> -->
            <template v-slot:content>
                <div class="flex border-b mb-6">
                    <button
                        @click="activeTab = 'email-settings'"
                        :class="['px-4 py-2', activeTab === 'email-settings' ? 'border-b-2 text-white font-semibold' : 'text-gray-500']"
                    >
                        Email Settings
                    </button>
                    <button
                        @click="activeTab = 'warning-levels'"
                        :class="['px-4 py-2', activeTab === 'warning-levels' ? 'border-b-2 text-white font-semibold' : 'text-gray-500']"
                    >
                        Warning Levels
                    </button>
                    </div>
                 <!-- UI for setting up warning levels -->
                    <div v-if="activeTab === 'warning-levels'" class="p-4 space-y-4">
                        <h2 class="text-lg font-semibold mb-2">Set Warning Levels</h2>
                        
                        <div
                            v-for="(label, key) in warningEvents"
                            :key="key"
                            v-if="key !== 'stateChange'"
                            class="flex justify-center space-x-2"
                        >
                            <label class="w-[25%] text-md font-medium">{{ label }}</label>
                            <select v-model="warningConfig[key]" class="w-[50%] p-2 border rounded-lg">
                            <option value="info">Info</option>
                            <option value="warning">Warning</option>
                            <option value="critical">Critical</option>
                            </select>
                        </div>

                        <!-- Fixed Critical field for State Change -->
                        <div class="flex justify-center space-x-2">
                            <label class="w-[25%] text-md font-medium">State Change - Degraded/Faulted</label>
                            <input type="text" value="Critical" disabled class="w-[50%] p-2 border rounded-lg bg-gray-100 text-red-600 font-semibold text-center" />
                        </div>

                        <div class="flex justify-end space-x-2 mt-4">
                            <button @click="closeModal" class="bg-red-500 text-white p-2 rounded">Cancel</button>
                            <button @click="saveWarningConfig" class="bg-green-500 text-white p-2 rounded">Save</button>
                        </div>
                        </div>
             <!-- UI for setting up emails -->
            <div>
                <div v-if="activeTab === 'email-settings'" class="space-y-4">
                    <div class="flex justify-center space-x-2">
                        <!-- Email Provider Selection -->
                        <label class="block text-md w-[25%] py-2 font-medium">Select Email Provider</label>
                        <select v-model="emailConfig.authMethod" class="w-[50%] p-2 border rounded-lg">
                            <option value="smtp">SMTP</option>
                            <option value="oauth2">Google (OAuth)</option>
                        </select>
                    </div>

                    <!-- SMTP Settings -->
                    <div v-if="emailConfig.authMethod === 'smtp'" class="space-y-3">
                        
                        <div class="flex justify-center space-x-2">
                            <label class="block w-[25%] text-md font-medium">Email Address  <InfoTile class="ml-1"
                                :title="`The sender's email address used for sending notifications. This should be a valid email that matches the SMTP provider's domain.`" />                            </label>
                            <input v-model="emailConfig.email" type="email" placeholder="your-email@example.com" class="w-[50%] p-2 border rounded-lg" />
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
                            <input v-model="emailConfig.smtpServer" type="text" placeholder="smtp.example.com" class="w-[50%] p-2 border rounded-lg" />
                        </div>
                        <div v-if="formValidationAttempted && !emailConfig.smtpServer" class="flex justify-center space-x-2">
                            <div class="w-[25%]"></div>
                            <p  class="text-red-500 text-sm w-[50%]">SMTP Server is required.</p>

                        </div> 
                        <div class="flex justify-center space-x-2">
                            <label class="block w-[25%] text-md font-medium">SMTP Port <InfoTile class="ml-1"
                                :title="`The port number used to connect to the SMTP server.\nCommon values:\n- 25: Non-secure SMTP\n- 465: Secure SMTP (SSL)\n- 587: Secure SMTP (STARTTLS)`" />
                            </label>
                            <input v-model="emailConfig.smtpPort" type="number" placeholder="587" class="w-[50%] p-2 border rounded-lg" />
                        </div>    
                        <div v-if="formValidationAttempted && !emailConfig.smtpPort" class="flex justify-center space-x-2">
                            <div class="w-[25%]"></div>
                            <p  class="text-red-500 w-[50%] text-sm">SMTP Port is required.</p>

                        </div>                      

                        <div class="flex justify-center space-x-2">
                            <label class="block w-[25%] text-md font-medium">Username <InfoTile class="ml-1"
                                :title="`The login username for authentication with the SMTP server. Usually the same as the sender email address.`" />                            </label>
                            <input v-model="emailConfig.username" type="text" placeholder="your-email@example.com" class="w-[50%] p-2 border rounded-lg" />

                        </div>     
                        <div v-if="formValidationAttempted && !emailConfig.username" class="flex justify-center space-x-2">
                            <div class="w-[25%]"></div>
                            <p  class="text-red-500 text-sm w-[50%]">Username is required.</p>
                        </div>                    

                        <div  class="flex justify-center space-x-2">  
                            <label class="block  w-[25%] text-md font-medium">Password <InfoTile class="ml-1"
                                :title="`The password or app-specific password used for authenticating with the SMTP server.\nNote: Some providers require an app password instead of the regular account password.`" />
                            </label>
                            <input  v-model="emailConfig.password" type="password"  class="w-[50%] p-2 border rounded-lg" />
                        </div>
                        <div v-if="formValidationAttempted && !emailConfig.password" class="flex justify-center space-x-2">
                            <div class="w-[25%]"></div>
                            <p class="text-red-500 text-sm w-[50%]">Password is required.</p>
                        </div>                      

                        <div class="flex justify-center space-x-2 w-[25%]">
                            <input type="checkbox" v-model="emailConfig.tls" class="h-4 w-4" />
                            <label>Enable TLS      <InfoTile class="ml-1"
                                :title="`Enable Transport Layer Security (TLS) encryption for secure email transmission.\nThis is required for most modern SMTP providers using port 587.`" />
                            </label>
                        </div>
                    </div>

                    <!-- OAuth Setup for Google -->
                    <div v-if="emailConfig.authMethod !== 'smtp'" class="space-y-3 text-center">
                        <div class="w-[100%] mt-[1rem]">
                            <p class="text-sm text-gray-500">OAuth setup requires authentication via your email provider.</p>
                        </div>
                        <div class="flex justify-center">
                            <button @click="oAuthBtn" class="w-[30%] bg-[#FF4329] flex hover:bg-[#9E2500] text-white p-2 mb-[1rem] btn">
                                <span class="flex-grow text-center mt-0.5">Connect with Google </span> 
                                <img src="../../../public/img/icons8-gmail-48.png" alt="provider-logo"
                                class="flex items-center justify-center h-6 w-6 bg-white rounded-full ml-2" /></button>
                        </div>
                    </div>
                    <div class="flex justify-center space-x-2 items-start">
                        <label class="block text-md w-[25%] py-2 font-medium">Alert Levels</label>
                        <div class="w-[50%] flex ">
                            <div class="flex items-center space-x-2 mr-4">
                            <input type="checkbox" v-model="emailConfig.send_info" class="h-4 w-4" />
                            <label>Info</label>
                            </div>
                            <div class="flex items-center space-x-2 mr-4">
                            <input type="checkbox" v-model="emailConfig.send_warning" class="h-4 w-4" />
                            <label>Warning</label>
                            </div>
                            <div class="flex items-center space-x-2 mr-4">
                            <input type="checkbox" v-model="emailConfig.send_critical" checked disabled class="h-4 w-4" />
                            <label>Critical</label>
                            </div>
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
import { ref, inject, Ref, computed, watch, onMounted, reactive } from 'vue';
import {Modal, CardContainer, pushNotification, Notification } from '@45drives/houston-common-ui';
import InfoTile from '../common/InfoTile.vue';
import OldModal from '../common/OldModal.vue';
import { WarningConfig } from '../../types';

const activeTab = ref('email-settings')


const warningConfig = reactive<WarningConfig>({
  scrubFinish: 'info',
  vdevCleared: 'info',
  resilverFinish: 'info',
  clearPoolErrors: 'info',
  snapshotCreation: 'info',
  stateChange: 'critical',
});

const warningEvents: Record<keyof WarningConfig, string> = {
  scrubFinish: 'Scrub Finish',
  vdevCleared: 'Vdev Cleared',
  resilverFinish: 'Resilver Finish',
  clearPoolErrors: 'Clear Pool Errors',
  snapshotCreation: 'Snapshot Creation',
  stateChange: 'State Change - Degraded/Faulted',
};
const emailSetUpModal = ref(false);
const emailConfig = ref({
    email: "",
    smtpServer: "",
    smtpPort: 587,
    username: "",
    password: "",
    recieversEmail: "",
    tls: true,
    authMethod: "smtp",
    oauthAccessToken: "",              
    tokenExpiry: "",
    email_enabled: true,    
    send_info: false,
    send_warning: false,
    send_critical: true     
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



async function saveWarningConfig() {
  console.log('Warning levels saved:', warningConfig);
  try {
        console.log("🔄 Updating events warning levels for emails via D-Bus...");

        const cockpit = (window as any).cockpit;
        const dbus = cockpit.dbus("org._45drives.Houston");

        // ✅ Ensure the correct D-Bus method call structure
        const response = await dbus.call(
            "/org/_45drives/Houston",   // ✅ Object path
            "org._45drives.Houston",    // ✅ Interface
            "UpdateWarningLevels",         // ✅ Method name
            [JSON.stringify(warningConfig)]    // ✅ Argument (as an array)
        );
        console.log("warningconfig   " , warningConfig)
        console.log(`✅ D-Bus Response: ${response}`);
        alert("✅ warninglevels config updated successfully!");
        closeModal()

    } catch (error) {
        console.error("❌ Error updating SMTP settings via D-Bus:", error);
        alert("❌ Failed to update SMTP settings: " + error.message);
    }

  // Add your saving logic here
}

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
            tls: emailConfig.value.tls,
            send_info: emailConfig.value.send_info,
            send_warning: emailConfig.value.send_warning,
            send_critical: true,
            email_enabled: true,
            authMethod: emailConfig.value.authMethod    


        };
        console.log("configemail  ", config)
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
    if (!isFormValid() || !isEmailValid) {
        if (!isEmailValid) {
            alert("⚠️ Please enter a valid email address before sending a test email.");
        } else {
            alert("⚠️ Please fill in all fields before sending a test email.");
        }
        return;
    }

    try {
        console.log("🔄 Sending test email via D-Bus...");

        const cockpit = (window as any).cockpit;
        const dbus = cockpit.dbus("org._45drives.Houston");

        const config: any = {
            email: emailConfig.value.email,
            smtpServer: emailConfig.value.smtpServer,
            smtpPort: emailConfig.value.smtpPort,
            username: emailConfig.value.username,
            tls: emailConfig.value.tls,
            recipientEmail: emailConfig.value.recieversEmail
        };

        if (emailConfig.value.authMethod === 'smtp') {
            config.password = emailConfig.value.password;
        } else {
            config.password = accessToken.value || emailConfig.value.oauthAccessToken;
            config.tokenExpiry = tokenExpiry.value;
        }


        console.log("Testing with config: ", config);

        const response = await dbus.call(
            "/org/_45drives/Houston",
            "org._45drives.Houston",
            "SendTestEmail",
            [JSON.stringify(config)]
        );

        console.log(`✅ D-Bus Response: ${response}`);
        alert(response.includes("✅") ? response : `✅ Test email sent: ${response}`);

    } catch (error: any) {
        console.error("❌ Error sending test email via D-Bus:", error);
        alert(`❌ Failed to send test email: ${error.message || error}`);
    }
};

const accessToken = ref<string | null>(null);
const refreshToken = ref<string | null>(null);
const userEmail = ref<string | null>(null);
const tokenExpiry = ref<string | null>(null);
const oAuthenticated = ref(false);

async function oAuthBtn() {
    try {
        const providerAuthUrl = `https://email-auth.45d.io/auth/gmail`;
        const authWindow = window.open(providerAuthUrl, '_blank', 'width=500,height=900');

        if (!authWindow) {
            throw new Error('Failed to open Gmail authentication window. Please check your popup settings.');
        }

        const handleAuthMessage = async (event: MessageEvent) => {
            try {
                if (event.origin !== 'https://email-auth.45d.io') return;

                const { accessToken: tokenValue, refreshToken: refreshValue, expiry, userEmail: emailFromOAuth } = event.data;

                if (tokenValue && refreshValue && emailFromOAuth) {
                    accessToken.value = tokenValue;
                    refreshToken.value = refreshValue;
                    tokenExpiry.value = expiry;
                    userEmail.value = emailFromOAuth;



                    oAuthenticated.value = true;

                    // Prepare emailConfig for DBus call
                    emailConfig.value.email = emailFromOAuth;
                    emailConfig.value.username = emailFromOAuth;
                    emailConfig.value.password = refreshValue; // refresh_token
                    emailConfig.value.recieversEmail = emailFromOAuth;
                    emailConfig.value.smtpServer = "smtp.gmail.com";
                    emailConfig.value.smtpPort = 587;
                    emailConfig.value.tls = true;
                    emailConfig.value.authMethod = "oauth2";
                    emailConfig.value.oauthAccessToken = tokenValue;
                    emailConfig.value.tokenExpiry = expiry;
                    
                    pushNotification(new Notification('Gmail Authentication Successful', `Tokens updated for ${emailFromOAuth}`, 'success', 8000));
                    const cockpit = (window as any).cockpit;
                    const dbus = cockpit.dbus("org._45drives.Houston");

                    // ✅ Call DBus to update SMTP config
                    const configPayload = JSON.stringify(emailConfig.value);
                    const response = await dbus.call(
                        "/org/_45drives/Houston",
                        "org._45drives.Houston",
                        "UpdateSMTPConfig",
                        [configPayload]
                    );

                    console.log('DBus UpdateSMTPConfig response:', response);

                    window.removeEventListener('message', handleAuthMessage);
                } else {
                    throw new Error('Gmail authentication failed. Missing token or email.');
                }
            } catch (error: any) {
                console.error('Error during Gmail authentication:', error);
                oAuthenticated.value = false;
                pushNotification(new Notification('Authentication Failed', `${error.message}`, 'error', 8000));
            }
        };

        window.addEventListener('message', handleAuthMessage);
    } catch (error: any) {
        console.error('Error initializing Gmail OAuth:', error);
        pushNotification(new Notification('Authentication Error', `${error.message}`, 'error', 8000));
    }
}



</script>