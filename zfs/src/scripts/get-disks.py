import subprocess
import json

def main():
    result = subprocess.run(['lsdev', '-jdmtsfcp'], stdout=subprocess.PIPE)

    json_data = json.loads(result.stdout)

    disks = []

    for row in json_data['rows']:
        for disk in row:
            if not disk['occupied']:
                continue

            disks.append({
                'vdev_path': f'/dev/disk/by-vdev/{disk["bay-id"]}',
                'phy_path': disk['dev-by-path'],
                'sd_path': disk['dev'],
                'name': disk['bay-id'],
                'model': disk['model-name'],
                'serial': disk['serial'],
                'capacity': disk['capacity'],
                'type': disk['disk_type'],
            })

    print(json.dumps(disks, indent=4))

if __name__ == '__main__':
    main()