interface Pool {
  name: string;
  vdevs: VirtualDevice[];
  sector: string;
  record: string;
  compression: boolean;
  deduplication: boolean?;
  refreservation: number?;
  autoExpand: boolean?;
  autoReplace: boolean?;
  autoTrim: boolean?;
  forceCreate: boolean?;
  fileSystem: FileSystem?;
}

interface VirtualDevice {
  type: 'mirror' | 'raidz1' | 'raidz2' | 'raidz3' | 'cache' | 'log' | 'special';
  disks: DiskList[];
  forceAdd: boolean;
}

interface Disk {
  name: string;
}

interface DiskList {
  
}

interface FileSystem {
  name: string;
  encryption: boolean;
  passphrase: string?;
  inherit: boolean;
  accessTime: string?;
  caseSensitivity: string?;
  compression: string?;
  deduplication: string?;
  dNodeSize: string?;
  extendedAttributes: string?;
  recordSize: string?;
  quota: string;
  readOnly: boolean;
}

interface NavigationItem {
  name: string;
  tag: string;
  current: boolean;
  show: boolean;
}

type NavigationCallback = (item: NavigationItem) => void;

interface StepsNavigationItem {
  name: string;
  id: string;
  tag: string;
  current: boolean;
  status: string;
  show: boolean;
}

type StepNavigationCallback = (item: StepsNavigationItem) => void;