<template>
	<Modal :isOpen="showFSConfig" @close="showFSConfig = false" :marginTop="'mt-28'" :width="'w-8/12'" :minWidth="'min-w-8/12'">
        <template v-slot:title>
            <legend class="flex justify-center">Configure File System</legend>
        </template>
        <template v-slot:content>
            <div>
                <div class="grid grid-cols-4 gap-2">
                    <div class="mt-2 ">
                        <label :for="getIdKey('fs-config-name')" name="fs-config-name" class="mt-1 block text-sm leading-6 text-default">File System Name</label>
                        <p>{{ props.filesystem.name }}</p>
                    </div>
                    <div class="mt-2">
                        <label :for="getIdKey('fs-config-guid')" name="fs-config-guid" class="mt-1 block text-sm leading-6 text-default">GUID</label>
                        <p>{{ props.filesystem.properties.guid }}</p>
                    </div>
                    <div class="mt-2">
                        <label :for="getIdKey('fs-config-case-sensitivity')" name="fs-config-case-sensitivity" class="mt-1 block text-sm leading-6 text-default">Case Sensitivity</label>
                        <p>{{ upperCaseWord(props.filesystem.properties.caseSensitivity) }}</p>
                    </div>
                    <div class="mt-2">
                        <label for="fs-config-readonly" :id="getIdKey('fs-config-readonly')" name="fs-config-readonly" class="mt-1 block text-sm leading-6 text-default">Read Only</label>
                        <Switch v-model="fileSystemConfig.properties.isReadOnly" :id="getIdKey('fs-config-readonly')" :class="[fileSystemConfig.properties.isReadOnly! ? 'bg-secondary' : 'bg-accent', 'mt-1 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
                            <span class="sr-only">Use setting</span>
                            <span :class="[fileSystemConfig.properties.isReadOnly! ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
                                <span :class="[fileSystemConfig.properties.isReadOnly! ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                    <svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
                                        <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </span>
                                <span :class="[fileSystemConfig.properties.isReadOnly! ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                    <svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
                                        <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                    </svg>
                                </span>
                            </span>
                        </Switch>
                    </div>
                </div>
              
                <div class="mt-2">
                    <label :for="getIdKey('fs-config-mountpoint')" name="fs-config-mountpoint" class="mt-1 block text-sm leading-6 text-default">Mountpoint</label>
                    <input type="text" v-model="fileSystemConfig.mountpoint" name="fs-config-mountpoint" :id="getIdKey('fs-config-mountpoint')" class="mt-1 block w-full input-textlike bg-default" placeholder="Mountpoint" />
                </div>
               <div class="mt-2">
                    <label :for="getIdKey('fs-config-can-mount')" class="bg-default block text-base leading-6 text-default">Can Mount</label>
                    <select :id="getIdKey('fs-config-can-mount')" v-model="fileSystemConfig.properties.canMount" name="fs-config-can-mount" class="mt-1 block w-full input-textlike bg-default">
                        <option value="on">On</option>
                        <option value="off">Off</option>
                        <option value="noauto">No Auto</option>
                    </select>
                </div>
                
               <div class="mt-2">
                    <label :for="getIdKey('fs-config-quota')" class="mb-1 block text-sm font-medium leading-6 text-default">Quota</label>
                    <div class="flex flex-row">
                        <input v-model="fileSystemConfig.properties.quota.raw" :id="getIdKey('fs-config-quota-amount')" name="fs-config-quota-slider" type="range" min="0" max="1000" value="0" step="1" class="text-default mt-5 w-3/4 h-2 bg-accent rounded-lg appearance-none cursor-pointer "/>
                        <input v-model="fileSystemConfig.properties.quota.raw" type="number" name="fs-config-quota-num" :id="getIdKey('fs-config-quota-num')" min="0" max="1000" value="0" class="text-default bg-default mt-1 w-fit block py-1.5 px-1.5 ml-1 text-default placeholder:text-muted input-textlike sm:text-sm sm:leading-6"/>
                        <select v-model="fileSystemConfig.properties.quota.unit" :id="getIdKey('fs-config-quota-size')" name="fs-config-quota-size" class="block sm:col-span-1 bg-default py-1.5 pl-3 pr-10 text-default input-textlike sm:text-sm sm:leading-6">
                            <option value="kib">KiB</option>
                            <option value="mib">MiB</option>
                            <option value="gib">GiB</option>
                            <option value="tib">TiB</option>
                        </select>
                    </div>
                    <div class="flex flex-row justify-between">
                        <div v-if="fileSystemConfig.properties.quota.raw !== null" class="mt-2 justify-self-start">
                            <p class="text-muted">Used Space: {{ convertBytesToSize(fileSystemConfig.properties.used) }}</p>
                        </div>
                        <div v-if="fileSystemConfig.properties.quota.raw === null || !fileSystemConfig.properties.quota.raw" class="mt-2 justify-self-end">
                            <p class="text-muted">There is no quota currently set.</p>
                        </div>
                    </div>
                    
                </div>

                <div class="mt-2">
                    <label :for="getIdKey('fs-config-recordsize')" class="block text-sm font-medium leading-6 text-default">Record Size</label>
                    <select :id="getIdKey('fs-config-recordsize')" v-model="fileSystemConfig.properties.recordSize" name="fs-config-recordsize" class="mt-1 block w-full input-textlike bg-default">
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

                <div class="mt-2">
                    <label :for="getIdKey('fs-config-refreservation')" class="mb-1 block text-sm font-medium leading-6 text-default">Refreservation</label>
                    <div class="flex flex-row">
                        <input v-model="fileSystemConfig.properties.refreservation!.raw" :id="getIdKey('fs-config-refreservation-amount')"  name="fs-config-refreservation-slider" type="range" min="0" max="1000" value="0" step="1" class="text-default mt-5 w-3/4 h-2 bg-accent rounded-lg appearance-none cursor-pointer "/>
                        <input v-model="fileSystemConfig.properties.refreservation!.raw" type="number" name="fs-config-refreservation-num" :id="getIdKey('fs-config-refreservation-num')" min="0" max="1000" value="0" class="text-default bg-default mt-1 w-fit block py-1.5 px-1.5 ml-1 text-default placeholder:text-muted input-textlike sm:text-sm sm:leading-6"/>
                        <select v-model="fileSystemConfig.properties.refreservation!.unit" :id="getIdKey('fs-config-refreservation-size')" name="fs-config-refreservation-size" class="block sm:col-span-1 bg-default py-1.5 pl-3 pr-10 text-default input-textlike sm:text-sm sm:leading-6">
                            <option value="kib">KiB</option>
                            <option value="mib">MiB</option>
                            <option value="gib">GiB</option>
                            <option value="tib">TiB</option>
                        </select>
                    </div>
                    <div class="flex flex-row justify-between">
                       
                        <div v-if="fileSystemConfig.properties.refreservation!.raw !== null" class="mt-2 justify-self-start">
                            <p class="text-muted">Available Space: {{ convertBytesToSize(fileSystemConfig.properties.available) }}</p>
                        </div>
                        <div v-if="fileSystemConfig.properties.refreservation!.raw === null || !fileSystemConfig.properties.refreservation!.raw" class="mt-2 justify-self-end">
                            <p class="text-muted">There is no refreservation currently set.</p>
                        </div>
                    </div>
                </div>

                 <div class="mt-2">
                    <label :for="getIdKey('fs-config-acl-inherit')" class="bg-default block text-base leading-6 text-default">ACL Inheritance</label>
                    <select :id="getIdKey('fs-config-acl-inherit')" v-model="fileSystemConfig.properties.aclInheritance" name="fs-config-acl-inherit" class="mt-1 block w-full input-textlike bg-default">           
                        <option value="discard">Discard</option>
                        <option value="noallow">No Allow</option>
                        <option value="restricted">Restricted</option>
                        <option value="passthrough">Passthrough</option>
                        <option value="passthrough-x">Passthrough-X</option>                       
                    </select>
                </div>
                <div class="mt-2">
                    <label :for="getIdKey('fs-config-acl-type')" class="bg-default block text-base leading-6 text-default">ACL Type</label>
                    <select :id="getIdKey('fs-config-acl-type')" v-model="fileSystemConfig.properties.aclType" name="fs-config-acl-type" class="mt-1 block w-full input-textlike bg-default">
                        <option value="off">Off/No ACL</option>
                        <option value="posix">POSIX ACL</option>
                    </select>
                </div>
                <div class="mt-2">
                    <label :for="getIdKey('fs-config-access-time')" class="bg-default block text-base leading-6 text-default">Access Time</label>
                    <select :id="getIdKey('fs-config-access-time')" v-model="fileSystemConfig.properties.accessTime" name="fs-config-access-time" class="mt-1 block w-full input-textlike bg-default">
                        <option value="on">On</option>
                        <option value="off">Off</option>
                    </select>
                </div>
                <div class="mt-2">
                    <label :for="getIdKey('fs-config-dedup')" class="bg-default block text-base leading-6 text-default">Deduplication</label>
                    <select :id="getIdKey('fs-config-dedup')" v-model="fileSystemConfig.properties.deduplication" name="fs-config-dedup" class="mt-1 block w-full input-textlike bg-default">
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
                
              <div class="mt-2">
                    <label :for="getIdKey('fs-config-compression')" class="bg-default block text-base leading-6 text-default">Compression</label>
                    <select :id="getIdKey('fs-config-compression')" v-model="fileSystemConfig.properties.compression" name="fs-config-compression" class="mt-1 block w-full input-textlike bg-default">
                        <option value="on">On</option>
                        <option value="off">Off</option>
                        <option value="gzip">GZIP</option>
                        <option value="lz4">LZ4</option>
                        <option value="lzjb">LZJB</option>
                        <option value="zle">ZLE</option>
                    </select>
                </div> 
                <div class="mt-2">
                    <label :for="getIdKey('fs-config-checksum')" class="bg-default block text-base leading-6 text-default">Checksum</label>
                    <select :id="getIdKey('fs-config-checksum')" v-model="fileSystemConfig.properties.checksum" name="fs-config-checksum" class="mt-1 block w-full input-textlike bg-default">
                        <option value="on">On</option>
                        <option value="off">Off</option>
                        <option value="edonr">Edon-R</option>
                        <option value="fletcher2">Fletcher2</option>
                        <option value="fletcher4">Fletcher4</option>
                        <option value="noparity">No Parity</option>
                        <option value="sha256">SHA-256</option>
                        <option value="sha512">SHA-512</option>
                        <option value="skein">Skein</option>
                    </select>
                </div>
               
               <div class="mt-2">
                    <label :for="getIdKey('fs-config-dnode-size')" class="bg-default block text-base leading-6 text-default">DNode Size</label>
                    <select :id="getIdKey('fs-config-dnode-size')" v-model="fileSystemConfig.properties.dNodeSize" name="fs-config-dnode-size" class="mt-1 block w-full input-textlike bg-default">
                        <option value="1k">1 KiB</option>
                        <option value="2k">2 KiB</option>
                        <option value="4k">4 KiB</option>
                        <option value="8k">8 KiB</option>
                        <option value="16k">16 KiB</option>
                        <option value="auto">Auto</option>
                        <option value="legacy">Legacy</option>
                    </select>
                </div>
               <div class="mt-2">
                    <label :for="getIdKey('fs-config-xattr')" class="bg-default block text-base leading-6 text-default">Extended Attributes</label>
                    <select :id="getIdKey('fs-config-xattr')" v-model="fileSystemConfig.properties.extendedAttributes" name="fs-config-xattr" class="mt-1 block w-full input-textlike bg-default">
                        <option value="on">On</option>
                        <option value="off">Off</option>
                        <option value="sa">System Attribute</option>
                    </select>
                </div>
            </div>

            <!-- grid columns -- too busy? -->
            <!-- <div>
                <div class="grid grid-cols-4 gap-2">
                    <div class="mt-2 ">
                        <label :for="getIdKey('fs-config-name')" name="fs-config-name" class="mt-1 block text-sm leading-6 text-default">File System Name</label>
                        <p>{{ props.filesystem.name }}</p>
                    </div>
                    <div class="mt-2">
                        <label :for="getIdKey('fs-config-guid')" name="fs-config-guid" class="mt-1 block text-sm leading-6 text-default">GUID</label>
                        <p>{{ props.filesystem.properties.guid }}</p>
                    </div>
                    <div class="mt-2">
                        <label :for="getIdKey('fs-config-case-sensitivity')" name="fs-config-case-sensitivity" class="mt-1 block text-sm leading-6 text-default">Case Sensitivity</label>
                        <p>{{ upperCaseWord(props.filesystem.properties.caseSensitivity) }}</p>
                    </div>
                    <div class="mt-2">
                        <label for="fs-config-readonly" :id="getIdKey('fs-config-readonly')" name="fs-config-readonly" class="mt-1 block text-sm leading-6 text-default">Read Only</label>
                        <Switch v-model="fileSystemConfig.properties.isReadOnly" :id="getIdKey('fs-config-readonly')" :class="[fileSystemConfig.properties.isReadOnly! ? 'bg-secondary' : 'bg-accent', 'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2']">
                            <span class="sr-only">Use setting</span>
                            <span :class="[fileSystemConfig.properties.isReadOnly! ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-default shadow ring-0 transition duration-200 ease-in-out']">
                                <span :class="[fileSystemConfig.properties.isReadOnly! ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                    <svg class="h-3 w-3 text-muted" fill="none" viewBox="0 0 12 12">
                                        <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </span>
                                <span :class="[fileSystemConfig.properties.isReadOnly! ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out', 'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity']" aria-hidden="true">
                                    <svg class="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
                                        <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                    </svg>
                                </span>
                            </span>
                        </Switch>
                    </div>
                </div>
              
                <div class="mt-2 grid grid-cols-4 gap-2">
                    <div class="mt-2 col-span-2">
                        <label :for="getIdKey('fs-config-mountpoint')" name="fs-config-mountpoint" class="mt-1 block text-sm leading-6 text-default">Mountpoint</label>
                        <input type="text" v-model="fileSystemConfig.mountpoint" name="fs-config-mountpoint" :id="getIdKey('fs-config-mountpoint')" class="block w-full input-textlike bg-default" placeholder="Mountpoint" />
                    </div>
                    <div class="mt-2 col-span-2">
                        <label :for="getIdKey('fs-config-can-mount')" class="bg-default block text-base leading-6 text-default">Can Mount</label>
                        <select :id="getIdKey('fs-config-can-mount')" v-model="fileSystemConfig.properties.canMount" name="fs-config-can-mount" class="mt-1 block w-full input-textlike bg-default">
                            <option value="on">On</option>
                            <option value="off">Off</option>
                            <option value="noauto">No Auto</option>
                        </select>
                    </div>
                </div>
                <div class="mt-2">
                    <label :for="getIdKey('fs-config-quota')" class="-pt-3 block text-sm font-medium leading-6 text-default">Quota</label>
                    <div class="flex flex-row">
                        <input v-model="fileSystemConfig.properties.quota.raw" :id="getIdKey('fs-config-quota-amount')" name="fs-config-quota-slider" type="range" min="0" max="1000" value="0" step="1" class="text-default mt-5 w-3/4 h-2 bg-accent rounded-lg appearance-none cursor-pointer "/>
                        <input v-model="fileSystemConfig.properties.quota.raw" type="number" name="fs-config-quota-num" :id="getIdKey('fs-config-quota-num')" min="0" max="1000" value="0" class="text-default bg-default mt-1 w-fit block py-1.5 px-1.5 ml-1 text-default placeholder:text-muted input-textlike sm:text-sm sm:leading-6"/>
                        <select v-model="fileSystemConfig.properties.quota.unit" :id="getIdKey('fs-config-quota-size')" name="fs-config-quota-size" class="block sm:col-span-1 bg-default pl-3 pr-10 text-default input-textlike sm:text-sm sm:leading-6">
                            <option value="kib">KiB</option>
                            <option value="mib">MiB</option>
                            <option value="gib">GiB</option>
                            <option value="tib">TiB</option>
                        </select>
                    </div>
                    <div class="flex flex-row justify-between">
                        <div v-if="fileSystemConfig.properties.quota.raw !== null" class="mt-2 justify-self-start">
                            <p class="text-muted">Used Space: {{ convertBytesToSize(fileSystemConfig.properties.used) }}</p>
                        </div>
                        <div v-if="fileSystemConfig.properties.quota.raw === null || fileSystemConfig.properties.quota.value === 'none'" class="mt-2 justify-self-end">
                            <p class="text-muted">There is no quota currently set.</p>
                        </div>
                    </div>
                </div>

                <div class="mt-2 grid grid-cols-4 gap-2">
                    <div class="mt-2 col-span-2">
                        <label :for="getIdKey('fs-config-recordsize')" class="block text-sm font-medium leading-6 text-default">Record Size</label>
                        <select :id="getIdKey('fs-config-recordsize')" v-model="fileSystemConfig.properties.recordSize" name="fs-config-recordsize" class="mt-1 block w-full input-textlike bg-default">
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
                    <div class="mt-2 col-span-2">
                        <label :for="getIdKey('fs-config-dedup')" class="bg-default block text-base leading-6 text-default">Deduplication</label>
                        <select :id="getIdKey('fs-config-dedup')" v-model="fileSystemConfig.properties.deduplication" name="fs-config-dedup" class="mt-1 block w-full input-textlike bg-default">
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
                </div>

                <div class="mt-2">
                    <label :for="getIdKey('fs-config-refreservation')" class="-pt-3 block text-sm font-medium leading-6 text-default">Refreservation</label>
                    <div class="flex flex-row">
                        <input v-model="fileSystemConfig.properties.refreservation!.raw" :id="getIdKey('fs-config-refreservation-amount')"  name="fs-config-refreservation-slider" type="range" min="0" max="1000" value="0" step="1" class="text-default mt-5 w-3/4 h-2 bg-accent rounded-lg appearance-none cursor-pointer "/>
                        <input v-model="fileSystemConfig.properties.refreservation!.raw" type="number" name="fs-config-refreservation-num" :id="getIdKey('fs-config-refreservation-num')" min="0" max="1000" value="0" class="text-default bg-default mt-1 w-fit block py-1.5 px-1.5 ml-1 text-default placeholder:text-muted input-textlike sm:text-sm sm:leading-6"/>
                        <select v-model="fileSystemConfig.properties.refreservation!.unit" :id="getIdKey('fs-config-refreservation-size')" name="fs-config-refreservation-size" class="block sm:col-span-1 bg-default pl-3 pr-10 text-default input-textlike sm:text-sm sm:leading-6">
                            <option value="kib">KiB</option>
                            <option value="mib">MiB</option>
                            <option value="gib">GiB</option>
                            <option value="tib">TiB</option>
                        </select>
                    </div>
                    <div class="flex flex-row">
                        <div v-if="fileSystemConfig.properties.refreservation!.raw === null" class="mt-2 justify-self-center">
                            <p class="text-muted">There is no refreservation currently set.</p>
                        </div>
                        <div v-if="fileSystemConfig.properties.refreservation!.raw !== null" class="mt-2 justify-self-center">
                            <p class="text-muted">Available Space: {{ convertBytesToSize(fileSystemConfig.properties.available) }}</p>
                        </div>
                    </div>
                </div>
                
                <div class="mt-2 grid grid-cols-4 gap-2">
                    <div class="mt-2 col-span-2">
                        <label :for="getIdKey('fs-config-acl-inherit')" class="bg-default block text-base leading-6 text-default">ACL Inheritance</label>
                        <select :id="getIdKey('fs-config-acl-inherit')" v-model="fileSystemConfig.properties.aclInheritance" name="fs-config-acl-inherit" class="mt-1 block w-full input-textlike bg-default">           
                            <option value="discard">Discard</option>
                            <option value="noallow">No Allow</option>
                            <option value="restricted">Restricted</option>
                            <option value="passthrough">Passthrough</option>
                            <option value="passthrough-x">Passthrough-X</option>                       
                        </select>
                    </div>
                    <div class="mt-2 col-span-2">
                        <label :for="getIdKey('fs-config-acl-type')" class="bg-default block text-base leading-6 text-default">ACL Type</label>
                        <select :id="getIdKey('fs-config-acl-type')" v-model="fileSystemConfig.properties.aclType" name="fs-config-acl-type" class="mt-1 block w-full input-textlike bg-default">
                            <option value="off">Off/No ACL</option>
                            <option value="posix">POSIX ACL</option>
                        </select>
                    </div>
                </div>


                <div class="mt-2 grid grid-cols-6 gap-2">
                    <div class="mt-2 col-span-2">
                        <label :for="getIdKey('fs-config-access-time')" class="bg-default block text-base leading-6 text-default">Access Time</label>
                        <select :id="getIdKey('fs-config-access-time')" v-model="fileSystemConfig.properties.accessTime" name="fs-config-access-time" class="mt-1 block w-full input-textlike bg-default">
                            <option value="on">On</option>
                            <option value="off">Off</option>
                        </select>
                    </div>
                    <div class="mt-2 col-span-2">
                        <label :for="getIdKey('fs-config-compression')" class="bg-default block text-base leading-6 text-default">Compression</label>
                        <select :id="getIdKey('fs-config-compression')" v-model="fileSystemConfig.properties.compression" name="fs-config-compression" class="mt-1 block w-full input-textlike bg-default">
                            <option value="on">On</option>
                            <option value="off">Off</option>
                            <option value="gzip">GZIP</option>
                            <option value="lz4">LZ4</option>
                            <option value="lzjb">LZJB</option>
                            <option value="zle">ZLE</option>
                        </select>
                    </div> 
                    <div class="mt-2 col-span-2">
                        <label :for="getIdKey('fs-config-checksum')" class="bg-default block text-base leading-6 text-default">Checksum</label>
                        <select :id="getIdKey('fs-config-checksum')" v-model="fileSystemConfig.properties.checksum" name="fs-config-checksum" class="mt-1 block w-full input-textlike bg-default">
                            <option value="on">On</option>
                            <option value="off">Off</option>
                            <option value="edonr">Edon-R</option>
                            <option value="fletcher2">Fletcher2</option>
                            <option value="fletcher4">Fletcher4</option>
                            <option value="noparity">No Parity</option>
                            <option value="sha256">SHA-256</option>
                            <option value="sha512">SHA-512</option>
                            <option value="skein">Skein</option>
                        </select>
                    </div>
                </div>

                <div class="mt-2 grid grid-cols-4 gap-2">
                    <div class="mt-2 col-span-2">
                        <label :for="getIdKey('fs-config-dnode-size')" class="bg-default block text-base leading-6 text-default">DNode Size</label>
                        <select :id="getIdKey('fs-config-dnode-size')" v-model="fileSystemConfig.properties.dNodeSize" name="fs-config-dnode-size" class="mt-1 block w-full input-textlike bg-default">
                            <option value="1k">1 KiB</option>
                            <option value="2k">2 KiB</option>
                            <option value="4k">4 KiB</option>
                            <option value="8k">8 KiB</option>
                            <option value="16k">16 KiB</option>
                            <option value="auto">Auto</option>
                            <option value="legacy">Legacy</option>
                        </select>
                    </div>
                <div class="mt-2 col-span-2">
                        <label :for="getIdKey('fs-config-xattr')" class="bg-default block text-base leading-6 text-default">Extended Attributes</label>
                        <select :id="getIdKey('fs-config-xattr')" v-model="fileSystemConfig.properties.extendedAttributes" name="fs-config-xattr" class="mt-1 block w-full input-textlike bg-default">
                            <option value="on">On</option>
                            <option value="off">Off</option>
                            <option value="sa">System Attribute</option>
                        </select>
                    </div>
                </div>
                
            </div> -->
        </template>
        <template v-slot:footer>
            <div class="button-group-row w-full justify-between mx-4">
                <div class="button-group-row mt-2 justify-self-center">
                    <p class="text-danger" v-if="sizeFeedback">{{ sizeFeedback }}</p>
                </div>
                <div class="button-group-row mt-2">
                    <button @click="fsConfigureBtn(fileSystemConfig)" :id="getIdKey('create-fs-btn')" name="create-fs-btn" class="mt-1 btn btn-primary object-right justify-end">Configure</button>
                </div>
            </div>
        </template>
    </Modal>
</template>

<script setup lang="ts">
import { ref, Ref, inject, watch } from 'vue';
import { onOffToBool, isBoolOnOff, upperCaseWord, convertBytesToSize, convertSizeToBytes, getSizeNumberFromString, getSizeUnitFromString, getQuotaRefreservUnit } from '../../composables/helpers';
import { configureDataset } from '../../composables/datasets';
import { Switch } from '@headlessui/vue';
import Modal from '../common/Modal.vue';
import { loadDatasets } from '../../composables/loadData';

interface FSConfigModalProps {
    idKey: string;
    filesystem: FileSystemData;
}

const props = defineProps<FSConfigModalProps>();

const showFSConfig = inject<Ref<boolean>>('show-fs-config')!;
const datasets = inject<Ref<FileSystemData[]>>('datasets')!;

const sizeFeedback = ref('');

const fileSystemConfig = ref<FileSystemData>({
    parentFS: props.filesystem.parentFS,
    name: props.filesystem.name,
    id: props.filesystem.id,
    mountpoint: props.filesystem.mountpoint,
    pool: props.filesystem.pool,
    encrypted: props.filesystem.encrypted,
    key_loaded: props.filesystem.key_loaded,
    type: props.filesystem.type,
    inherit: props.filesystem.inherit,
    properties: {
        guid: props.filesystem.properties.guid,
		encryption: props.filesystem.properties.encryption,
        accessTime: props.filesystem.properties.accessTime,
        caseSensitivity: props.filesystem.properties.caseSensitivity,
        compression: props.filesystem.properties.compression,
        deduplication: props.filesystem.properties.deduplication,
        dNodeSize: props.filesystem.properties.dNodeSize,
        extendedAttributes: props.filesystem.properties.extendedAttributes,
        recordSize: props.filesystem.properties.recordSize,
        quota: {
            raw: getSizeNumberFromString(convertBytesToSize(props.filesystem.properties.quota.raw)),
            value: props.filesystem.properties.quota.value,
            unit: getSizeUnitFromString(getQuotaRefreservUnit(props.filesystem.properties.quota.raw)),
        },
		usedByDataset: props.filesystem.properties.usedByDataset,
		usedbyRefreservation: props.filesystem.properties.usedbyRefreservation,
        readOnly: props.filesystem.properties.readOnly,
        isReadOnly: onOffToBool(props.filesystem.properties.readOnly),
        available: props.filesystem.properties.available,
        creation: props.filesystem.properties.creation,
        snapshotCount: props.filesystem.properties.snapshotCount,
        mounted: props.filesystem.properties.mounted,
        refreservation: {
            raw: getSizeNumberFromString(convertBytesToSize(props.filesystem.properties.refreservation!.raw)),
            value: props.filesystem.properties.refreservation!.value,
            unit: getSizeUnitFromString(getQuotaRefreservUnit(props.filesystem.properties.refreservation!.raw)),
        },
        canMount: props.filesystem.properties.canMount,
        aclInheritance: props.filesystem.properties.aclInheritance,
        aclType: props.filesystem.properties.aclType,
        checksum: props.filesystem.properties.checksum,
        used: props.filesystem.properties.used,
    },
    children: props.filesystem.children,
});

async function fsConfigureBtn(filesystem) {
    quotaRefreservationSizeCheck;
    configureDataset(filesystem);
    datasets.value = [];
    await loadDatasets(datasets);
    showFSConfig.value = false;
}

const quotaRefreservationSizeCheck = () => {
	let result = true;
	sizeFeedback.value = '';

    if (fileSystemConfig.value.properties.quota.raw < fileSystemConfig.value.properties.refreservation?.raw!) {
        result = false;
        sizeFeedback.value = 'Refreservation cannot be greater than quota/available size.';
    }
	
	return result;
}

const getIdKey = (name: string) => `${name}`;
</script>