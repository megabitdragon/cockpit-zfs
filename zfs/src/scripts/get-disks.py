import subprocess
import json

def get_lsdev_disks():
    result = subprocess.run(['lsdev', '-jdHmtTsfcp'], stdout=subprocess.PIPE)
    if result.returncode != 0:
        return None  # Return None if lsdev command fails

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

def get_lsblk_disks(nvme_only=False):
    """Get all disks (or only NVMe disks if nvme_only=True) using lsblk JSON output and udevadm."""
    try:
        # Run lsblk with JSON output
        lsblk_result = subprocess.run(['lsblk', '-dnOpJ'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if lsblk_result.returncode != 0:
            # print("Error running lsblk:", lsblk_result.stderr.decode())
            return []
        
        lsblk_data = json.loads(lsblk_result.stdout.decode())
        disks = []
        
        for device in lsblk_data['blockdevices']:
            # Skip if nvme_only is True and device is not NVMe
            if nvme_only and 'nvme' not in device['name']:
                continue

            # Collect additional information using smartctl if available
            smartctl_data = get_smartctl_data(device['name'].split('/')[-1])  # Get only the device name, e.g., 'sda'

            # Get additional details using udevadm
            udevadm_result = subprocess.run(['udevadm', 'info', '--query=all', f'--name={device["name"]}'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            if udevadm_result.returncode != 0:
                # print(f"Error running udevadm on {device['name']}:", udevadm_result.stderr.decode())
                continue
            
            udevadm_output = udevadm_result.stdout.decode().split('\n')
            udev_info = {}
            for line in udevadm_output:
                if '=' in line:
                    key, value = line.split('=', 1)
                    udev_info[key.strip()] = value.strip()

            # Append the disk data to the list
            disks.append({
                'vdev_path': 'N/A',
                'phy_path': f'/dev/disk/by-path/{udev_info.get("E: ID_PATH", "unknown")}',
                'sd_path': device['name'],
                'name': device['name'].split('/')[-1],  # Device name, e.g., 'sda'
                'model': device.get('model', udev_info.get('E: ID_MODEL', 'Unknown')),
                'serial': device.get('serial', udev_info.get('E: ID_SERIAL_SHORT', 'Unknown')),
                'capacity': device['size'],
                'type': 'NVMe' if 'nvme' in device['name'] else device['type'].capitalize(),
                'usable': device['ro'] == '0',  # 'usable' based on read-only status
                'temp': f'{smartctl_data["temp"]}℃' if smartctl_data["temp"] is not None else 'Unknown',
                'health': "OK" if smartctl_data['health'] == 'PASSED' else "POOR",
                'rotation_rate': 0 if 'nvme' in device['name'] else (device['rota'] == '1'),
                'power_on_count': smartctl_data['power_cycle_count'],
                'power_on_time': smartctl_data['power_on_hours'],
                'has_partitions': 'E: ID_PART_TABLE_TYPE' in udev_info  # Check if partitions exist
            })

        # Debug output to show parsed data before returning
        # print("Parsed lsblk data:", json.dumps(disks, indent=4))
        return disks

    except Exception as e:
        # print("Exception in get_lsblk_disks:", str(e))
        return []

def get_smartctl_data(device):
    """Runs smartctl to get additional information like temperature, power-on time, and health status."""
    try:
        smartctl_result = subprocess.run(['smartctl', '-a', f'/dev/{device}'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if smartctl_result.returncode != 0:
            # print(f"Error running smartctl on {device}:", smartctl_result.stderr.decode())
            return {'temp': None, 'power_on_hours': None, 'power_cycle_count': None, 'health': None}

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

        # Debug output to show parsed smartctl data
        # print(f"smartctl data for {device}:", smart_info)
        return smart_info

    except Exception as e:
        print("Exception in get_smartctl_data:", str(e))
        return {'temp': None, 'power_on_hours': None, 'power_cycle_count': None, 'health': None}


def main():
    # Try to get disks with lsdev
    lsdev_disks = get_lsdev_disks()
    if lsdev_disks is not None:
        # If lsdev succeeded, get NVMe disks specifically
        nvme_disks = get_lsblk_disks(nvme_only=True)
        all_disks = lsdev_disks + nvme_disks
    else:
        # If lsdev failed, use lsblk to get all disks, including NVMe
        all_disks = get_lsblk_disks(nvme_only=False)

    print(json.dumps(all_disks, indent=4))

if __name__ == '__main__':
    main()

