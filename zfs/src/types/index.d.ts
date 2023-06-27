interface newVDev {
  root: string;
  type: string;
  devices: string[];
}

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
  }
  vdevs: vDevData[];
  settings?: {
    sector: string;
    record: string;
    compression: boolean;
    deduplication: boolean;
    refreservation: number;
    autoExpand: boolean;
    autoReplace: boolean;
    autoTrim: boolean;
    forceCreate: boolean;
  },
  createFileSystem?: boolean;
  fileSystem?: FileSystemData;
}

interface vDevData {
  name: string;
  type: string;
  status: string;
  guid: string;
  stats: {};
  disks: DiskData[];
  selectedDisks: string[];
  forceAdd?: boolean;
}

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
}

interface FileSystemData {
  name: string;
  id: string;
  mountpoint: string;
  pool: string;
  isEncrypted: boolean
  encrypted: string;
  cipher: string;
  passphrase: string?;
  key_loaded: string;
  type: string;
  inherit: boolean;
  properties: {
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
      size: string;
    };
    readOnly: string;
  }

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