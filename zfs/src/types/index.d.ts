//object for create-pools.py
interface newVDev {
	root: string;
	type: string;
	devices: string[];
}

//object for pool
interface PoolData {
	name: string;
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
		forceCreate?: boolean;
		delegation?: boolean;
		displaySnapshots?: boolean;
		multiHost?: boolean;
	}
	vdevs: vDevData[];
	createFileSystem?: boolean;
	fileSystem?: FileSystemData;
	datasets?: Dataset[];
	errors?: string[];
	comment?: string;
	failMode?: 'wait' | 'continue' | 'panic';
	diskType?: 'SSD' | 'HDD' | 'Hybrid';
}

interface PoolEditConfig {
	name: string;
	readonly: string;
	guid: string;
	ashift?: string;
	failmode?: string;
	comment?: string;
	autoexpand?: string;
	autoreplace?: string;
	autotrim?: string;
	multihost?: string;
	delegation?: string;
	listsnapshots?: string;
}

//pool object for creating new pool command
interface newPoolData {
	name: string;
	vdevs: newVDevData[];
	autoexpand: string;
	autoreplace: string;
	autotrim: string;
	compression: string;
	recordsize: number;
	sectorsize: number;
	dedup: string;
	forceCreate?: boolean;
	refreservationPercent: number;
}

interface newVDevData {
	type: string;
	disks: string[];
	isMirror?: boolean;
	forceAdd?: boolean;
}

//object for vdev
interface vDevData {
	name: string;
	type: 'disk' | 'mirror' | 'raidz1' | 'raidz2' | 'raidz3' | 'cache' | 'log' | 'dedup' | 'special' | 'spare';
	status: string;
	guid: string;
	stats: {};
	disks: DiskData[];
	selectedDisks: string[];
	forceAdd?: boolean;
	poolName?: string;
	isMirror?: boolean;
	diskType?: 'SSD' | 'HDD' | 'Hybrid';
}

//object for disk
interface DiskData {
	name: string;
	capacity: string;
	model: string;
	guid: string;
	type: string;
	status: string;
	stats: {};
	path: string;
	phy_path: string;
	sd_path: string;
	vdev_path: string;
	serial: string;
	usable: boolean;
	temp: string;
	powerOnCount: string;
	powerOnHours: number;
	rotationRate: number;
	vDevName?: string;
	poolName?: string;
}

//object for filesystem
interface FileSystemData {
	name: string;
	id: string;
	mountpoint: string;
	pool: string;
	encrypted: boolean;
	key_loaded: string;
	type: string;
	inherit: boolean;
	passphrase?: string;
	properties: {
		guid: string;
		encryption: string;
		accessTime: string;
		caseSensitivity: string;
		compression: string;
		deduplication: string;
		dNodeSize: string;
		extendedAttributes: string;
		recordSize: string;
		quota: {
			raw: number;
			value: string;
			unit: 'kib' | 'mib' | 'gib' | 'tib';
		}
		isReadOnly?: boolean;
		readOnly: string;
		available: number;
		creation: string;
		snapshotCount: string;
		mounted: string;
		usedbyRefreservation: string;
		usedByDataset: string;
		canMount?: string;
		aclInheritance?: string;
		aclType?: string;
		checksum?: string;
		refreservation?: {
			raw: number;
			value: string;
			unit: 'kib' | 'mib' | 'gib' | 'tib';
		}
		used: number;
	},
	children?: FileSystemData[];
	parentFS?: string;
}

interface FileSystemEditConfig {
	name: string;
	guid: string;
	casesensitivity: string;
	readonly?: string;
	mountpoint?: string;
	canmount?: string;
	atime?: string;
	record?: string;
	aclinherit?: string;
	acltype?: string;
	dedup?: string;
	compression?: string;
	checksum?: string;
	dnodesize?: string;
	xattr?: string;
	quota?: number;
	refreservation?: number;
	// quota?:{
	// 	raw: number;
	// 	value: string;
	// 	unit: 'kib' | 'mib' | 'gib' | 'tib';
	// }
	// refreservation?: {
	// 	raw: number;
	// 	value: string;
	// 	unit: 'kib' | 'mib' | 'gib' | 'tib';
	// }
}

//dataset command data object
interface NewDataset {
	name: string;
	parent: string;
	encrypted: boolean;
	encryption?: string;
	atime: string;
	casesensitivity: string;
	compression: string;
	dedup: string;
	dnodesize: string;
	xattr: string;
	recordsize: string;
	quota: string;
	readonly: string;
}

//object for snapshots
interface Snapshot {
	name: string;
	id: string;
	snapName: string;
	dataset: string;
	pool: string;
	mountpoint: string;
	type: string;
	properties: {
		clones: string;
		creation: {
			rawTimestamp: string;
			parsed: string;
			value: string;
		}
		referenced: {
			value: string;
			rawNum: number;
		}
		used: {
			value: string;
			rawNum: number;
		}
	}
	holds: {}
}

interface NewSnapshot {
	filesystem: string;
	isCustomName: boolean;
	name: string;
	options: {
		snapFileSystems: boolean;
	}
}

//object for navigation (generic)
interface NavigationItem {
	name: string;
	tag: string;
	current: boolean;
	show: boolean;
}

type NavigationCallback = (item: NavigationItem) => void;

//object for navigation in wizard
interface StepsNavigationItem {
	name: string;
	id: string;
	tag: string;
	current: boolean;
	status: string;
	show: boolean;
}

type StepNavigationCallback = (item: StepsNavigationItem) => void;