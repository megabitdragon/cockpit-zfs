import subprocess
import json

# def check_zfs_labels(device_path):
#     try:
#         subprocess.check_output(['sudo', 'zdb', '-l', device_path])
#         return True
#     except subprocess.CalledProcessError:
#         return False

# def get_disk_pool_associations():
#     associations= {}
#     try:
#         result = subprocess.run(['zpool', 'status'], stdout=subprocess.PIPE)
#         current_pool = None

#         for line in result.stdout.splitlines():
#             if line.startswith('pool: '):
#                 current_pool = line.split(' ')[1]
#             elif line.startswith('  ') and current_pool:
#                 disk = line.strip().split()[0]
#                 if disk not in associations:
#                     associations[disk] = [current_pool]
#     except subprocess.CalledProcessError as e:
#         print(f"Error running 'zpool status': {e}")
#     return associations

def get_disk_info():
    # label,model,mountpoint,name,partuuid,phy-sec,rota,serial,size,type,uuid,vendor,wwn
    result = subprocess.run(['lsblk', ''])

def main():
    result = subprocess.run(['lsdev', '-jdHmtTsfcp'], stdout=subprocess.PIPE)

    json_data = json.loads(result.stdout)

    disks = []

    # disk_to_pool = get_disk_pool_associations()

    for row in json_data['rows']:
        for disk in row:
            if not disk['occupied']:
                continue

            partitions = int(disk['partitions'])

            device_path = disk['dev']

            # pools_for_disk = disk_to_pool.get(device_path, [])

            disks.append({
                'vdev_path': f'/dev/disk/by-vdev/{disk["bay-id"]}',
                'phy_path': disk['dev-by-path'],
                'sd_path': device_path,
                'name': disk['bay-id'],
                'model': disk['model-name'],
                'serial': disk['serial'],
                'capacity': disk['capacity'],
                'type': disk['disk_type'],
                'usable': True if partitions == 0 else False,
                'temp': disk['temp-c'],
                'health': disk['health'],
                'rotation_rate': disk['rotation-rate'],
                'power_on_count': disk['power-cycle-count'],
                'power_on_time': disk['power-on-time'],
                # 'has_zfs_labels': check_zfs_labels(device_path),
                # 'member of': pools_for_disk,
            })

    print(json.dumps(disks, indent=4))

if __name__ == '__main__':
    main()
