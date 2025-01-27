import { ref, Ref } from 'vue';
import { DiskData, legacy, vDevData } from '@45drives/houston-common-lib';
const { errorString, useSpawn } = legacy;
//object for pool
interface basePoolData{
	name: string;
	vdevs: vDevData[];
}

interface basevDevData{
	type: string;
	disks: DiskData[];

}
interface baseDiskData{
	name: string;
	capacity: string;
	model: string;
	guid: string;
	type: string;
	health: string;
	stats: Record<string, any>;
	path: string;
	phy_path: string;
	sd_path: string;
	vdev_path: string;
	serial: string;
	temp: string;
	powerOnCount: string;
	powerOnHours: number;
	rotationRate: number;
}
interface PoolData extends basePoolData {
	status: string;
	guid: string;
	properties: {
		rawsize: number;
		size: string;
		capacity: number;
		allocated: string;
		free: string;
		readOnly: boolean;
		sector: string;
		record: string;
		compression: boolean;
		deduplication: boolean;
		refreservationPercent?: number;
		refreservationRawSize?: number;
		autoExpand: boolean;
		autoReplace: boolean;
		autoTrim: boolean;
		available: number;
		forceCreate?: boolean;
		delegation?: boolean;
		listSnapshots?: boolean;
		// multiHost?: boolean;
		health?: string;
		altroot?: string;
		upgradable?: boolean;
	}
	createFileSystem?: boolean;
	fileSystem?: FileSystemData;
	datasets?: Dataset[];
	errors?: string[];
	statusCode: string | null;
	statusDetail: string | null;
	comment?: string;
	failMode?: 'wait' | 'continue' | 'panic';
	diskType?: 'SSD' | 'HDD' | 'Hybrid';
	scan?: PoolScanObject;
	diskIdentifier?: DiskIdentifier;
	errorCount: number;
}
const newVDevData = ref<newVDevData>({
	type: '',
	disks: [],
	isMirror: false,
});


const newPoolDisks = ref<string[]>([]);
const newVDevs = ref<newVDevData[]>([]);
//Function to run command to create new Pool
export async function newPool(pool: basePoolData | newPoolData): Promise<any> {
	try {
	  // Reset vdevs and pool disks
	   newVDevs.value = [];
	   newPoolDisks.value = [];
  
	  // Initialize base command
	  let cmdString = ['zpool', 'create'];
  
	  // Add common options
	  cmdString.push('-O', 'aclinherit=passthrough');
	  cmdString.push('-O', 'acltype=posixacl');
	  cmdString.push('-O', 'casesensitivity=sensitive');
	  cmdString.push('-O', 'normalization=formD');
	  cmdString.push(pool.name);
  
	  // Handle newPoolData-specific properties
	  if (isNewPoolData(pool)) {
		cmdString.push(
		  '-o', 'ashift=' + pool.sectorsize,
		  '-o', 'autoexpand=' + pool.autoexpand,
		  '-o', 'autoreplace=' + pool.autoreplace,
		  '-o', 'autotrim=' + pool.autotrim,
		  '-O', 'compression=' + pool.compression,
		  '-O', 'recordsize=' + pool.recordsize,
		  '-O', 'sharenfs=off',
		  '-O', 'sharesmb=off',
		  '-O', 'utf8only=on',
		  '-O', 'xattr=sa',
		  '-O', 'dedup=' + pool.dedup
		);
  
		if (pool.forceCreate) {
		  cmdString.push('-f');
		}
	  }
  
	  // Add vdevs and disks
	  pool.vdevs.forEach(vDev => {
		if (vDev.type !== 'disk') {
		  if (vDev.isMirror && (vDev.type === 'special' || vDev.type === 'dedup' || vDev.type === 'log')) {
			cmdString.push(vDev.type, 'mirror', ...vDev.disks);
		  } else {
			cmdString.push(vDev.type, ...vDev.disks);
		  }
		} else {
		  vDev.disks.forEach(disk => {
			if (!newPoolDisks.value.includes(disk)) {
			  newPoolDisks.value.push(disk);
			}
		  });
		}
	  });
  
	  if (newPoolDisks.value.length > 0) {
		cmdString.push(...newPoolDisks.value);
	  }
  
	  newVDevs.value.forEach(vDev => {
		if (vDev.isMirror) {
		  cmdString.push(vDev.type, 'mirror', ...vDev.disks);
		} else {
		  cmdString.push(vDev.type, ...vDev.disks);
		}
	  });
  
	  console.log('****\ncmdstring:\n', ...cmdString, "\n****");
  
	  // Spawn process to execute command
	  const state = useSpawn(cmdString);
	  const output = await state.promise();
	  console.log(output);
	  return output.stdout;
	} catch (state) {
	  const errorMessage = errorString(state);
	  console.error(errorMessage);
	  return { error: errorMessage };
	}
  }
  
  // Type guard to check if pool is newPoolData
  function isNewPoolData(pool: basePoolData | newPoolData): pool is newPoolData {
	return 'sectorsize' in pool && 'compression' in pool;
  }

  export async function addVDev(pool, vdev) {
    try {
      let cmdString = ['zpool', 'add'];
  
      if (vdev.forceAdd) {
        cmdString.push('-f');
      }
  
      cmdString.push(pool.name);
      if (vdev.type != 'disk') {
        cmdString.push(vdev.type);
      }
  
      if (vdev.isMirror) {
        cmdString.push('mirror');
      }
      
      //console.log('vdev.disks', vdev.disks);
      vdev.disks.forEach(disk => {
        //console.log(disk);
        cmdString.push(disk);
      });
  
      console.log('****\ncmdstring:\n', ...cmdString, "\n****");
  
      const state = useSpawn(cmdString);
      const output = await state.promise();
  
      console.log(output);
      return output.stdout;
  
    } catch (state) {
      // console.error(errorString(state));
      // return null;
      const errorMessage = errorString(state);
      console.error(errorMessage);
      return { error: errorMessage };
    }
  }
  