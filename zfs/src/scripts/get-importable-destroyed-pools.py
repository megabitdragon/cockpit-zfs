import libzfs
import json


def main():
    with libzfs.ZFS() as zfs:
        z_pools = []

# Need to figure out how to get destroyed importable pools
        for p in zfs.find_import():
            pool = p.asdict()

            pool['scan']['start_time'] = str(pool['scan']['start_time'])
            pool['scan']['end_time'] = str(pool['scan']['end_time'])
            
            z_pools.append(pool)

    print(json.dumps(z_pools, indent=4))
if __name__ == '__main__':
    main()
