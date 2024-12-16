import libzfs
import json
import logging
from logging.handlers import RotatingFileHandler

# Configure rotating log handler
log_file = '/var/log/cockpit_zfs_getimportabledestroyedpools.log'
handler = RotatingFileHandler(log_file, maxBytes=5 * 1024 * 1024, backupCount=3)  # 5MB max size, 3 backups
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)

# Configure logger
logger = logging.getLogger('cockpit_zfs_getimportabledestroyedpools')
logger.setLevel(logging.DEBUG)
logger.addHandler(handler)

def main():
    try:
        logger.info("=" * 80)  # Separator line
        logger.info("Starting a new run of get-importable-destroyed-pools script")
        
        z_pools = []
        
        with libzfs.ZFS() as zfs:
            try:
                destroyed_importable_pools = zfs.find_import(destroyed='True', search_paths=['/dev', '/dev/disk/by-id', '/dev/disk/by-path', '/dev/disk/by-vdev'])
            except Exception as e:
                logger.error(f"Error during find_import(): {str(e)}")
                raise

            for p in destroyed_importable_pools:
                try:
                    pool = p.asdict()
                    # Log minimal data for each pool
                    pool_log_data = {
                        'name': pool['name'],
                        'status': pool['status']
                    }
                    logger.debug(f"Found pool: {pool_log_data}")
                    
                    # Handle scan times, if present
                    if 'scan' in pool:
                        pool['scan']['start_time'] = str(pool['scan']['start_time'])
                        pool['scan']['end_time'] = str(pool['scan']['end_time'])

                    # Add parsed pool to the list
                    z_pools.append(pool)
                    
                except Exception as pool_error:
                    logger.error(f"Error processing pool: {str(pool_error)}")

        try:
            # Serialize and output the result
            output = json.dumps(z_pools, indent=4)
            print(output)  # Send JSON to stdout
            # logger.debug(f"Output JSON: {output}")
        except Exception as serialization_error:
            logger.error(f"Error serializing JSON: {str(serialization_error)}")
        
    except Exception as e:
        logger.error(f"Exception in getting importable destroyed pools: {str(e)}")
        return []
        
if __name__ == '__main__':
    main()