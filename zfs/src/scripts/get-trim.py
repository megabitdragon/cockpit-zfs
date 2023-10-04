import sys
import subprocess
import json
import re

def main():
    if len(sys.argv) != 2:
        print("Usage: python script.py <poolName>")

    poolName = sys.argv[1]

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

    print(json.dumps(trimData, indent=4))

if __name__ == '__main__':
    main()