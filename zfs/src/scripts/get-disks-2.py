import subprocess
import json

def parse_zpool_status(output):
    pools = {}
    current_pool = None

    for line in output.splitlines():
        line = line.strip()  # Remove leading and trailing whitespace
        if line.startswith('pool: '):
            current_pool = line.split(' ')[1]
            pools[current_pool] = {'disks': {}}
        elif line.startswith('mirror-') and current_pool:
            parts = line.split()
            disk_name = parts[0]
            disk_state = parts[1]
            pools[current_pool]['disks'][disk_name] = disk_state

    return pools