import libzfs
import json
import logging
from logging.handlers import RotatingFileHandler

# Configure rotating log handler
log_file = '/var/log/cockpit_zfs_getpools.log'
handler = RotatingFileHandler(log_file, maxBytes=5 * 1024 * 1024, backupCount=3)  # 5MB max size, 3 backups
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)

# Configure logger
logger = logging.getLogger('cockpit_zfs_getpools')
logger.setLevel(logging.DEBUG)
logger.addHandler(handler)

# Example usage of the logger in the script
def basic_typed_children(children):
    try:
        for i in range(0, len(children)):
            children[i]['properties']['creation']['parsed'] = str(children[i]['properties']['creation']['parsed'])

            if len(children[i]['children']) >= 1:
                children[i]['children'] = basic_typed_children(children[i]['children'])

        return children
    except Exception as e:
        logger.error(f"Exception in basic_typed_children: {str(e)}")
        return []

def main():
    try:
        logger.info("=" * 80)  # Separator line
        logger.info("Starting a new run of get-pools script")
        
        with libzfs.ZFS() as zfs:
            z_pools = []

            for p in zfs.pools:
                pool = p.asdict()

                root_dataset = pool.get('root_dataset')  # Check if 'root_dataset' exists
                if root_dataset is not None:
                    pool['root_dataset']['properties']['creation']['parsed'] = str(pool['root_dataset']['properties']['creation']['parsed'])

                    if 'scan' in pool:
                        pool['scan']['start_time'] = str(pool['scan']['start_time'])
                        pool['scan']['end_time'] = str(pool['scan']['end_time'])
                        pool['scan']['pause'] = str(pool['scan']['pause'])

                    pool['root_dataset']['children'] = basic_typed_children(pool['root_dataset']['children'])
                else:
                    pool['root_dataset'] = None  # Set 'root_dataset' to None if it doesn't exist

                pool_log_data = {
                    'name': pool['name'],
                    'status': pool['status']
                }
                
                logger.debug(f"Parsed pool data: {pool_log_data}")
                z_pools.append(pool)

            logger.info(f"Pools discovered: {len(z_pools)}")
            print(json.dumps(z_pools, indent=4))
            
    except Exception as e:
        logger.error(f"Exception in main: {str(e)}")

if __name__ == '__main__':
    main()
