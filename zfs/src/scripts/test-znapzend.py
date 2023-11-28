import subprocess
import re
import time

def send_recv_snapshots(self, src_dataset, dst_dataset, dst_name, mbuffer, mbuffer_size, snap_filter=None,
                        last_snapshot_to_see=None, allow_dest_rollback=None):
    recv_opt = ['-u'] if self.recvu else []
    if allow_dest_rollback:
        recv_opt.append('-F')
    incr_opt = '-i' if self.skip_intermediates else '-I'
    send_opt = ['-Lce'] if self.compressed else []
    if self.send_raw:
        send_opt.append('-w')
    if self.resume:
        recv_opt.append('-s')
    remote, dst_data_set_path = split_host_data_set(dst_dataset)
    last_snapshot, last_common, dst_snap_count = last_and_common_snapshots(
        src_dataset, dst_dataset, snap_filter, last_snapshot_to_see)
    if last_snapshot_to_see:
        print(f"sendRecvSnapshots() : for srcDataSet='{src_dataset}' srcDataSet='{src_dataset}' "
              f"snapFilter='{snap_filter}' lastSnapshotToSee='{last_snapshot_to_see}' "
              f"GOT: lastSnapshot='{last_snapshot}' "
              f"lastCommon='{last_common}' "
              f"dstSnapCount='{dst_snap_count}'")
    snapshot_synced = {
        dst_name: dst_data_set_path,
        f'{dst_name}_synced': 1
    }
    if not last_snapshot:
        return 1
    if last_common and last_snapshot == last_common:
        set_snapshot_properties(last_common, snapshot_synced)
        return 1
    if not last_common and dst_snap_count:
        if allow_dest_rollback == 2:
            print('WARNING: snapshot(s) exist on destination, but '
                  'no common found on source and destination: was requested '
                  'to clean up destination ' + dst_dataset + ' (i.e. destroy '
                  'existing snapshots that match the znapzend filter)')
            destroy_snapshots(list_snapshots(dst_dataset, snap_filter))
            last_snapshot, last_common, dst_snap_count = last_and_common_snapshots(
                src_dataset, dst_dataset, re.compile('.*'), last_snapshot_to_see)
            dst_snap_count_all = len(list_snapshots(dst_dataset, re.compile('.*')))
            if not last_common and dst_snap_count_all > 0:
                print('ERROR: some snapshot(s) not covered '
                      'by znapzend filter still exist on destination: '
                      'this should be judged and fixed by the sysadmin '
                      '(i.e. destroy manually named snapshots); '
                      'the zfs send+receive would likely fail below!')
        else:
            raise Exception('ERROR: snapshot(s) exist on destination, but '
                            'no common found on source: ' + src_dataset + ' and destination: ' + dst_dataset +
                            ' clean up destination ' + dst_dataset + ' (i.e. destroy existing snapshots)')
    mbuffer, mbuffer_port = mbuffer.split(':', 1) if mbuffer else (None, None)
    cmd = []

    # ####################################
    if last_common:
        cmd.append([self.priv, 'zfs', 'send'] + send_opt + [incr_opt, last_common, last_snapshot])
    else:
        cmd.append([self.priv, 'zfs', 'send'] + send_opt + [last_snapshot])
    # ####################################

    if remote and mbuffer_port and mbuffer != 'off':
        recv_pid = None
        recv_cmd = build_remote_ref_array(remote, [mbuffer] + self.mbuffer_param +
                                         [mbuffer_size, '-4', '-I', mbuffer_port],
                                         [self.priv, 'zfs', 'recv'] + recv_opt + [dst_data_set_path])
        cmd_str = ' '.join(recv_cmd)
        print("# " + ("WOULD # " if self.noaction else "") + cmd_str) if self.debug else None
        if not self.noaction:
            recv_proc = subprocess.Popen(recv_cmd, stderr=subprocess.PIPE)
            recv_pid = recv_proc.pid
        print(f"receive process on {remote} spawned ({recv_pid})")
        cmd.append([mbuffer] + self.mbuffer_param + [mbuffer_size, '-O', f"{remote}:{mbuffer_port}"])
        cmd_str = ' '.join(cmd)
        print("# " + ("WOULD # " if self.noaction else "") + cmd_str) if self.debug else None
        if not self.noaction:
            retry_counter = int(self.connect_timeout / self.send_delay) + 1
            while retry_counter > 0:
                time.sleep(self.send_delay)
                if subprocess.call(cmd) == 0:
                    break
                retry_counter -= 1
            if retry_counter <= 0:
                raise Exception(f"ERROR: cannot send snapshots from {src_dataset} to {dst_data_set_path}"
                                + (f" on {remote}" if remote else ''))
    else:
        mb_cmd = [mbuffer] + self.mbuffer_param + [mbuffer_size] if mbuffer != 'off' else []
        recv_cmd = [self.priv, 'zfs', 'recv'] + recv_opt + [dst_data_set_path]
        cmd.extend(build_remote_ref_array(remote, mb_cmd + recv_cmd))
        cmd_str = ' '.join(cmd)
        print("# " + ("WOULD # " if self.noaction else "") + cmd_str) if self.debug else None
        if not self.noaction:
            if subprocess.call(cmd) != 0:
                raise Exception(f"ERROR: cannot send snapshots from {src_dataset} to {dst_data_set_path}"
                                + (f" on {remote}" if remote else ''))
    set_snapshot_properties(last_snapshot, snapshot_synced)
    return 1

def split_host_data_set(data_set):
    parts = data_set.split('@')
    if len(parts) == 1:
        return None, parts[0]
    elif len(parts) == 2:
        return parts[0], parts[1]
    else:
        raise ValueError("Invalid dataset format: " + data_set)
    
def last_and_common_snapshots(self, src_data_set, dst_data_set, snapshot_filter=None, last_snapshot_to_see=None):
        if snapshot_filter is None:
            snapshot_filter = re.compile('.*')
        if last_snapshot_to_see is not None:
            if last_snapshot_to_see == "":
                last_snapshot_to_see = None
            else:
                last_snapshot_to_see = re.sub(r'^.*@', '', last_snapshot_to_see)
        src_snapshots = self.list_snapshots(src_data_set, snapshot_filter, last_snapshot_to_see)
        dst_snapshots = self.list_snapshots(dst_data_set, snapshot_filter, last_snapshot_to_see)
        if not src_snapshots:
            return (None, None, None)
        i = len(src_snapshots) - 1
        snap_name = None
        while i >= 0:
            snap_name = re.match(f'^{re.escape(src_data_set)}@({snapshot_filter.pattern})', src_snapshots[i])
            if snap_name and any(re.search(fr'@{re.escape(snap_name.group(1))}$', snap) for snap in dst_snapshots):
                break
            i -= 1
        return (
            src_snapshots[-1] if src_snapshots else None,
            src_snapshots[i] if i >= 0 and any(re.search(fr'@{re.escape(snap_name.group(1))}$', snap) for snap in dst_snapshots) else None,
            len(dst_snapshots)
        )

def most_recent_common_snapshot(self, src_data_set, dst_data_set, dst_name, snapshot_filter=None, recurse=False, inherit=None):
    if snapshot_filter is None or not snapshot_filter:
        snapshot_filter = re.compile('.*')
    if inherit is None:
        inherit = InheritLevels()
        inherit.zfs_local = True
        inherit.zfs_inherit = True
        inherit.snapshot_recurse_parent = True
    last_snapshot, last_common_snapshot, dst_snap_count = None, None, None
    try:
        last_snapshot, last_common_snapshot, dst_snap_count = self.last_and_common_snapshots(src_data_set, dst_data_set, snapshot_filter)[1]
    except Exception as e:
        if isinstance(e, MojoException):
            self.zLog.warn(e.message)
        else:
            self.zLog.warn(e)
    if not last_common_snapshot:
        dst_synced_propname = f'{dst_name}_synced'
        dst_synced_props = [dst_synced_propname, dst_name]
        src_snapshots = self.list_snapshots(src_data_set, snapshot_filter)
        i = len(src_snapshots) - 1
        while i >= 0:
            snapshot = src_snapshots[i]
            properties = self.get_snapshot_properties(snapshot, recurse, inherit, *dst_synced_props)
            if properties.get(dst_name) == dst_data_set and properties.get(dst_synced_propname):
                last_common_snapshot = snapshot
                break
            i -= 1
    return last_common_snapshot

def set_snapshot_properties(snapshot, properties):
    # Implement your logic to set snapshot properties here
    pass
def destroy_snapshots(snapshots):
    # Implement your logic to destroy snapshots here
    pass
def list_snapshots(dataset, snap_filter):
    # Implement your logic to list snapshots here
    pass
def build_remote_ref_array(remote, cmd1, cmd2):
    # Implement your logic to build the remote reference array here
    pass

# Usage example
send_recv_snapshots(self, "source_pool/source_dataset", "destination_pool/destination_dataset",
                    "dstName", "mbuffer_config", "mbuffer_size", snap_filter=re.compile('.*'),
                    last_snapshot_to_see=None, allow_dest_rollback=None)

class InheritLevels:
    def __init__(self):
        self.zfs_local = False
        self.zfs_inherit = False
        self.snapshot_recurse_parent = False