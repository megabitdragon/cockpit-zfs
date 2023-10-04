# import sys
# import libzfs
# import subprocess
# import json
# import re

# def main():
    
#     with libzfs.ZFS() as zfs:
#         z_pools = []

#         for p in zfs.pools:
#             pool = p.asdict()
#             pool['name'] = str(pool['name'])

#             z_pools.append(pool['name'])

#     trimDataDict = {}

#     # if len(sys.argv) != 2:
#     #     print('Usage: python script.py <pools>')

#     # pools = sys.argv[1]

#     for pool in z_pools:
#         poolName = pool['name']
#         result = subprocess.run(['zpool', 'status', poolName, '-t'], stdout=subprocess.PIPE, universal_newlines=True, check=True)
#         output = result.stdout

#         percentTrimmed = None
#         state = None
#         stateTimestamp = None

#         lines = output.split('\n')

#         for line in lines:
#             if 'trimmed' in line:
#                 match = re.search(r'(\d+)% trimmed, (\w+) at (.+?)\)$', line)
#                 if match:
#                     percentTrimmed = match.group(1)
#                     state = match.group(2)
#                     stateTimestamp = match.group(3)
        
#         trimData = {
#             'poolName': poolName,
#             'percentTrimmed': percentTrimmed,
#             'state': state,
#             'stateTimestamp': stateTimestamp,
#         }

#         trimDataDict[poolName] = trimData

#         print(json.dumps(trimDataDict, indent=4))

# if __name__ == '__main__':
#     main()

import sys
import subprocess
import json
import re

def main():
    trimDataDict = {}

    if len(sys.argv) != 2:
        print('Usage: python script.py <pools>')

    pools_json = sys.argv[1]
    pools = json.loads(pools_json)

    for pool in pools:
        poolName = pool['name']
        result = subprocess.run(['zpool', 'status', poolName, '-t'], stdout=subprocess.PIPE, universal_newlines=True, check=True)
        output = result.stdout

        percentTrimmed = None
        state = None
        stateTimestamp = None

        lines = output.split('\n')

        for line in lines:
            if 'trimmed' in line:
                match = re.search(r'(\d+)% trimmed, (\w+) at (.+?)\)$', line)
                if match:
                    percentTrimmed = match.group(1)
                    state = match.group(2)
                    stateTimestamp = match.group(3)
        
        trimData = {
            'poolName': poolName,
            'percentTrimmed': percentTrimmed,
            'state': state,
            'stateTimestamp': stateTimestamp,
        }

        trimDataDict[poolName] = trimData

    print(json.dumps(trimDataDict, indent=4))

if __name__ == '__main__':
    main()