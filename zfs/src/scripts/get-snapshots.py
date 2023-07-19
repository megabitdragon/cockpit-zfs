import libzfs
import json

def basic_typed_children(children):
    for i in range(0, len(children)):
        children[i]['properties']['creation']['parsed'] = str(children[i]['properties']['creation']['parsed'])

        if len(children[i]['children']) >= 1:
            children[i]['children'] = basic_typed_children(children[i]['children'])

    return children

def main():
    with libzfs.ZFS() as zfs:
        z_datasets = {}

        for d in zfs.datasets:
            snaps = []

            for snap in d.snapshots:
                z_snap = snap.asdict()

                z_snap['properties']['creation']['parsed'] = str(z_snap['properties']['creation']['parsed'])

                snaps.append(z_snap)

            z_datasets[d.name] = snaps
    print(json.dumps(z_datasets, indent=4))
if __name__ == '__main__':
    main()
