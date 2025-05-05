import libzfs
import json
import sys

def basic_typed_children(children):
    for i in range(len(children)):
        children[i]['properties']['creation']['parsed'] = str(children[i]['properties']['creation']['parsed'])
        
        if len(children[i]['children']) >= 1:
            children[i]['children'] = basic_typed_children(children[i]['children'])

    return children

def get_all_snapshots():
    with libzfs.ZFS() as zfs:
        z_datasets = {}

        for d in zfs.datasets:
            snaps = []

            for snap in d.snapshots:
                z_snap = snap.asdict()
                z_snap['properties']['creation']['parsed'] = str(z_snap['properties']['creation']['parsed'])
                snaps.append(z_snap)

            z_datasets[d.name] = snaps

    return json.dumps(z_datasets, indent=4)  # Return the JSON string

def get_snapshots_by_dataset(dataset_name):
    with libzfs.ZFS() as zfs:
        z_datasets = {}

        for d in zfs.datasets:
            if d.name == dataset_name:  # Use 'd.name' for checking the dataset name
                snaps = []

                for snap in d.snapshots:
                    z_snap = snap.asdict()
                    z_snap['properties']['creation']['parsed'] = str(z_snap['properties']['creation']['parsed'])
                    snaps.append(z_snap)

                z_datasets[d.name] = snaps
                break  # Stop after finding the desired dataset

    return json.dumps(z_datasets, indent=4)  # Return the JSON string

# Placeholder for the function to get snapshots by pool (implement as needed)
def get_snapshots_by_pool(pool_name):
    with libzfs.ZFS() as zfs:
        z_datasets = {}

        for d in zfs.datasets:
            if d.pool.name == pool_name:  # Check if the dataset belongs to the specified pool
                snaps = []

                for snap in d.snapshots:
                    z_snap = snap.asdict()
                    z_snap['properties']['creation']['parsed'] = str(z_snap['properties']['creation']['parsed'])
                    snaps.append(z_snap)

                z_datasets[d.name] = snaps  # Store snapshots for the dataset

    return json.dumps(z_datasets, indent=4)  # Return the JSON string


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 your_script.py [all|dataset_name|pool_name]")
        return

    command = sys.argv[1]
    snapshots = None  # Initialize snapshots variable

    if command == 'all':
        snapshots = get_all_snapshots()
    elif command.startswith('dataset:'):
        dataset_name = command.split(':')[1]
        snapshots = get_snapshots_by_dataset(dataset_name)
    elif command.startswith('pool:'):
        pool_name = command.split(':')[1]
        snapshots = get_snapshots_by_pool(pool_name)
    else:
        print("Invalid command. Use 'all', 'dataset:<name>', or 'pool:<name>'.")
        return


if __name__ == '__main__':
    main()

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 your_script.py [all|dataset_name|pool_name]")
        return

    command = sys.argv[1]
    snapshots = None  # Initialize snapshots variable

    if command == 'all':
        snapshots = get_all_snapshots()
    elif command.startswith('dataset:'):
        dataset_name = command.split(':')[1]
        snapshots = get_snapshots_by_dataset(dataset_name)
    elif command.startswith('pool:'):
        pool_name = command.split(':')[1]
        snapshots = get_snapshots_by_pool(pool_name)
    else:
        print("Invalid command. Use 'all', 'dataset:<name>', or 'pool:<name>'.")
        return

    if snapshots:  # Print the snapshots if they were retrieved
        print(snapshots)

if __name__ == '__main__':
    main()