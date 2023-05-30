interface Dashboard {
  pools: Pool[];
  disks: Disk[];
}

interface Pool {
  name: string;
  vdevs: VirtualDevice[];
  sector: string;
  record: string;
  compression: boolean;
  deduplication: boolean;
  refreservation: number;
  autoExpand: boolean;
  autoReplace: boolean;
  autoTrim: boolean;
  forceCreate: boolean;
  fileSystem?: FileSystem;
  totalSize?: number;
  used?: number;
  free?: number;
  usagePercent?: number;
  status: string;
}

interface VirtualDevice {
  type: 'disk' | 'mirror' | 'raidz1' | 'raidz2' | 'raidz3' | 'cache' | 'log' | 'special';
  disks: Disk[];
  isPrimary: boolean;
  forceAdd: boolean;
}

interface Disk {
  name: string;
  type: 'hdd' | 'ssd' | 'm2nvme';
  totalSize?: number;
  used?: number;
  free?: number;
  usagePercent?: number;
}

interface FileSystem {
  name: string;
  encryption: boolean;
  passphrase: string?;
  inherit: boolean;
  accessTime: string;
  caseSensitivity: string;
  compression: string;
  deduplication: string;
  dNodeSize: string;
  extendedAttributes: string;
  recordSize: string;
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