## zfs module 1.1.6-1

* Fixes issue with convertSizeToBytes function, which would give errors when creating vdevs with same size disks (incorrectly flagging as different sizes)