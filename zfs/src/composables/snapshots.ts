import { useSpawn, errorString } from '@45drives/cockpit-helpers';
// @ts-ignore
import get_snapshots_script from "../scripts/get-snapshots.py?raw";
// @ts-ignore
import send_dataset_script from "../scripts/send-dataset.py?raw";

//['/usr/bin/env', 'python3', '-c', script, ...args ]

export async function getSnapshots() {
    try {
        const state = useSpawn(['/usr/bin/env', 'python3', '-c', get_snapshots_script], { superuser: 'try' });
        const snapshots = (await state.promise()).stdout;
        return snapshots;
    } catch (state) {
        console.error(errorString(state));
        return null;
    }
}

export async function createSnapshot(newSnap : NewSnapshot) {
    try {
        let cmdString = ['zfs', 'snapshot'];

        if (newSnap.snapChildren) {
            cmdString.push('-r');
        }

        cmdString.push(newSnap.filesystem + '@' + newSnap.name);

        console.log("****create cmdString: *****\n" , cmdString);
			
        const state = useSpawn(cmdString);
        const output = await state.promise();
        console.log(output)
        return output.stdout;
    } catch (state) {
        console.error(errorString(state));
    }
}

export async function destroySnapshot(snapshot, destroyChildrenSameName, destroyAllChildren) {
    try {
        let cmdString = ['zfs', 'destroy'];

        if (destroyChildrenSameName) {
            cmdString.push('-r');
        }

        if (destroyAllChildren) {
            cmdString.push('-R');
        }

        cmdString.push(snapshot.name)

        console.log("****create cmdString: *****\n" , cmdString);
			
        const state = useSpawn(cmdString);
        const output = await state.promise();
        console.log(output)
        return output.stdout;
    } catch (state) {
        console.error(errorString(state));
    }
}

export async function rollbackSnapshot(snapshot, destroyNewerSnaps, destroyAllNewer) {
    try {
        let cmdString = ['zfs', 'rollback'];

        if (destroyNewerSnaps) {
            cmdString.push('-r');
        }

        if (destroyAllNewer) {
            cmdString.push('-R');
        }

        cmdString.push(snapshot.name)

        console.log("****create cmdString: *****\n" , cmdString);
			
        const state = useSpawn(cmdString);
        const output = await state.promise();
        console.log(output)
        return output.stdout;
    } catch (state) {
        console.error(errorString(state));
    }
}

export async function renameSnapshot(snapshotName, newName, renameChildren?) {
    try {
        let cmdString = ['zfs', 'rename'];

        if (renameChildren) {
            cmdString.push('-r');
        }

        cmdString.push(snapshotName);
        cmdString.push(newName);

        console.log("****create cmdString: *****\n" , cmdString);
			
        const state = useSpawn(cmdString);
        const output = await state.promise();
        console.log(output)
        return output.stdout;
    } catch (state) {
        console.error(errorString(state));
    }
}


export async function cloneSnapshot(snapName, newParentFS, cloneName, createParent?) {
    try {
        let cmdString = ['zfs', 'clone'];

        if (createParent) {
            cmdString.push('-p');
        }

        cmdString.push(`${snapName}`);
        cmdString.push(`${newParentFS}/${cloneName}`);

        console.log("****create cmdString: *****\n" , cmdString);
			
        const state = useSpawn(cmdString);
        const output = await state.promise();
        console.log(output)
        return output.stdout;
    } catch (state) {
        console.error(errorString(state));
    }
}

export async function sendSnapshot(sendingData : SendingDataset) {
	try {
        console.log('sendingData (snapshots.ts):', sendingData);

		const state = useSpawn(['/usr/bin/env', 'python3', '-c', send_dataset_script, sendingData.sendName, sendingData.recvName, sendingData.sendIncName!, sendingData.sendOpts.forceOverwrite!, sendingData.sendOpts.compressed, sendingData.sendOpts.raw, sendingData.recvHost, sendingData.recvPort, sendingData.recvHostUser, sendingData.recvHostPass], { superuser: 'try', stderr: 'out'});

		const output = await state.promise();
		console.log(output);
		return output.stdout;
	} catch (state) {
		console.error(errorString(state));
		return null;
	}
}

/*

function getHostnamePromise() {
    return new Promise((resolve, reject) => {
        const state = useSpawn(['hostname'], { superuser: 'try' });
        state.promise()
            .then(({stdout}) => resolve(stdout))
            .catch(state => {
                console.error(errorString(state))
                reject(null);
            });
    });
}

*/

export async function getSendProgress(sendingData : SendingDataset) {
    try {
        const cmdString = ['/usr/bin/env', 'python3', '-c', send_dataset_script, sendingData.sendName, sendingData.recvName, sendingData.sendIncName!, sendingData.sendOpts.forceOverwrite!, sendingData.sendOpts.compressed, sendingData.sendOpts.raw];
    
        const state = useSpawn(cmdString, { superuser: 'try' });
        const sendProgress = (await state.promise()).stdout;
        return sendProgress;
    } catch (state) {
        console.error(errorString(state));
        return null;
    }
}

export async function loadSendProgress(sendingData : SendingDataset) {
    try {
        const rawJSON = await getSendProgress(sendingData);
        const parsedJSON = JSON.parse(rawJSON);
        console.log('Send Progress:', parsedJSON);
    } catch (error) {
        console.error("An error occurred getting send progress:", error);
    }
}