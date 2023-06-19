import json
import libzfs
import argparse

from collections import defaultdict

def convert_topology(zfs, vdevs):
    topology = defaultdict(list)
    for vdev in vdevs:
        children = []
        for device in vdev['devices']:
            z_cvdev = libzfs.ZFSVdev(zfs, 'disk')
            z_cvdev.type = 'disk'
            z_cvdev.path = device
            children.append(z_cvdev)

        if vdev['type'] == 'STRIPE':
            topology[vdev['root'].lower()].extend(children)
        else:
            z_vdev = libzfs.ZFSVdev(zfs, 'disk')
            z_vdev.type = vdev['type'].lower()
            z_vdev.children = children
            topology[vdev['root'].lower()].append(z_vdev)
    return topology

def main():
    parser = argparse.ArgumentParser(description='Create a ZFS pool with a specified vdev topology')
    parser.add_argument('pool_name', type=str, help='Name of the ZFS pool')
    parser.add_argument('--vdev-topology', dest='vdev_topology', type=str, required=True, help='ZFS topology json object')

    args = parser.parse_args()

    pool_name = args.pool_name
    vdevs_raw = args.vdev_topology

    vdevs = json.loads(vdevs_raw)

    options = {
        'feature@lz4_compress': 'enabled',
        'altroot': '/mnt',
        'failmode': 'continue',
        'autoexpand': 'on',
        'ashift': 12,
    }

    fsoptions = {
        'atime': 'off',
        'aclmode': 'discard',
        'acltype': 'posix',
        'compression': 'lz4',
        'aclinherit': 'passthrough',
        'mountpoint': f'/{pool_name}',
    }

    with libzfs.ZFS() as zfs:
        topology = convert_topology(zfs, vdevs)
        try:
            zfs.create(pool_name, topology, options, fsoptions)

            print(json.dumps({ 'status': 'ok' }))
        except:
            print(json.dumps({ 'status': 'error' }))


if __name__ == '__main__':
    main()