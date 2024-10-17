import subprocess
import json

def get_lsdev_disks():
    result = subprocess.run(['lsdev', '-jdHmtTsfcp'], stdout=subprocess.PIPE)
    json_data = json.loads(result.stdout)

    disks = []
    for row in json_data['rows']:
        for disk in row:
            if not disk['occupied']:
                continue

            device_path = disk['dev']
            partitions = int(disk['partitions'])

            disks.append({
                'vdev_path': f'/dev/disk/by-vdev/{disk["bay-id"]}',
                'phy_path': disk['dev-by-path'],
                'sd_path': device_path,
                'name': disk['bay-id'],
                'model': disk['model-name'],
                'serial': disk['serial'],
                'capacity': disk['capacity'],
                'type': disk['disk_type'],
                'usable': True,
                'temp': disk['temp-c'],
                'health': disk['health'],
                'rotation_rate': disk['rotation-rate'],
                'power_on_count': disk['power-cycle-count'],
                'power_on_time': disk['power-on-time'],
                'has_partitions': False if partitions == 0 else True
            })
    return disks

def get_nvme_disks():
    # Get NVMe devices using lsblk and udevadm
    lsblk_result = subprocess.run(['lsblk', '-dno', 'NAME,SIZE'], stdout=subprocess.PIPE)
    lsblk_output = lsblk_result.stdout.decode().strip().split('\n')

    nvme_disks = []
    for line in lsblk_output:
        device_info = line.split()
        name, capacity = device_info[0], device_info[1]

        if 'nvme' not in name:
            continue

        # Get additional data using smartctl
        smartctl_data = get_smartctl_data(name)
        
        # Use udevadm to get more details about the NVMe device
        udevadm_result = subprocess.run(['udevadm', 'info', '--query=all', f'--name=/dev/{name}'], stdout=subprocess.PIPE)
        udevadm_output = udevadm_result.stdout.decode().split('\n')

        udev_info = {}
        for line in udevadm_output:
            if '=' in line:
                key, value = line.split('=', 1)
                udev_info[key.strip()] = value.strip()  # Strip any leading/trailing spaces

        nvme_disks.append({
            'vdev_path': 'N/A',
            'phy_path': f'/dev/disk/by-path/{udev_info.get("E: ID_PATH")}',  # Physical path from ID_PATH
            'sd_path': f'/dev/{name}',  # Device path
            'name': name,  # Device name, e.g., nvme0n1
            'model': udev_info.get('E: ID_MODEL', 'Unknown'),  # Model name
            'serial': udev_info.get('E: ID_SERIAL_SHORT', 'Unknown'),  # Serial number
            'capacity': capacity,  # Capacity from lsblk
            'type': 'NVMe',  # NVMe type
            'usable': True,  # Assuming the device is usable if detected
            'temp': f'{smartctl_data["temp"]}℃',  # Temperature from smartctl
            'health': "OK" if smartctl_data['health'] == 'PASSED' else "POOR",  # Health status from smartctl
            'rotation_rate': 0,
            'power_on_count': smartctl_data['power_cycle_count'],  # Power cycle count from smartctl
            'power_on_time': smartctl_data['power_on_hours'],  # Power-on time from smartctl
            'has_partitions': 'E: ID_PART_TABLE_TYPE' in udev_info  # Check if partitions exist
        })

    return nvme_disks

def get_smartctl_data(device):
    """Runs smartctl to get additional information like temperature, power-on time, and health status."""
    smartctl_result = subprocess.run(['smartctl', '-a', f'/dev/{device}'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output = smartctl_result.stdout.decode().split('\n')

    smart_info = {
        'temp': None,
        'power_on_hours': None,
        'power_cycle_count': None,
        'health': None
    }

    for line in output:
        if 'Temperature' in line and 'Celsius' in line:
            smart_info['temp'] = int(line.split()[-2])  # Extract temperature
        elif 'Power On Hours' in line:
            smart_info['power_on_hours'] = int(line.split()[-1])  # Extract power-on hours
        elif 'Power Cycle Count' in line:
            smart_info['power_cycle_count'] = int(line.split()[-1])  # Extract power cycle count
        elif 'SMART overall-health' in line:
            smart_info['health'] = line.split(':')[-1].strip()  # Extract health status

    return smart_info


def main():
    lsdev_disks = get_lsdev_disks()

    nvme_disks = get_nvme_disks()

    # Combine the lists
    all_disks = lsdev_disks + nvme_disks

    print(json.dumps(all_disks, indent=4))

if __name__ == '__main__':
    main()
