import { legacy } from '@45drives/houston-common-lib';
// @ts-ignore
import script_py from "../scripts/get-disks.py?raw";


//['/usr/bin/env', 'python3', '-c', script, ...args ]
const {errorString, useSpawn } = legacy;

export async function getDisks() {
  try {
    // Ensure useSpawn is properly defined and invoked
	
    const spawnState = useSpawn(['/usr/bin/env', 'python3', '-c', script_py], { superuser: 'try' });
	console.debug('Spawn state:', spawnState);
	
    // Check if spawnState is valid
    if (!spawnState || !spawnState.promise) {
      throw new Error('Failed to initialize spawnState or promise is undefined');
    }

    // Await the promise and retrieve disks
    const result = await spawnState.promise();
	console.log(result.stdout)
    return result.stdout;
  } catch (error) {
    console.error('Error in getDisks:', error.message);
    throw new Error(error.message); // Propagate the error to the caller
  }
}


export async function clearPartitions(disk) {
    try {
        const state = useSpawn(['wipefs', '-a', '/dev/' + disk.name]);
        const output = await state.promise();
        console.log(output)
        return output.stdout;
      } catch (state) {
		const errorMessage = errorString(state);
		console.error(errorMessage);
		return { error: errorMessage };
      }
}

export async function labelClear(disk) {
    try {
		const cmdString = ['zpool', 'labelclear'];
		cmdString.push(disk.name);

		console.log('****\ncmdstring:\n', ...cmdString, "\n****");

		const state = useSpawn(cmdString);
        const output = await state.promise();
        console.log(output)
        return output.stdout;
      } catch (state) {
		const errorMessage = errorString(state);
		console.error(errorMessage);
		return { error: errorMessage };
      }
}

export async function attachDisk(diskVDevPoolData) {
	try {
		let cmdString = ['zpool', 'attach'];

		if (diskVDevPoolData.forceAttach) {
			cmdString.push('-f');
		}
		cmdString.push(diskVDevPoolData.poolName);
		//cmdString.push(diskVDevPoolData.vDevName);
		cmdString.push(diskVDevPoolData.existingDiskName);
		cmdString.push(diskVDevPoolData.newDiskName);

		console.log('****\ncmdstring:\n', ...cmdString, "\n****");

		const state = useSpawn(cmdString);
		const output = await state.promise();
		console.log(output)
		return output.stdout;
	} catch (state) {
		const errorMessage = errorString(state);
		console.error(errorMessage);
		return { error: errorMessage };
	}
}

export async function detachDisk(poolName, diskName) {
	try {
		let cmdString = ['zpool', 'detach'];

		cmdString.push(poolName);
		cmdString.push(diskName);

		console.log('****\ncmdstring:\n', ...cmdString, "\n****");

		const state = useSpawn(cmdString);
		const output = await state.promise();
		console.log(output)
		return output.stdout;
	} catch (state) {
		const errorMessage = errorString(state);
		console.error(errorMessage);
		return { error: errorMessage };
	}
}

export async function offlineDisk(poolName, diskName, forceFault, temporary) {
	try {
		let cmdString = ['zpool', 'offline'];
		//force fault, instead of offlining disk it is placed into faulted state (-f)
		//temporary, upon reboot the device returns to prev state (-t)
		if (forceFault) {
			cmdString.push('-f');
		}

		if (temporary) {
			cmdString.push('-t');
		}

		cmdString.push(poolName);
		cmdString.push(diskName);

		console.log('****\ncmdstring:\n', ...cmdString, "\n****");

		const state = useSpawn(cmdString);
		const output = await state.promise();
		console.log(output)
		return output.stdout;
	} catch (state) {
		const errorMessage = errorString(state);
		console.error(errorMessage);
		return { error: errorMessage };
	}
}

export async function onlineDisk(poolName, diskName, expand) {
	try {
		let cmdString = ['zpool', 'online'];
		//expand the device to use all available space (-e)
	
		if (expand) {
			cmdString.push('-e');
		}

		cmdString.push(poolName);
		cmdString.push(diskName);

		console.log('****\ncmdstring:\n', ...cmdString, "\n****");

		const state = useSpawn(cmdString);
		const output = await state.promise();
		console.log(output)
		return output.stdout;
	} catch (state) {
		const errorMessage = errorString(state);
		console.error(errorMessage);
		return { error: errorMessage };
	}
}

export async function replaceDisk(poolName, diskName, newDiskName, forceReplace?) {
	try {
		let cmdString = ['zpool', 'replace'];

		if (forceReplace) {
			cmdString.push('-f');
		}

		// cmdString.push('-w');
		
		cmdString.push(poolName);
		cmdString.push(diskName);
		cmdString.push(newDiskName);

		console.log('****\ncmdstring:\n', ...cmdString, "\n****");

		const state = useSpawn(cmdString);
		const output = await state.promise();
		console.log(output)
		return output.stdout;
	} catch (state) {
		const errorMessage = errorString(state);
		console.error(errorMessage);
		return { error: errorMessage };
	}
}

export async function trimDisk(poolName : string, diskName : string, isSecure? : boolean, action? : string) {
	try {
		let cmdString = ['zpool', 'trim'];

		if (isSecure) {
			cmdString.push('-d');
		}
		//wait to finish before returning (remove?)
		// cmdString.push('-w');

		if(action === 'pause') {
			cmdString.push('-s');
		}

		if(action === 'stop') {
			cmdString.push('-c');
		}

		cmdString.push(poolName);
		cmdString.push(diskName);

		console.log('****\ncmdstring:\n', ...cmdString, "\n****");

		const state = useSpawn(cmdString);
		const output = await state.promise();
		console.log(output)
		return output.stdout;
	} catch (state) {
		const errorMessage = errorString(state);
		console.error(errorMessage);
		return { error: errorMessage };
	}
}