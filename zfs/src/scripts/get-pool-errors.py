import libzfs
import json

def main():

    with libzfs.ZFS() as zfs:
        z_pools = {}

        for p in zfs.pools:
            pool = p.asdict()
        
                
    print(json.dumps(z_pools, indent=4))
    
if __name__ == '__main__':
    main()