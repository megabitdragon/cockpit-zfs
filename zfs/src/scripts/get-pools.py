import libzfs
import json

def main():
    with libzfs.ZFS() as zfs:
        z_pools = []

        for p in zfs.pools:
            pool = p.asdict()

            pool['root_dataset']['properties']['creation']['parsed'] = str(pool['root_dataset']['properties']['creation']['parsed'])

            for i in range(0, len(pool['root_dataset']['children'])):
                pool['root_dataset']['children'][i]['properties']['creation']['parsed'] = str(pool['root_dataset']['children'][i]['properties']['creation']['parsed'])

            z_pools.append(pool)

    print(json.dumps(z_pools))
if __name__ == '__main__':
    main()

