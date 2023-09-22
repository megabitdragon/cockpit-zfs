import { useSpawn, errorString } from '@45drives/cockpit-helpers';
// @ts-ignore
import get_snapshots_script from "../scripts/get-snapshots.py?raw";

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

export async function renameSnapshot(snapshot, ) {
    try {
        let cmdString = ['zfs', 'rename'];

        // if (destroyChildrenSameName) {
        //     cmdString.push('-r');
        // }

        // if (destroyAllChildren) {
        //     cmdString.push('-R');
        // }

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


export async function cloneSnapshot(snapshot, ) {
    try {
        let cmdString = ['zfs', 'clone'];

        // if (destroyChildrenSameName) {
        //     cmdString.push('-r');
        // }

        // if (destroyAllChildren) {
        //     cmdString.push('-R');
        // }

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


