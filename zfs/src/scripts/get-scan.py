
import sys
import libzfs
import json

def main():
    if len(sys.argv) != 2:
        print("error")

    poolName = sys.argv[1]

    with libzfs.ZFS() as zfs:
        z_pools = {}

        for p in zfs.pools:
            if p.name == poolName:
                pool = p.asdict()
                pool['scan']['start_time'] = str(pool['scan']['start_time'])
                pool['scan']['end_time'] = str(pool['scan']['end_time'])
                pool['scan']['pause'] = str(pool['scan']['pause'])
                pool['scan']['name'] = pool['name']

                z_pools = pool['scan']
                
    print(json.dumps(z_pools, indent=4))
    
if __name__ == '__main__':
    main()
