<template>
	<div>
		<div v-if="poolConfig.createFileSystem">
			<!-- Name of File System (Text) -->
			<div>
				<label :for="getIdKey('filesystem-name')" class="mt-1 block text-sm font-medium text-default">Name</label>
				<input :id="getIdKey('filesystem-name')" type="name" name="pool-name" v-model="fileSystemConfig.name" class="mt-1 block w-full rounded-md border-0 py-1.5 px-1.5 text-default shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-muted focus:ring-2 focus:ring-inset focus:ring-slate-300 sm:text-sm sm:leading-6" placeholder="File System Name" />
				<p class="text-danger" v-if="nameFeedback">{{ nameFeedback }}</p>
			</div>

			<!-- Encryption (Toggle) -> Reveals extra fields-->
			<div>
				<label :for="getIdKey('encryption')" class="mt-1 block text-sm font-medium leading-6 text-default">Encryption</label>
				<Switch :id="getIdKey('encryption')" v-model="fileSystemConfig.isEncrypted" :class="[fileSystemConfig.encrypted ? 'bg-primary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
					<span class="sr-only">Use setting</span>
					<span :class="[fileSystemConfig.encrypted ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
						<span :class="[fileSystemConfig.encrypted ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
							<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
								<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						</span>
						<span :class="[fileSystemConfig.encrypted ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
							<svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
								<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
							</svg>
						</span>
					</span>
				</Switch>
			</div>

			<div v-if="fileSystemConfig.encrypted">
				<!-- Passphrase (Text) -->
					<div>
						<label :for="getIdKey('passphrase')" class="mt-1 block text-sm font-medium leading-6 text-default">Passphrase</label>
						<input :id="getIdKey('passphrase')" type="password" v-model="fileSystemConfig.passphrase" name="passphrase" class="input-textlike bg-default mt-1 block w-full rounded-md border-0 py-1.5 px-1.5 text-default shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-muted focus:ring-2 focus:ring-inset focus:ring-slate-300 sm:text-sm sm:leading-6" placeholder="Passphrase" />
					</div>
				<!-- Confirm Passphrase (Text) -->
				<div>
					<label :for="getIdKey('passphrase-confirm')" class="mt-1 block text-sm font-medium leading-6 text-default">Confirm Passphrase</label>
					<input :id="getIdKey('passphrase-confirm')" type="password" name="passphrase-confirm" class="input-textlike bg-default mt-1 block w-full rounded-md border-0 py-1.5 px-1.5 text-default shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-muted focus:ring-2 focus:ring-inset focus:ring-slate-300 sm:text-sm sm:leading-6" placeholder="Confirm Passphrase" />
				</div>
				<!-- Cipher (Select) -->
				<div>
					<label :for="getIdKey('cipher')" class="block text-sm font-medium leading-6 text-default">Cipher</label>
					<select :id="getIdKey('cipher')" name="cipher" v-model="fileSystemConfig.cipher" class="bg-default mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-default ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
						<option value="aes-128-ccm">AES-128-CCM</option>
						<option value="aes-192-ccm">AES-192-CCM</option>
						<option value="aes-256-ccm">AES-256-CCM</option>
						<option value="aes-128-gcm">AES-128-GCM</option>
						<option value="aes-192-gcm">AES-192-GCM</option>
						<option selected value="aes-256-gcm">AES-256-GCM</option>
					</select>
				</div>
			</div>

			<!-- Inherit Pool Settings (Toggle) -> On by Default, if Off then reveals all fields to set -->
			<div>
				<label :for="getIdKey('inherit')" class="mt-1 block text-sm font-medium leading-6 text-default">Inherit Pool Settings</label>
				<Switch :id="getIdKey('inherit')" v-model="fileSystemConfig.inherit" :class="[fileSystemConfig.inherit ? 'bg-primary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
					<span class="sr-only">Use setting</span>
					<span :class="[fileSystemConfig.inherit ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
						<span :class="[fileSystemConfig.inherit ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
							<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
								<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						</span>
						<span :class="[fileSystemConfig.inherit ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
							<svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
								<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
							</svg>
						</span>
					</span>
				</Switch>
			</div>
			
			<div v-if="!fileSystemConfig.inherit">
				<!-- Access Time (Select) -->
				<div>
					<label :for="getIdKey('fs-access-time')" class="block text-sm font-medium leading-6 text-default">Access Time</label>
					<select v-model="fileSystemConfig.properties.accessTime" :id="getIdKey('fs-access-time')" name="fs-access-time" class="bg-default mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-default ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
						<option selected value="inherited">Inherited (-)</option>
						<option value="on">On</option>
						<option value="off">Off</option>
					</select>
				</div>
				<!-- Case Sensitivity (Select) -->
				<div>
					<label :for="getIdKey('fs-case-sensitivity')" class="block text-sm font-medium leading-6 text-default">Case Sensitivity</label>
					<select v-model="fileSystemConfig.properties.caseSensitivity" :id="getIdKey('fs-case-sensitivity')" name="fs-case-sensitivity" class="bg-default mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-default ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
						<option selected value="inherited">Inherited (-)</option>
						<option value="insensitive">Insensitive</option>
						<option value="mixed">Mixed</option>
						<option value="sensitive">Sensitive</option>
					</select>
				</div>
				<!-- Compression (Select) -->
				<div>
					<label :for="getIdKey('fs-compression')" class="block text-sm font-medium leading-6 text-default">Compression</label>
					<select v-model="fileSystemConfig.properties.compression" :id="getIdKey('fs-compression')" name="fs-compression" class="bg-default mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-default ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
						<option selected value="inherited">Inherited (-)</option>
						<option value="on">On</option>
						<option value="off">Off</option>
						<option value="gzip">GZIP</option>
						<option value="lz4">LZ4</option>
						<option value="lzjb">LZJB</option>
						<option value="zle">ZLE</option>
					</select>
				</div>
				<!-- Deduplication (Select) -->
				<div>
					<label :for="getIdKey('fs-deduplication')" class="block text-sm font-medium leading-6 text-default">Deduplication</label>
					<select v-model="fileSystemConfig.properties.deduplication" :id="getIdKey('fs-deduplication')" name="fs-deduplication" class="bg-default mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-default ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
						<option selected value="inherited">Inherited (-)</option>
					 <option value="on">On</option>
					 <option value="off">Off</option>
					 <option value="edon-r + verify">Edon-R + Verify</option>
					 <option value="sha-256">SHA-256</option>
					 <option value="sha-256 + verify">SHA-256 + Verify</option>
					 <option value="sha-512">SHA-512</option>
					 <option value="sha-512 + verify">SHA-512 + Verify</option>
					 <option value="skein">Skein</option>
					 <option value="skein + verify">Skein + Verify</option>
					 <option value="verify">Verify</option>
					</select>
				</div>
				<!-- DNode Size (Select) -->
				<div>
					<label :for="getIdKey('fs-dnode-size')" class="block text-sm font-medium leading-6 text-default">DNode Size</label>
					<select v-model="fileSystemConfig.properties.dNodeSize" :id="getIdKey('fs-dnode-size')" name="fs-dnode-size" class="bg-default mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-default ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
						<option selected value="inherited">Inherited (-)</option>
						<option value="1 kib">1 KiB</option>
						<option value="2 kibi">2 KiB</option>
						<option value="4 kib">4 KiB</option>
						<option value="8 kib">8 KiB</option>
						<option value="16 kib">16 KiB</option>
						<option value="auto">Auto</option>
						<option value="legacy">Legacy</option>
					</select>
				</div>
				<!-- Extended Attributes (Select) -->
				<div>
					<label :for="getIdKey('fs-extended-attributes')" class="block text-sm font-medium leading-6 text-default">Extended Attributes</label>
					<select v-model="fileSystemConfig.properties.extendedAttributes" :id="getIdKey('fs-extended-attributes')" name="fs-extended-attributes" class="bg-default mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-default ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
						<option selected value="inherited">Inherited (-)</option>
						<option value="on">On</option>
						<option value="off">Off</option>
						<option value="system attribute">System Attribute</option>
					</select>
				</div>
				<!-- Record Size (Select) -->
				<div>
					<label :for="getIdKey('fs-record-size')" class="block text-sm font-medium leading-6 text-default">Record Size</label>
					<select v-model="fileSystemConfig.properties.recordSize" :id="getIdKey('fs-record-size')" name="fs-record-size" class="bg-default mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-default ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
						<option selected value="inherited">Inherited (-)</option>
						<option value="512 b">512 B</option>
						<option value="4 kib">4 KiB</option>
						<option value="8 kib">8 KiB</option>
						<option value="16 kib">16 KiB</option>
						<option value="32 kib">32 KiB</option>
						<option value="64 kib">64 KiB</option>
						<option value="256 kib">256 KiB</option>
						<option value="512 kib">512 KiB</option>
						<option value="1 mib">1 MiB</option>
					</select>
				</div>
			</div>

			<div>
				<!-- Quota (Slider + Select) -->
				<!-- <div>
					<label :for="getIdKey('fs-quota')" class="mb-1 block text-sm font-medium leading-6 text-default">Quota</label>
					<div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
						<input v-model="fileSystemConfig.properties.quota.amount" :id="getIdKey('fs-quota-amount')" type="range" min="0" max="1000" value="0" step="1" class="block sm:col-span-4 h-2 bg-accent rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/>
						<input v-model="fileSystemConfig.properties.quota.amount" type="number" name="fs-quota-num" :id="getIdKey('fs-quota-amount')" value="0" class="block sm:col-span-1 rounded-md border-0 py-1.5 px-1.5 text-default shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-muted focus:ring-2 focus:ring-inset focus:ring-slate-300 sm:text-sm sm:leading-6"/>          
						<select v-model="fileSystemConfig.properties.quota.size" :id="getIdKey('fs-quota-size')" name="fs-quota-slider" class="block sm:col-span-1 rounded-md border-0 py-1.5 pl-3 pr-10 text-default ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-slate-600 sm:text-sm sm:leading-6">
							<option selected value="kib">KiB</option>
							<option value="mib">MiB</option>
							<option value="gib">GiB</option>
						</select>
					</div>
				</div> -->

				<!-- Read Only (Toggle) -->
				<!-- <div>
					<label :for="getIdKey('fs-read-only')" class="mt-1 block text-sm font-medium leading-6 text-default">Read Only</label>
					<Switch v-model="fileSystemConfig.properties.readOnly" :class="[fileSystemConfig.properties.readOnly ? 'bg-primary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
						<span class="sr-only">Use setting</span>
						<span :class="[fileSystemConfig.properties.readOnly ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
							<span :class="[fileSystemConfig.properties.readOnly ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
								<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
									<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							</span>
							<span :class="[fileSystemConfig.properties.readOnly ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
								<svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
									<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
								</svg>
							</span>
						</span>
					</Switch>
				</div> -->

			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, Ref, inject } from 'vue';
import { Switch } from '@headlessui/vue';

interface FileSystemProps {
	idKey: string;
}

const props = defineProps<FileSystemProps>();

const poolConfig = inject<PoolData>("pool-config-data")!;
const nameFeedback = ref('');
const fileSystemConfig = inject<Ref<FileSystemData>>('file-system-data')!;

const nameCheck = () => {
	let result = true;
	nameFeedback.value = '';
	
	if (fileSystemConfig.value.name == '') {
		result = false;
		nameFeedback.value = 'Name cannot be empty.';
	} else if (fileSystemConfig.value.name.match(/^[0-9]/) ) {
		result = false;
		nameFeedback.value = 'Name cannot begin with numbers.';
	} else if (fileSystemConfig.value.name.match(/^[.]/ )) {
		result = false;
		nameFeedback.value = 'Name cannot begin with a period (.).';
	} else if (fileSystemConfig.value.name.match(/^[_]/)) {
		result = false;
		nameFeedback.value = 'Name cannot begin with an underscore (_).';
	} else if (fileSystemConfig.value.name.match(/^[-]/)) {
		result = false;
		nameFeedback.value = 'Name cannot begin with a hyphen (-).';
	} else if (fileSystemConfig.value.name.match(/^[:]/)) {
		result = false;
		nameFeedback.value = 'Name cannot begin with a colon (:).';
	} else if (fileSystemConfig.value.name.match(/^[ ]/)) {
		result = false;
		nameFeedback.value = 'Name cannot begin with whitespace.';
	} else if (fileSystemConfig.value.name.match(/[ ]$/)) {
		result = false;
		nameFeedback.value = 'Name cannot end with whitespace.';
	} else if (fileSystemConfig.value.name.match(/^c[0-9]|^log|^mirror|^raidz|^raidz1|^raidz2|^raidz3|^spare/)) {
		result = false;
		nameFeedback.value = 'Name cannot begin with a reserved name.';
	} else if (!fileSystemConfig.value.name.match(/^[a-zA-Z0-9_.:-]*$/)) {
		result = false;
		nameFeedback.value = 'Name contains invalid characters.';
	} 
	return result;
}

const getIdKey = (name: string) => `${props.idKey}-${name}`;

defineExpose({
	//nameCheck,
})
</script>