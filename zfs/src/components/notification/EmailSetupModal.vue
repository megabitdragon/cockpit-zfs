<template>		
    <OldModal :isOpen="emailSetUpModal" @close="closeModal()" :marginTop="'mt-28'" :width="'w-3/5'" :minWidth="'min-w-3/5'" :closeOnBackgroundClick="false">
        <!-- <OldModal @close="closeModal" :isOpen="showAddVDevModal" :marginTop="props.marginTop" :width="'w-3/5'"
        :minWidth="'min-w-3/5'" :closeOnBackgroundClick="false"> -->
            <template v-slot:title >
                Email Notification Settings
            </template>
            <!-- <template v-slot:content> -->
            <template v-slot:content>
                <div class="flex border-b mb-6">
                    <button
                        @click="activeTab = 'email-settings'"
                        :class="['px-4 py-2', activeTab === 'email-settings' ? 'border-b-2 text-default font-semibold' : 'text-gray-500 hover:text-default']"
                    >
                        Email Settings
                    </button>
                    <button
                        @click="activeTab = 'warning-levels'"
                        :class="['px-4 py-2', activeTab === 'warning-levels' ? 'border-b-2 text-default font-semibold' : 'text-gray-500 hover:text-default']"
                    >
                        Warning Levels
                    </button>
                    </div>
                 <!-- UI for setting up warning levels -->
                    <div v-if="activeTab === 'warning-levels'" class="p-4 space-y-4">
                        <h2 class="text-lg  text-default font-semibold mb-2">Set Warning Levels</h2>
                        
                        <div
                            v-for="([key, label]) in Object.entries(warningEvents)"
                            :key="key"
                            class="flex justify-center space-x-2"
                            >
                            <template v-if="key !== 'stateChange'">
                                <label class="w-[25%] py-2 text-default text-md font-medium">{{ label }}</label>
                                <select v-model="warningConfig[key]" class="w-[50%] p-2 text-default bg-default border rounded-lg">
                                <option value="info">Info</option>
                                <option value="warning">Warning</option>
                                <option value="critical">Critical</option>
                                </select>
                            </template>
                        </div>

                        <!-- Fixed Critical field for State Change -->
                        <div class="flex justify-center space-x-2">
                            <label class="w-[25%] text-default  py-2 text-md font-medium">State Change - Degraded/Faulted</label>
                            <input type="text" value="Critical" disabled class="w-[50%] p-2 text-red bg-default border rounded-lg bg-gray-100 text-red-600 font-semibold " />
                        </div>

                        <div class="flex justify-end space-x-2 mt-4">
                            <button @click="closeModal" class="bg-red-500 text-default p-2 rounded">Cancel</button>
                            <button @click="saveWarningConfig" class="bg-green-500 text-default p-2 rounded">Save</button>
                        </div>
                        </div>
             <!-- UI for setting up emails -->
            <div>
                <div v-if="activeTab === 'email-settings'" class="space-y-4">
                    <div class="flex justify-center space-x-2">
                        <!-- Email Provider Selection -->
                        <label  class="block text-default  text-md w-[25%] py-2 font-medium">Select Email Provider</label>
                        <select v-model="smtpMethod" class="w-[50%] bg-default text-default p-2 border rounded-lg">
                            <option value="smtp">SMTP</option>
                            <option value="oauth2">Google (OAuth)</option>
                        </select>
                    </div>

                    <!-- SMTP Settings -->
                    <div v-if="smtpMethod === 'smtp'" class="space-y-3">
                        
                        <div class="flex justify-center space-x-2">
                            <label class="block w-[25%] text-default  text-md font-medium">Email Address  <InfoTile class="ml-1"
                                :title="`The sender's email address used for sending notifications. This should be a valid email that matches the SMTP provider's domain.`" />                            </label>


                                <!-- Bound input when authDetailsExist is false -->
                                <input
                                v-model="smtpEmailConfig.email"
                                type="email"
                                placeholder="your-email@example.com"
                                class="w-[50%] bg-default text-default p-2 border rounded-lg"
                                />                        
                        </div>
                        <div v-if="formValidationAttempted && (!smtpEmailConfig.email || !isEmailValid)" class="flex justify-center space-x-2">
                            <div class="w-[25%]"></div>
                            <p class="text-red-500 text-sm w-[50%]">
                                {{ !smtpEmailConfig.email ? "Email Address is required." : "Invalid email format." }}
                            </p>
                        </div>
                        <div class="flex justify-center space-x-2 items-start">
                        <label class="block text-md text-default w-[25%] py-2 font-medium">Receivers Email</label>

                        <!-- Wrapping container -->
                        <div class="w-[50%] py-2 flex flex-wrap gap-1 min-h-[48px] px-2">
                            <!-- Chips -->
                            <span
                            v-for="(email, index) in emailChips"
                            :key="index"
                            class="bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center space-x-1"
                            >
                            <span>{{ email }}</span>
                            <button @click="removeEmail(index)" class="text-blue-500 hover:text-red-500 font-bold">&times;</button>
                            </span>

                            <!-- Input -->
                            <input
                            v-model="emailInput"
                            @keydown.enter.prevent="addEmail"
                            @keydown.tab.prevent="addEmail"
                            @keydown.space.prevent="addEmail"
                            @keydown.,.prevent="addEmail"
                            @blur="addEmail"
                            placeholder="Enter email "
                            class="flex-1 min-w-[120px] bg-default text-default p-2 border rounded-lg"
                            type="email"
                            />
                        </div>
                    </div>
                        <div v-if="formValidationAttempted && (!smtpEmailConfig.email || !isEmailValid)" class="flex justify-center space-x-2">
                            <div class="w-[25%]"></div>
                            <p class="text-red-500 text-sm w-[50%]">
                                {{ !smtpEmailConfig.email ? "Email Address is required." : "Invalid email format." }}
                            </p>
                        </div>
                        <div class="flex justify-center space-x-2">
                            <label class="block w-[25%] text-default  text-md font-medium">SMTP Server <InfoTile class="ml-1"
                                :title="`The address of the outgoing mail server. Example: smtp.gmail.com for Gmail, or smtp.office365.com for Outlook.`" />
                            </label>
                            <input v-model="smtpEmailConfig.smtpServer" type="text" placeholder="smtp.example.com" class="w-[50%] bg-default text-default p-2 border rounded-lg" />
                        </div>
                        <div v-if="formValidationAttempted && !smtpEmailConfig.smtpServer" class="flex justify-center space-x-2">
                            <div class="w-[25%]"></div>
                            <p  class="text-red-500 text-sm w-[50%]">SMTP Server is required.</p>

                        </div> 
                        <div class="flex justify-center space-x-2">
                            <label class="block w-[25%] text-default  text-md font-medium">SMTP Port <InfoTile class="ml-1"
                                :title="`The port number used to connect to the SMTP server.\nCommon values:\n- 25: Non-secure SMTP\n- 465: Secure SMTP (SSL)\n- 587: Secure SMTP (STARTTLS)`" />
                            </label>
                            <input v-model="smtpEmailConfig.smtpPort" type="number" placeholder="587" class="w-[50%] bg-default text-default p-2 border rounded-lg" />
                        </div>    
                        <div v-if="formValidationAttempted && !smtpEmailConfig.smtpPort" class="flex justify-center space-x-2">
                            <div class="w-[25%]"></div>
                            <p  class="text-red-500 w-[50%] text-sm">SMTP Port is required.</p>

                        </div>                      

                        <div class="flex justify-center space-x-2">
                            <label class="block w-[25%] text-default  text-md font-medium">Username <InfoTile class="ml-1"
                                :title="`The login username for authentication with the SMTP server. Usually the same as the sender email address.`" />                            </label>
                            <input v-model="smtpEmailConfig.username" type="text" placeholder="your-email@example.com" class="w-[50%] bg-default text-default p-2 border rounded-lg" />

                        </div>     
                        <div v-if="formValidationAttempted && !smtpEmailConfig.username" class="flex justify-center space-x-2">
                            <div class="w-[25%]"></div>
                            <p  class="text-red-500 text-sm w-[50%]">Username is required.</p>
                        </div>                    

                        <div  class="flex justify-center space-x-2">  
                            <label class="block  w-[25%] text-default  text-md font-medium">Password <InfoTile class="ml-1"
                                :title="`The password or app-specific password used for authenticating with the SMTP server.\nNote: Some providers require an app password instead of the regular account password.`" />
                            </label>
                            <input  v-model="smtpEmailConfig.password" type="password"  class="w-[50%] bg-default text-default p-2 border rounded-lg" />
                        </div>
                        <div v-if="formValidationAttempted && !smtpEmailConfig.password" class="flex justify-center space-x-2">
                            <div class="w-[25%]"></div>
                            <p class="text-red-500 text-sm w-[50%]">Password is required.</p>
                        </div>                      

                        <div class="flex justify-center space-x-2">
                            <label class="text-default w-[25%]">Enable TLS      <InfoTile class="ml-1"
                                :title="`Enable Transport Layer Security (TLS) encryption for secure email transmission.\nThis is required for most modern SMTP providers using port 587.`" />
                            </label>
                            <div class="w-[50%]">
                                <input type="checkbox" v-model="smtpEmailConfig.tls" class="h-4 w-4" />
                            </div>
                        </div>
                    </div>

                    <!-- OAuth Setup for Google -->
                    <div v-if="smtpMethod !== 'smtp'" class="space-y-3 text-center">
                        <div class="w-[100%] mt-[1rem]">
                            <p class="text-sm text-default">OAuth setup requires authentication via your email provider.</p>
                        </div>
                        <div  class="flex justify-center">
                            <button class="w-[30%] bg-green-600 flex  text-default p-2 mb-[1rem] btn pointer-events-none" v-if="authDetailsExist==true && authEmailConfig.email" >
                                <span class="flex-grow text-center mt-0.5">Connected as {{ authEmailConfig.email }}</span>
                            </button>
                            <button v-if="authDetailsExist==true "  @click="oAuthBtn" class="w-[30%] ml-[1rem] bg-[#FF4329] flex hover:bg-[#9E2500] text-default p-2 mb-[1rem] btn">
                                <span  class="flex-grow text-center mt-0.5">Reconnect with Google with different account </span>
                                <div class="flex items-center justify-center h-6 w-6 bg-white rounded-full ml-2">
                                    <img src="../../../public/img/icons8-gmail-48.png" alt="provider-logo"
                                    class="inline-block w-4 h-4" />
                                </div>
                            </button>
                                <button v-else="authDetailsExist==false" @click="oAuthBtn" class="w-[30%] bg-[#FF4329] flex hover:bg-[#9E2500] text-default p-2 mb-[1rem] btn">
                                <span class="flex-grow text-center mt-0.5">Connect with Google </span>
                                <img src="../../../public/img/icons8-gmail-48.png" alt="provider-logo"
                                class="flex items-center justify-center h-6 w-6 bg-white rounded-full ml-2" /></button>
                        </div>
                        <div class="flex justify-center" style="margin-top: 0;">
                        <div class="space-x-4">
                            <a
                                :href="privacyPolicyUrl"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="underline text-blue-500 hover:text-blue-700 transition-colors duration-200"
                            >
                                Privacy Policy
                            </a>
                            <a
                                :href="termsOfServiceUrl"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="underline text-blue-500 hover:text-blue-700 transition-colors duration-200"
                            >
                                Terms of Service
                            </a>
                        </div>
                    </div>


                    </div>
                    <div class="flex justify-center space-x-2 items-start">
                        <label class="block text-md text-default w-[25%] py-2 font-medium">Receivers Email</label>

                        <!-- Wrapping container -->
                        <div class="w-[50%] py-2  flex flex-wrap gap-1 min-h-[48px] px-2">
                            <!-- Chips -->
                            <span
                            v-for="(email, index) in emailChips"
                            :key="index"
                            class="bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center space-x-1"
                            >
                            <span>{{ email }}</span>
                            <button @click="removeEmail(index)" class="text-blue-500 hover:text-red-500 font-bold">&times;</button>
                            </span>

                            <!-- Input -->
                            <input
                            v-model="emailInput"
                            @keydown.enter.prevent="addEmail"
                            @keydown.tab.prevent="addEmail"
                            @keydown.space.prevent="addEmail"
                            @keydown.,.prevent="addEmail"
                            @blur="addEmail"
                            placeholder="Enter email and press Enter"
                            class="flex-1 min-w-[120px] bg-default text-default p-2 border rounded-lg"
                            type="email"
                            />
                        </div>
                    </div>

                    <div class="flex justify-center space-x-2 items-start">
                        <label class="block text-md text-default  w-[25%] py-2 font-medium">Alert Levels</label>
                        <div class="w-[50%] flex py-2 ">
                            <div class="flex text-default  items-center space-x-2 mr-4">
                            <input type="checkbox" v-model="send_info" class="h-4 w-4" />
                            <label>Info</label>
                            </div>
                            <div class="flex text-default  items-center space-x-2 mr-4">
                            <input type="checkbox" v-model="send_warning" class="h-4 w-4" />
                            <label>Warning</label>
                            </div>
                            <div class="flex text-default  items-center space-x-2 mr-4">
                            <input type="checkbox" v-model="send_critical" checked disabled class="h-4 w-4" />
                            <label>Critical</label>
                            </div>
                        </div>
                    </div>
                    <!-- Test Email & Save -->
                    <div class="flex justify-between mt-4" style="margin-top: 5rem;">
                        <div>
                        <button @click="testEmail" class=" bg-blue-500 hover:bg-blue-600 text-default p-2 rounded">Send Test Email</button>
                        <button :disabled="!authEmailConfig.email && !smtpEmailConfig.email" @click="resetMsmtpData" class="bg-gray-500 hover:bg-gray-600 ml-2 text-default p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed">
                             Reset Data</button>                    
                    </div>
                        <div class="space-x-2">
                            <button @click="closeModal" class="bg-red-500 text-default p-2 rounded">Cancel</button>
                            <button @click="updateSMTPConfig" class="bg-green-500 text-default p-2 rounded">Save</button>
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
import { ref, computed, watch, onMounted, reactive } from 'vue';
import {pushNotification, Notification } from '@45drives/houston-common-ui';
import InfoTile from '../common/InfoTile.vue';
import OldModal from '../common/OldModal.vue';
import { WarningConfig } from '../../types';
import { RefSymbol } from '@vue/reactivity';

const activeTab = ref('email-settings')
const authDetailsExist = ref(false)
const smtpMethod = ref("oauth2")
const send_info = ref(false)
const send_warning = ref(false)
const send_critical = true
const emailInput = ref('')
const emailChips = ref([])

const warningConfig = reactive<WarningConfig>({
  scrubFinish: 'info',
  vdevCleared: 'info',
  resilverFinish: 'info',
  clearPoolErrors: 'info',
  snapshotCreation: 'info',
  stateChange: 'critical',
  poolImport: 'info',
  replicationTask: 'info',
  storageThreshold: 'warning'
});

const warningEvents: Record<keyof WarningConfig, string> = {
  scrubFinish: 'Scrub Finish',
  vdevCleared: 'Vdev Cleared',
  resilverFinish: 'Resilver Finish',
  clearPoolErrors: 'Clear Pool Errors',
  snapshotCreation: 'Snapshot Creation',
  stateChange: 'State Change - Degraded/Faulted',
  poolImport: 'Pool Import',
  storageThreshold: 'Storage Threshold',
  replicationTask: 'Replication Task'


};
const emailSetUpModal = ref(false);

const authEmailConfig = ref({
    email: "",
    recieversEmail: [],
    authMethod: "oauth2",
    oauthAccessToken: "",              
    tokenExpiry: "",
    oauthRefreshToken: ""
  
});
const smtpEmailConfig = ref({
    email: "",
    smtpServer: "",
    smtpPort: 587,
    username: "",
    password: "",
    recieversEmail: [],
    tls: true,
    authMethod: "smtp",
    oauthAccessToken: "",              
    tokenExpiry: "",
    send_info: false,
    send_warning: false,
    send_critical: true     
});
const isEmailValid = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (smtpMethod.value === "smtp") {
        return (
            emailRegex.test(smtpEmailConfig.value.email) &&
            Array.isArray(smtpEmailConfig.value.recieversEmail) &&      
                smtpEmailConfig.value.recieversEmail.length > 0 &&
                smtpEmailConfig.value.recieversEmail.every(email => emailRegex.test(email)) 
        );
    } else {
        console.log("authEmailConfig.value.email ", authEmailConfig.value.email, "authEmailConfig.value.recieversEmail ", authEmailConfig.value.recieversEmail)

        return (
            emailRegex.test(authEmailConfig.value.email) &&
            Array.isArray(authEmailConfig.value.recieversEmail) &&
                authEmailConfig.value.recieversEmail.length > 0 &&
                authEmailConfig.value.recieversEmail.every(email => emailRegex.test(email))        );
    }
});


const privacyPolicyUrl = ref('https://email-auth.45d.io/privacy');
const termsOfServiceUrl = ref('https://email-auth.45d.io/tos');

const formValidationAttempted = ref(false); // Tracks if validation has been triggered

const isFormValid = () => {
    formValidationAttempted.value = true; // Mark validation as triggered
    if (smtpMethod.value=="smtp"){
        return (
        smtpEmailConfig.value.email.trim() !== "" &&
        smtpEmailConfig.value.recieversEmail.trim() !== "" &&
        smtpEmailConfig.value.smtpServer.trim() !== "" &&
        smtpEmailConfig.value.smtpPort > 0 &&
        smtpEmailConfig.value.username.trim() !== "" &&
        smtpEmailConfig.value.password.trim() !== ""
        );
    }else{
        return(
            authEmailConfig.value.email.trim() !== "" &&
            authEmailConfig.value.recieversEmail.trim() !== ""
        )
    }

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
        //console.log("warningconfig   " , warningConfig)
        //console.log(`✅ D-Bus Response: ${response}`);
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
        
        console.log("smtpData.auth", smtpData)
        if(smtpData.authMethod=="on"){
            smtpMethod.value = "smtp"
            smtpEmailConfig.value.email = smtpData.email;
            smtpEmailConfig.value.smtpServer = smtpData.smtpServer;
            smtpEmailConfig.value.smtpPort = smtpData.smtpPort;
            smtpEmailConfig.value.username = smtpData.username;
            smtpEmailConfig.value.password = smtpData.password;
            smtpEmailConfig.value.tls = smtpData.tls;
            smtpEmailConfig.value.authMethod = smtpData.auth;
            // Handle multi-recipient emails
            emailChips.value = Array.isArray(smtpData.recieversEmail)
                ? smtpData.recieversEmail
                : smtpData.recieversEmail.split(",").map(e => e.trim()).filter(Boolean);
        }else if(smtpData.authMethod!="on" || smtpData.authMethod!="") {
            smtpMethod.value = "oauth2"

            authEmailConfig.value.email = smtpData.email;
            authEmailConfig.value.authMethod = smtpData.auth
            authEmailConfig.value.authMethod = "oauth2"
            authDetailsExist.value = true;
            console.log("smtpData Recived" , smtpData)

            // Handle multi-recipient emails
            emailChips.value = Array.isArray(smtpData.recieversEmail)
                ? smtpData.recieversEmail
                : smtpData.recieversEmail.split(",").map(e => e.trim()).filter(Boolean);

            }
        // ✅ Populate Vue state with fetched values
        console.log("✅ SMTP details fetched successfully:", smtpData);
    } catch (error) {
        console.log("response ")

        console.error("❌ Error fetching SMTP details:", error);
        alert("❌ Failed to fetch SMTP details.");
    }
};

const updateSMTPConfig = async () => {
  if (!isFormValid() || !isEmailValid.value) {
    if (!isEmailValid.value) {
      alert("⚠️ Please fill valid email address before sending a test email.");
    } else {
      alert("⚠️ Please fill in all fields before sending a test email.");
    }
    return; // ⬅️ Don't continue if the form isn't valid
  }

  try {
    console.log("🔄 Updating SMTP Config via D-Bus...");

    const cockpit = (window as any).cockpit;
    const dbus = cockpit.dbus("org._45drives.Houston");

    let config;


    if (smtpMethod.value === "smtp") {
      config = {
        email: smtpEmailConfig.value.email,
        smtpServer: smtpEmailConfig.value.smtpServer,
        smtpPort: smtpEmailConfig.value.smtpPort,
        username: smtpEmailConfig.value.username,
        password: smtpEmailConfig.value.password,
        recieversEmail: smtpEmailConfig.value.recieversEmail.join(","), 
        tls: smtpEmailConfig.value.tls,
        send_info: send_info.value,
        send_warning: send_warning.value,
        send_critical: true,
        authMethod: smtpMethod.value,
      };
    } else {
      config = {
        email: authEmailConfig.value.email,
        send_info: send_info.value,
        send_warning: send_warning.value,
        recieversEmail: authEmailConfig.value.recieversEmail.join(","), 
        send_critical: true,
        authMethod: "oauth2",
        oauthAccessToken: authEmailConfig.value.oauthAccessToken,
        oauthRefreshToken: authEmailConfig.value.oauthRefreshToken
    
      };
    }

    console.log("Config to send:", config);

    const response = await dbus.call(
      "/org/_45drives/Houston",
      "org._45drives.Houston",
      "UpdateSMTPConfig",
      [JSON.stringify(config)]
    );

    console.log(`✅ D-Bus Response: ${response}`);
    alert("✅ SMTP Configuration updated successfully!");
    closeModal();
  } catch (error: any) {
    console.error("❌ Error updating SMTP settings via D-Bus:", error);
    alert("❌ Failed to update SMTP settings: " + (error.message || error));
  }
};



const testEmail = async () => {
    if (!isFormValid() || !isEmailValid.value) {
        if (!isEmailValid.value) {
            alert("⚠️ Please enter a valid email address before sending a test email.");
        } 
        if (smtpMethod.value === "smtp") {
            alert("⚠️ Please fill in all fields before sending a test email.");
        } else {
            console.log("isEmailValid:", isEmailValid.value, "isFormValid:", isFormValid());
            alert("⚠️ Please sign in with Gmail.");
        }
        return;
    }

    try {
        console.log("🔄 Sending test email via D-Bus...");

        const cockpit = (window as any).cockpit;
        const dbus = cockpit.dbus("org._45drives.Houston");

        let config;

        if (smtpMethod.value === "smtp") {
            config = {
                email: smtpEmailConfig.value.email,
                smtpServer: smtpEmailConfig.value.smtpServer,
                smtpPort: smtpEmailConfig.value.smtpPort,
                username: smtpEmailConfig.value.username,
                password: smtpEmailConfig.value.password,
                tls: smtpEmailConfig.value.tls,
                recieversEmail: Array.isArray(smtpEmailConfig.value.recieversEmail)
                    ? smtpEmailConfig.value.recieversEmail.join(",")
                    : smtpEmailConfig.value.recieversEmail,
                authMethod: "plain"
            };
        } else {
            config = {
                email: authEmailConfig.value.email,
                password: accessToken.value || authEmailConfig.value.oauthAccessToken,
                tokenExpiry: tokenExpiry.value || authEmailConfig.value.tokenExpiry,
                authMethod: "oauth2",
                recieversEmail: Array.isArray(authEmailConfig.value.recieversEmail)
                    ? authEmailConfig.value.recieversEmail.join(",")
                    : authEmailConfig.value.recieversEmail
            };
        }

        console.log("Testing with config:", config);

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
                    authEmailConfig.value.email = emailFromOAuth;
                    authEmailConfig.value.oauthRefreshToken = refreshValue; // refresh_token
                    authEmailConfig.value.recieversEmail = emailFromOAuth;
                    authEmailConfig.value.authMethod = "oauth2";
                    authEmailConfig.value.oauthAccessToken = tokenValue;
                    authEmailConfig.value.tokenExpiry = expiry;
                    
                    pushNotification(new Notification('Gmail Authentication Successful', `Tokens updated for ${emailFromOAuth}`, 'success', 8000));
                    const cockpit = (window as any).cockpit;
                    const dbus = cockpit.dbus("org._45drives.Houston");

                    // ✅ Call DBus to update SMTP config
                    const configPayload = JSON.stringify(authEmailConfig.value);
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

const resetMsmtpData = async () => {
    const cockpit = (window as any).cockpit;
        const dbus = cockpit.dbus("org._45drives.Houston");

        const response = await dbus.call(
            "/org/_45drives/Houston",
            "org._45drives.Houston",
            "resetMsmtpData",
        );

        if(smtpMethod.value=="smtp"){
            smtpEmailConfig.value.email = "",
            smtpEmailConfig.value.smtpServer = "",
            smtpEmailConfig.value.smtpPort = 587,
            smtpEmailConfig.value.username = "",
            smtpEmailConfig.value.recieversEmail = [],
            smtpEmailConfig.value.password = ""

        }else{
            authEmailConfig.value.email = "",
            authEmailConfig.value.recieversEmail = [],
            accessToken.value = "" 
            authEmailConfig.value.oauthAccessToken = "",
            tokenExpiry.value = ""
        }
        console.log(`✅ D-Bus Response: ${response}`);
        alert(response.includes("✅") ? response : `✅ Test email sent: ${response}`);
};
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const addEmail = () => {
  const trimmed = emailInput.value.trim().replace(/,$/, "");

  if (!trimmed || !emailRegex.test(trimmed)) {
    emailInput.value = "";
    return;
  }

  if (!emailChips.value.includes(trimmed)) {
    emailChips.value.push(trimmed);
  }

  emailInput.value = ""; // Clear input
};


const removeEmail = (index) => {
  emailChips.value.splice(index, 1)
}

watch(emailChips, (newList) => {
  if (smtpMethod.value === "smtp") {
    smtpEmailConfig.value.recieversEmail = [...newList];
  } else {
    authEmailConfig.value.recieversEmail = [...newList];
  }
});



</script>