<template>
	<!-- POOL CONFIG FILE SYSTEM CREATION -->
	<div v-if="isStandalone == false">
		<div v-if="poolConfig.createFileSystem">
			<!-- Name of Parent File System (Text) -->
			<div>
				<label :for="getIdKey('parent-filesystem')" class="block text-sm font-medium leading-6 text-default">Parent File System</label>
				<select :id="getIdKey('parent-filesystem')" v-model="fileSystemConfig.parentFS" disabled name="parent-filesystem" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default placeholder:text-muted sm:text-sm sm:leading-6">
					<option :value="poolConfig.name!" class=text-default>{{ poolConfig.name! }}</option>
				</select>
			</div>

			<!-- Name of File System (Text) -->
			<div>
				<label :for="getIdKey('filesystem-name')" class="mt-1 block text-sm font-medium leading-6 text-default">Name</label>
				<input :id="getIdKey('filesystem-name')" type="name" name="pool-name" v-model="fileSystemConfig.name" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default placeholder:text-muted sm:text-sm sm:leading-6" placeholder="File System Name" />
				<p class="text-danger" v-if="nameFeedback">{{ nameFeedback }}</p>
			</div>

			<!-- Encryption (Toggle) -> Reveals extra fields-->
			<div>
				<label :for="getIdKey('encryption')" class="mt-1 block text-sm font-medium leading-6 text-default">Encryption</label>
				<Switch :id="getIdKey('encryption')" v-model="fileSystemConfig.encrypted" :class="[fileSystemConfig.encrypted ? 'bg-primary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
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
					<input :id="getIdKey('passphrase')" type="password" v-model="passphrase" name="passphrase" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default placeholder:text-muted sm:text-sm sm:leading-6" placeholder="Passphrase" />
				</div>
				<!-- Confirm Passphrase (Text) -->
				<div>
					<label :for="getIdKey('passphrase-confirm')" class="mt-1 block text-sm font-medium leading-6 text-default">Confirm Passphrase</label>
					<input :id="getIdKey('passphrase-confirm')" type="password" name="passphrase-confirm" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default placeholder:text-muted sm:text-sm sm:leading-6" placeholder="Confirm Passphrase" />
				</div>
				<!-- Cipher (Select) -->
				<div>
					<label :for="getIdKey('cipher')" class="block text-sm font-medium leading-6 text-default">Cipher</label>
					<select :id="getIdKey('cipher')" name="cipher" v-model="fileSystemConfig.properties.encryption" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default placeholder:text-muted sm:text-sm sm:leading-6">
						<option value="aes-128-ccm">AES-128-CCM</option>
						<option value="aes-192-ccm">AES-192-CCM</option>
						<option value="aes-256-ccm">AES-256-CCM</option>
						<option value="aes-128-gcm">AES-128-GCM</option>
						<option value="aes-192-gcm">AES-192-GCM</option>
						<option value="aes-256-gcm">AES-256-GCM</option>
					</select>
				</div>
			</div>

			<!-- Inherit Pool Settings (Toggle) -> On by Default, if Off then reveals all fields to set -->
			<div>
				<label :for="getIdKey('inherit')" class="mt-1 block text-sm font-medium leading-6 text-default">Inherit Parent/Default Settings</label>
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
			
				<!-- Compression (Select) -->
				<div>
					<label :for="getIdKey('fs-compression')" class="block text-sm font-medium leading-6 text-default">Compression</label>
					<select v-model="fileSystemConfig.properties.compression" :id="getIdKey('fs-compression')" name="fs-compression" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default placeholder:text-muted sm:text-sm sm:leading-6">
						<option value="inherited">Inherited ({{isBoolCompression(poolConfig.properties.compression)}})</option>
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
					<select v-model="fileSystemConfig.properties.deduplication" :id="getIdKey('fs-deduplication')" name="fs-deduplication" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default placeholder:text-muted sm:text-sm sm:leading-6">
						<option value="inherited">Inherited ({{isBoolOnOff(poolConfig.properties.deduplication)}})</option>
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
				<!-- Record Size (Select) -->
				<div>
					<label :for="getIdKey('fs-record-size')" class="block text-sm font-medium leading-6 text-default">Record Size</label>
					<select v-model="fileSystemConfig.properties.recordSize" :id="getIdKey('fs-record-size')" name="fs-record-size" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default placeholder:text-muted sm:text-sm sm:leading-6">
						<option value="inherited">Inherited ({{ poolConfig.properties.record }})</option>
						<option value="512b">512 B</option>
						<option value="4kib">4 KiB</option>
						<option value="8kib">8 KiB</option>
						<option value="16kib">16 KiB</option>
						<option value="32kib">32 KiB</option>
						<option value="64kib">64 KiB</option>
						<option value="256kib">128 KiB</option>
						<option value="256kib">256 KiB</option>
						<option value="512kib">512 KiB</option>
						<option value="1mib">1 MiB</option>
					</select>
				</div>


				<!-- Access Time (Select) -->
				<div>
					<label :for="getIdKey('fs-access-time')" class="block text-sm font-medium leading-6 text-default">Access Time</label>
					<select v-model="fileSystemConfig.properties.accessTime" :id="getIdKey('fs-access-time')" name="fs-access-time" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default placeholder:text-muted sm:text-sm sm:leading-6">
						<option value="inherited">Default (On)</option>
						<option value="on">On</option>
						<option value="off">Off</option>
					</select>
				</div>
				<!-- Case Sensitivity (Select) -->
				<div>
					<label :for="getIdKey('fs-case-sensitivity')" class="block text-sm font-medium leading-6 text-default">Case Sensitivity</label>
					<select v-model="fileSystemConfig.properties.caseSensitivity" :id="getIdKey('fs-case-sensitivity')" name="fs-case-sensitivity" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default placeholder:text-muted sm:text-sm sm:leading-6">
						<option value="inherited">Default (Sensitive)</option>
						<option value="insensitive">Insensitive</option>
						<option value="mixed">Mixed</option>
						<option value="sensitive">Sensitive</option>
					</select>
				</div>
				<!-- DNode Size (Select) -->
				<div>
					<label :for="getIdKey('fs-dnode-size')" class="block text-sm font-medium leading-6 text-default">DNode Size</label>
					<select v-model="fileSystemConfig.properties.dNodeSize" :id="getIdKey('fs-dnode-size')" name="fs-dnode-size" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default placeholder:text-muted sm:text-sm sm:leading-6">
						<option value="inherited">Default (Legacy)</option>
						<option value="1kib">1 KiB</option>
						<option value="2kib">2 KiB</option>
						<option value="4kib">4 KiB</option>
						<option value="8kib">8 KiB</option>
						<option value="16kib">16 KiB</option>
						<option value="auto">Auto</option>
						<option value="legacy">Legacy</option>
					</select>
				</div>
				<!-- Extended Attributes (Select) -->
				<div>
					<label :for="getIdKey('fs-extended-attributes')" class="block text-sm font-medium leading-6 text-default">Extended Attributes</label>
					<select v-model="fileSystemConfig.properties.extendedAttributes" :id="getIdKey('fs-extended-attributes')" name="fs-extended-attributes" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default placeholder:text-muted sm:text-sm sm:leading-6">
						<option value="inherited">Default (System Attribute)</option>
						<option value="on">On</option>
						<option value="off">Off</option>
						<option value="system attribute">System Attribute</option>
					</select>
				</div>	
			</div>

			<div>
				<!-- Quota (Slider + Select) -->
				<div>
					<label :for="getIdKey('fs-quota')" class="mb-1 block text-sm font-medium leading-6 text-default">Quota</label>
					<div class="flex flex-row">
						<input v-model="fileSystemConfig.properties.quota.raw" :id="getIdKey('fs-quota-amount')" type="range" min="0" max="1000" value="0" step="1" class="text-default mt-5 w-3/4 h-2 bg-accent rounded-lg appearance-none cursor-pointer "/>
						<input v-model="fileSystemConfig.properties.quota.raw" type="number" name="fs-quota-num" :id="getIdKey('fs-quota-amount')" min="0" max="1000" value="0" class="text-default bg-default mt-1 w-fit block py-1.5 px-1.5 ml-1 text-default placeholder:text-muted input-textlike sm:text-sm sm:leading-6"/>      
						<select v-model="fileSystemConfig.properties.quota.unit" :id="getIdKey('fs-quota-size')" name="fs-quota-slider" class="block sm:col-span-1 bg-default py-1.5 pl-3 pr-10 text-default input-textlike sm:text-sm sm:leading-6">
							<option value="kib">KiB</option>
							<option value="mib">MiB</option>
							<option value="gib">GiB</option>
							<option value="tib">TiB</option>
						</select>
					</div>
				</div>

				<!-- Read Only (Toggle) -->
				<div>
					<label :for="getIdKey('fs-read-only')" class="mt-1 block text-sm font-medium leading-6 text-default">Read Only</label>
					<Switch v-model="fileSystemConfig.properties.isReadOnly" :class="[fileSystemConfig.properties.isReadOnly ? 'bg-primary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
						<span class="sr-only">Use setting</span>
						<span :class="[fileSystemConfig.properties.isReadOnly ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
							<span :class="[fileSystemConfig.properties.isReadOnly ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
								<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
									<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							</span>
							<span :class="[fileSystemConfig.properties.isReadOnly ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
								<svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
									<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
								</svg>
							</span>
						</span>
					</Switch>
				</div>


			</div>
		</div>
	</div>

	<!-- STANDALONE FILE SYSTEM CREATION -->
	<div v-if="isStandalone == true">
		<Modal :isOpen="showFSWizard" @close="showFSWizard = false" :marginTop="'mt-28'" :width="'w-8/12'" :minWidth="'min-w-8/12'">
			<template v-slot:title>
				<legend class="flex justify-center">Create a New File System</legend>
			</template>
			<template v-slot:content>
				<!-- Name of Parent File System (Text) -->
				<div>
                    <label :for="getIdKey('parent-filesystem')" class="block text-sm font-medium leading-6 text-default">Parent File System</label>
                    <select :id="getIdKey('parent-filesystem')" name="parent-filesystem" v-model="newFileSystemConfig.parentFS" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default placeholder:text-muted sm:text-sm sm:leading-6">
                        <option v-for="dataset, datasetIdx in datasets" :key="datasetIdx" :value="dataset.name">{{ dataset.name }}</option>
                    </select>
                </div>

				<!-- Name of File System (Text) -->
				<div>
					<label :for="getIdKey('filesystem-name')" class="mt-1 block text-sm font-medium text-default">Name</label>
					<input :id="getIdKey('filesystem-name')" type="name" name="pool-name" v-model="newFileSystemConfig.name" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default placeholder:text-muted sm:text-sm sm:leading-6" placeholder="File System Name" />
				</div>

				<!-- Encryption (Toggle) -> Reveals extra fields-->
				<div>
					<label :for="getIdKey('encryption')" class="mt-1 block text-sm font-medium leading-6 text-default">Encryption</label>
					<Switch :id="getIdKey('encryption')" v-model="newFileSystemConfig.encrypted" :class="[newFileSystemConfig.encrypted ? 'bg-primary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
						<span class="sr-only">Use setting</span>
						<span :class="[newFileSystemConfig.encrypted ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
							<span :class="[newFileSystemConfig.encrypted ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
								<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
									<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							</span>
							<span :class="[newFileSystemConfig.encrypted ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
								<svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
									<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
								</svg>
							</span>
						</span>
					</Switch>
				</div>

				<div v-if="newFileSystemConfig.encrypted">
					<!-- Passphrase (Text) -->
					<div>
						<label :for="getIdKey('passphrase')" class="mt-1 block text-sm font-medium leading-6 text-default">Passphrase</label>
						<input :id="getIdKey('passphrase')" type="password" v-model="passphrase" name="passphrase" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default placeholder:text-muted sm:text-sm sm:leading-6" placeholder="Passphrase" />
					</div>
					<!-- Confirm Passphrase (Text) -->
					<div>
						<label :for="getIdKey('passphrase-confirm')" class="mt-1 block text-sm font-medium leading-6 text-default">Confirm Passphrase</label>
						<input :id="getIdKey('passphrase-confirm')" type="password" v-model="passphraseConfirm" name="passphrase-confirm" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default placeholder:text-muted sm:text-sm sm:leading-6" placeholder="Confirm Passphrase" />
					</div>
					<!-- Cipher (Select) -->
					<div>
						<label :for="getIdKey('cipher')" class="block text-sm font-medium leading-6 text-default">Cipher</label>
						<select :id="getIdKey('cipher')" name="cipher" v-model="newFileSystemConfig.properties.encryption" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default placeholder:text-muted sm:text-sm sm:leading-6">
							<option value="aes-128-ccm">AES-128-CCM</option>
							<option value="aes-192-ccm">AES-192-CCM</option>
							<option value="aes-256-ccm">AES-256-CCM</option>
							<option value="aes-128-gcm">AES-128-GCM</option>
							<option value="aes-192-gcm">AES-192-GCM</option>
							<option value="aes-256-gcm">AES-256-GCM</option>
						</select>
					</div>
				</div>

				<!-- Inherit Pool Settings (Toggle) -> On by Default, if Off then reveals all fields to set -->
				<div>
					<label :for="getIdKey('inherit')" class="mt-1 block text-sm font-medium leading-6 text-default">Inherit Pool Settings</label>
					<Switch :id="getIdKey('inherit')" v-model="newFileSystemConfig.inherit" :class="[newFileSystemConfig.inherit ? 'bg-primary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
						<span class="sr-only">Use setting</span>
						<span :class="[newFileSystemConfig.inherit ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
							<span :class="[newFileSystemConfig.inherit ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
								<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
									<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							</span>
							<span :class="[newFileSystemConfig.inherit ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
								<svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
									<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
								</svg>
							</span>
						</span>
					</Switch>
				</div>
				
				<div v-if="!newFileSystemConfig.inherit">
					<!-- Access Time (Select) -->
					<div>
						<label :for="getIdKey('fs-access-time')" class="block text-sm font-medium leading-6 text-default">Access Time</label>
						<select v-model="newFileSystemConfig.properties.accessTime" :id="getIdKey('fs-access-time')" name="fs-access-time" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default placeholder:text-muted sm:text-sm sm:leading-6">
							<option value="inherited">Inherited</option>
							<option value="on">On</option>
							<option value="off">Off</option>
						</select>
					</div>
					<!-- Case Sensitivity (Select) -->
					<div>
						<label :for="getIdKey('fs-case-sensitivity')" class="block text-sm font-medium leading-6 text-default">Case Sensitivity</label>
						<select v-model="newFileSystemConfig.properties.caseSensitivity" :id="getIdKey('fs-case-sensitivity')" name="fs-case-sensitivity" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default placeholder:text-muted sm:text-sm sm:leading-6">
							<option value="inherited">Inherited</option>
							<option value="insensitive">Insensitive</option>
							<option value="mixed">Mixed</option>
							<option value="sensitive">Sensitive</option>
						</select>
					</div>
					<!-- Compression (Select) -->
					<div>
						<label :for="getIdKey('fs-compression')" class="block text-sm font-medium leading-6 text-default">Compression</label>
						<select v-model="newFileSystemConfig.properties.compression" :id="getIdKey('fs-compression')" name="fs-compression" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default placeholder:text-muted sm:text-sm sm:leading-6">
							<option value="inherited">Inherited</option>
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
						<select v-model="newFileSystemConfig.properties.deduplication" :id="getIdKey('fs-deduplication')" name="fs-deduplication" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default placeholder:text-muted sm:text-sm sm:leading-6">
							<option value="inherited">Inherited</option>
							<option value="on">On</option>
							<option value="off">Off</option>
							<option value="edonr,verify">Edon-R + Verify</option>
							<option value="sha256">SHA-256</option>
							<option value="sha256,verify">SHA-256 + Verify</option>
							<option value="sha512">SHA-512</option>
							<option value="sha512,verify">SHA-512 + Verify</option>
							<option value="skein">Skein</option>
							<option value="skein,verify">Skein + Verify</option>
							<option value="verify">Verify</option>
						</select>
					</div>
					<!-- DNode Size (Select) -->
					<div>
						<label :for="getIdKey('fs-dnode-size')" class="block text-sm font-medium leading-6 text-default">DNode Size</label>
						<select v-model="newFileSystemConfig.properties.dNodeSize" :id="getIdKey('fs-dnode-size')" name="fs-dnode-size" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default placeholder:text-muted sm:text-sm sm:leading-6">
							<option value="inherited">Inherited</option>
							<option value="1k">1 KiB</option>
							<option value="2k">2 KiB</option>
							<option value="4k">4 KiB</option>
							<option value="8k">8 KiB</option>
							<option value="16k">16 KiB</option>
							<option value="auto">Auto</option>
							<option value="legacy">Legacy</option>
						</select>
					</div>
					<!-- Extended Attributes (Select) -->
					<div>
						<label :for="getIdKey('fs-extended-attributes')" class="block text-sm font-medium leading-6 text-default">Extended Attributes</label>
						<select v-model="newFileSystemConfig.properties.extendedAttributes" :id="getIdKey('fs-extended-attributes')" name="fs-extended-attributes" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default placeholder:text-muted sm:text-sm sm:leading-6">
							<option value="inherited">Inherited</option>
							<option value="on">On</option>
							<option value="off">Off</option>
							<option value="sa">System Attribute</option>
						</select>
					</div>
					<!-- Record Size (Select) -->
					<div>
						<label :for="getIdKey('fs-record-size')" class="block text-sm font-medium leading-6 text-default">Record Size</label>
						<select v-model="newFileSystemConfig.properties.recordSize" :id="getIdKey('fs-record-size')" name="fs-record-size" class="input-textlike bg-default mt-1 block w-full py-1.5 px-1.5 text-default placeholder:text-muted sm:text-sm sm:leading-6">
							<option value="inherited">Inherited</option>
							<option value="512">512 B</option>
							<option value="4K">4 KiB</option>
							<option value="8K">8 KiB</option>
							<option value="16K">16 KiB</option>
							<option value="32K">32 KiB</option>
							<option value="64K">64 KiB</option>
							<option value="128K">128 KiB</option>
							<option value="256K">256 KiB</option>
							<option value="512K">512 KiB</option>
							<option value="1M">1 MiB</option>
						</select>
					</div>
				</div>

				<div>
					<!-- Quota (Slider + Select) -->
					<div>
						<label :for="getIdKey('fs-quota')" class="mb-1 block text-sm font-medium leading-6 text-default">Quota</label>
						<div class="flex flex-row">
							<input v-model="newFileSystemConfig.properties.quota.raw" :id="getIdKey('fs-quota-amount')" type="range" min="0" max="1000" value="0" step="1" class="text-default mt-5 w-3/4 h-2 bg-accent rounded-lg appearance-none cursor-pointer "/>
							<input v-model="newFileSystemConfig.properties.quota.raw" type="number" name="fs-quota-num" :id="getIdKey('fs-quota-amount')" min="0" max="1000" value="0" class="text-default bg-default mt-1 w-fit block py-1.5 px-1.5 ml-1 text-default placeholder:text-muted input-textlike sm:text-sm sm:leading-6"/>
							<select v-model="newFileSystemConfig.properties.quota.unit" :id="getIdKey('fs-quota-size')" name="fs-quota-slider" class="block sm:col-span-1 bg-default py-1.5 pl-3 pr-10 text-default input-textlike sm:text-sm sm:leading-6">
								<option value="kib">KiB</option>
								<option value="mib">MiB</option>
								<option value="gib">GiB</option>
								<option value="tib">TiB</option>
							</select>
						</div>
						<!-- <div class="mt-2 justify-self-start">
                            <p class="text-muted">Used Space: {{ convertBytesToSize(newFileSystemConfig.properties.used) }}</p>
                        </div> -->
					</div>

					<!-- Read Only (Toggle) -->
					<div>
						<label :for="getIdKey('fs-read-only')" class="mt-1 block text-sm font-medium leading-6 text-default">Read Only</label>
						<Switch v-model="newFileSystemConfig.properties.isReadOnly" :class="[newFileSystemConfig.properties.isReadOnly ? 'bg-primary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
							<span class="sr-only">Use setting</span>
							<span :class="[newFileSystemConfig.properties.isReadOnly ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
								<span :class="[newFileSystemConfig.properties.isReadOnly ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
										<path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</span>
								<span :class="[newFileSystemConfig.properties.isReadOnly ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
									<svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
										<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
									</svg>
								</span>
							</span>
						</Switch>
					</div>
				</div>
			</template>
			<template v-slot:footer>
				<div class="w-full grid grid-rows-2">
					<div class="w-full row-start-1">
						<div class="button-group-row mt-2 justify-self-center">
							<p class="text-danger" v-if="nameFeedback">{{ nameFeedback }}</p>
							<p class="text-danger" v-if="passFeedback">{{ passFeedback }}</p>
							<p class="text-danger" v-if="quotaFeedback">{{ quotaFeedback }}</p>
						</div>
					</div>
					<div class="button-group-row w-full row-start-2 justify-between mt-2">
						<button id="cancel" class="mt-1 btn btn-danger object-left justify-start h-fit" @click="showFSWizard = false">Cancel</button>
						<button @click="fsCreateBtn(newFileSystemConfig)" :id="getIdKey('create-fs-btn')" name="create-fs-btn" class="mt-1 btn btn-primary object-right justify-end h-fit">Create File System</button>
					</div>
				</div>
			</template>
		</Modal>
	</div>
</template>

<script setup lang="ts">
import { ref, Ref, inject } from 'vue';
import { Switch } from '@headlessui/vue';
import { convertSizeToBytes, convertBytesToSize, isBoolOnOff } from '../../composables/helpers';
import { createDataset } from '../../composables/datasets';
import Modal from '../common/Modal.vue';
import { loadDatasets } from '../../composables/loadData';

interface FileSystemProps {
	idKey: string;
	isStandalone: boolean;
}

const props = defineProps<FileSystemProps>();

const showFSWizard = inject<Ref<boolean>>('show-fs-wizard')!;

const poolConfig = inject<PoolData>("pool-config-data")!;

const fileSystemConfig = inject<Ref<FileSystemData>>('file-system-data')!;
const datasets = inject<Ref<FileSystemData[]>>('datasets')!;

const nameFeedback = ref('');
const passphrase = ref('');
const passphraseConfirm = ref('');
const passFeedback = ref('');

const quotaFeedback = ref('');

const parentPool = ref<PoolData>();

const newFileSystemConfig = ref<FileSystemData>({
    parentFS: '',
    name: '',
    id: '',
    mountpoint: '',
    pool: '',
    encrypted: false,
    key_loaded: '',
    type: '',
    inherit: true,
    properties: {
		guid: '',
		encryption: 'aes-256-gcm',
        accessTime: 'inherited',
        caseSensitivity: 'inherited',
        compression: 'inherited',
        deduplication: 'inherited',
        dNodeSize: 'inherited',
        extendedAttributes: 'inherited',
        recordSize: 'inherited',
        quota: {
            raw: 0,
            value: '',
            unit: 'kib',
        },
		usedByDataset: '',
		usedbyRefreservation: '',
        readOnly: '',
        available: 0,
        creation: '',
        snapshotCount: '',
        mounted: '',
		refreservation: {
            raw: 0,
            value: '',
            unit: 'kib',
        },
		used: 0,
    },
    children: [],
});

console.log('poolConfig', poolConfig);

function getInheritedProperties() {
	if (props.isStandalone) {

		const selectedDataset = datasets.value.find(dataset => {
			return dataset.id === newFileSystemConfig.value.parentFS;
		});

		console.log('selectedDataset:', selectedDataset);
		
		if (newFileSystemConfig.value.properties.deduplication == 'inherited') {
			newFileSystemConfig.value.properties.deduplication = selectedDataset?.properties.deduplication!;
		}
		if (newFileSystemConfig.value.properties.compression == 'inherited') {
			newFileSystemConfig.value.properties.compression = selectedDataset?.properties.compression!;
		}
		if (newFileSystemConfig.value.properties.recordSize == 'inherited') {
			newFileSystemConfig.value.properties.recordSize = selectedDataset?.properties.recordSize!;
		}
		if (newFileSystemConfig.value.properties.accessTime == 'inherited') {
			newFileSystemConfig.value.properties.accessTime =  selectedDataset?.properties.accessTime!;
		}
		if (newFileSystemConfig.value.properties.caseSensitivity == 'inherited') {
			newFileSystemConfig.value.properties.caseSensitivity = selectedDataset?.properties.caseSensitivity!;
		}
		if (newFileSystemConfig.value.properties.dNodeSize == 'inherited') {
			newFileSystemConfig.value.properties.dNodeSize = selectedDataset?.properties.dNodeSize!;
		}
		if (newFileSystemConfig.value.properties.extendedAttributes == 'inherited') {
			newFileSystemConfig.value.properties.extendedAttributes = selectedDataset?.properties.extendedAttributes!;
		}

		console.log("newFileSystemConfig");
		console.log(newFileSystemConfig);
	} else {
		fileSystemConfig.value.parentFS = poolConfig.name;

		if (fileSystemConfig.value.properties.deduplication == 'inherited') {
			fileSystemConfig.value.properties.deduplication = isBoolOnOff(poolConfig.properties.deduplication!);
		}
		if (fileSystemConfig.value.properties.compression == 'inherited') {
			fileSystemConfig.value.properties.compression = isBoolCompression(poolConfig.properties.compression!);
		}
		if (fileSystemConfig.value.properties.recordSize == 'inherited') {
			fileSystemConfig.value.properties.recordSize = poolConfig.properties.record!;
		}
		if (fileSystemConfig.value.properties.accessTime == 'inherited') {
			fileSystemConfig.value.properties.accessTime = 'on';
		}
		if (fileSystemConfig.value.properties.caseSensitivity == 'inherited') {
			fileSystemConfig.value.properties.caseSensitivity = 'sensitive';
		}
		if (fileSystemConfig.value.properties.dNodeSize == 'inherited') {
			fileSystemConfig.value.properties.dNodeSize = 'legacy';
		}
		if (fileSystemConfig.value.properties.extendedAttributes == 'inherited') {
			fileSystemConfig.value.properties.extendedAttributes = 'sa';
		}

		console.log("fileSystemConfig");
		console.log(fileSystemConfig);
	}
}

const nameCheck = (fileSystem : FileSystemData) => {
	let result = true;
	nameFeedback.value = '';
	
	if (fileSystem.name == '') {
		result = false;
		nameFeedback.value = 'Name cannot be empty.';
	} else if (fileSystem.name.match(/^[0-9]/) ) {
		result = false;
		nameFeedback.value = 'Name cannot begin with numbers.';
	} else if (fileSystem.name.match(/^[.]/ )) {
		result = false;
		nameFeedback.value = 'Name cannot begin with a period (.).';
	} else if (fileSystem.name.match(/^[_]/)) {
		result = false;
		nameFeedback.value = 'Name cannot begin with an underscore (_).';
	} else if (fileSystem.name.match(/^[-]/)) {
		result = false;
		nameFeedback.value = 'Name cannot begin with a hyphen (-).';
	} else if (fileSystem.name.match(/^[:]/)) {
		result = false;
		nameFeedback.value = 'Name cannot begin with a colon (:).';
	} else if (fileSystem.name.match(/^[ ]/)) {
		result = false;
		nameFeedback.value = 'Name cannot begin with whitespace.';
	} else if (fileSystem.name.match(/[ ]$/)) {
		result = false;
		nameFeedback.value = 'Name cannot end with whitespace.';
	} else if (fileSystem.name.match(/^c[0-9]|^log|^mirror|^raidz|^raidz1|^raidz2|^raidz3|^spare/)) {
		result = false;
		nameFeedback.value = 'Name cannot begin with a reserved name.';
	} else if (!fileSystem.name.match(/^[a-zA-Z0-9_.:-]*$/)) {
		result = false;
		nameFeedback.value = 'Name contains invalid characters.';
	} 
	return result;
}

const encryptPasswordCheck = (fileSystem : FileSystemData) => {
	let result = true;
	passFeedback.value = '';

	if (fileSystem.encrypted) {
		if (passphraseConfirm.value != passphrase.value) {
			result = false;
			passFeedback.value = 'Passphrase does not match.';
		} else if (passphrase.value == '') {
			result = false;
			passFeedback.value = 'Passphrase cannot be empty.';
		} else if (passphrase.value.length < 8) {
			result = false;
			passFeedback.value = 'Passphrase requires a minimum of 8 characters.';
		}
	}

	return result;
}

const checkQuota = (filesystem) => {
    let result = true;
    quotaFeedback.value = '';

    if (filesystem.properties.quota.raw !< filesystem.properties.available) {
        result = false;
        quotaFeedback.value = 'Quota cannot be more than available space.';
    }

    return result;
}

const newDataset = ref<NewDataset>({
	name: '',
	parent: '',
	encrypted: false,
	atime: '',
	casesensitivity: '',
	compression: '',
	dedup: '',
	dnodesize: '',
	xattr: '',
	recordsize: '',
	quota: '',
	readonly: '',
});

function fillDatasetData() {
	newDataset.value.name = newFileSystemConfig.value.name;
	newDataset.value.parent = newFileSystemConfig.value.parentFS!;
	newDataset.value.encrypted = newFileSystemConfig.value.encrypted;
	newDataset.value.encryption = newFileSystemConfig.value.properties.encryption;
	newDataset.value.atime = newFileSystemConfig.value.properties.accessTime;
	newDataset.value.casesensitivity = newFileSystemConfig.value.properties.caseSensitivity;
	newDataset.value.compression = newFileSystemConfig.value.properties.compression;
	newDataset.value.dedup = newFileSystemConfig.value.properties.deduplication;
	newDataset.value.dnodesize = newFileSystemConfig.value.properties.dNodeSize;
	newDataset.value.xattr = newFileSystemConfig.value.properties.extendedAttributes;
	newDataset.value.recordsize = newFileSystemConfig.value.properties.recordSize;
	newDataset.value.quota = convertSizeToBytes((newFileSystemConfig.value.properties.quota.raw.toString() + newFileSystemConfig.value.properties.quota.unit)).toString();
	newDataset.value.readonly = isBoolOnOff(newFileSystemConfig.value.properties.isReadOnly!);

	console.log("newDataSetData sent:", newDataset);
}

async function fsCreateBtn(fileSystem) {
	if (nameCheck(fileSystem)) {
		if (fileSystem.encrypted) {
			if (encryptPasswordCheck(fileSystem)) {
				if (checkQuota(fileSystem)) {
					getInheritedProperties();
					fillDatasetData();
					createDataset(newDataset.value).then(async() => {
						datasets.value = [];
						await loadDatasets(datasets);
						showFSWizard.value = false;
					});
				}
			}
		} else {
			if (checkQuota(fileSystem)) {
				getInheritedProperties();
				fillDatasetData();
				createDataset(newDataset.value).then(async() => {
					datasets.value = [];
					await loadDatasets(datasets);
					showFSWizard.value = false;
				});
			}
		}
	}
}

function isBoolCompression(bool : boolean) {
	if (bool) {return 'lz4'} else {return 'off'}
}

const getIdKey = (name: string) => `${props.idKey}-${name}`;

defineExpose({
	nameCheck,
	getInheritedProperties
})
</script>