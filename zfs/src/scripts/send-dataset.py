# Python script for sending snapshots
import subprocess
import argparse
import time
import re
import json
import threading
import tempfile
import os

def destroy_for_overwrite_local(recvName):
    destroy_cmd = ['zfs', 'destroy', f'{recvName}', '-R']

    process_destroy = subprocess.Popen(
        destroy_cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )

    print(f"Executing command: zfs destroy -R {recvName}")
    
    stdout, stderr = process_destroy.communicate()

    if process_destroy.returncode != 0:
        print(f"Error: {stderr}")
    else:
        print(stdout)

def destroy_for_overwrite_remote(recvName, recvHostUser, recvHost, recvPort=22):
    ssh_cmd = ['ssh']

    if recvPort != '22':
        ssh_cmd.extend(['-p', recvPort])

    ssh_cmd.append(recvHostUser + '@' + recvHost)

    ssh_cmd.extend(['zfs', 'destroy', f'{recvName}', '-R'])

    process_destroy = subprocess.Popen(
        ssh_cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )

    print(f"Executing command: zfs destroy -R {recvName}")
    
    stdout, stderr = process_destroy.communicate()

    if process_destroy.returncode != 0:
        print(f"Error: {stderr}")
    else:
        print(stdout)

# def read_progress(file_path):
#     while True:
#         try:
#             with open(file_path, 'r') as json_file:
#                 progress_data = json.load(json_file)
#                 for data in progress_data:
#                     # Process the progress data as needed
#                     print(data)
#         except FileNotFoundError:
#             pass  # File not found, handle accordingly
#         except json.JSONDecodeError:
#             pass  # JSON decoding error, handle accordingly
#         time.sleep(1)  # Adjust the sleep duration as needed

def send_dataset(sendName, recvName, sendName2="", forceOverwrite=False, compressed=False, raw=False, recvHost="", recvPort=22, recvHostUser=""):
    try:
        if recvHost != "" and forceOverwrite == True:
            destroy_for_overwrite_local(recvName)

        send_cmd = ['zfs', 'send', '-v']

        if compressed:
            send_cmd.append('-Lce')

        if raw:
            send_cmd.append('-w')

        if sendName2 != "":
            send_cmd.extend(['-i', sendName2])

        send_cmd.append(sendName)

        # print(f"SEND_CMD: {send_cmd}")

        process_send = subprocess.Popen(
            send_cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
          
        if recvHost != "":
            if forceOverwrite:
                destroy_for_overwrite_remote(recvName, recvHostUser, recvHost, recvPort)

            ssh_cmd = ['ssh']

            if recvPort != '22':
                ssh_cmd.extend(['-p', recvPort])

            ssh_cmd.append(recvHostUser + '@' + recvHost)

            # ssh_cmd.append('-v')

            ssh_cmd.extend(['zfs', 'recv'])

            if forceOverwrite:
                ssh_cmd.append('-F')

            ssh_cmd.append(recvName)

            print(f"SSH_CMD: {ssh_cmd}")

            process_ssh_recv = subprocess.Popen(
                ssh_cmd,
                stdin=process_send.stdout,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )

            stdout, stderr = process_ssh_recv.communicate()

            if process_ssh_recv.returncode != 0:
                print(f"Error: {stderr}")
            else:
                print(stdout)
        
        else:
            recv_cmd = ['zfs', 'recv', '-v']

            if forceOverwrite:
                recv_cmd.append('-F')

            recv_cmd.append(recvName)

            # print(f"RECV_CMD: {recv_cmd}")

            process_recv = subprocess.Popen(
                recv_cmd,
                stdin=process_send.stdout,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                universal_newlines=True,
            )

        # Initialize variables 
        snapshot_name = None
        total_size = None
        update_size = None
        status = "ongoing"
        output_data = []
        final_data = None

        # while True:
        while process_send.poll() is None:
            output = process_send.stderr.readline()
          
            if output:
                # Extract total size
                pattern_total = r'estimated size is (\d+(\.\d+)?[KMG])'
                match_total = re.search(pattern_total, str(output))
                if match_total:
                    total_size = match_total.group(1)

                # Extract progress data
                pattern_progress = r'(\d+:\d+\d+)\s+(\d+(\.\d+)?[KMG])\s+([\w\/@]+)'
                match_progress = re.search(pattern_progress, str(output))
                if match_progress:
                    update_size = match_progress.group(2)
                    snapshot_name = match_progress.group(4)

                    # Create a data dictionary
                    data = {
                        "snapSent": snapshot_name,
                        "status": status,
                        "progSize": update_size,
                        "totalSize": total_size,
                    }
      
                    # Append data to the output_data list
                    output_data.append(data)

                    # Print the data for verification
                    print(data)

        while process_recv.poll() is None:
            recv_output = process_recv.stdout.readline()

            # Check for the "received" line structure
            if "received" in str(recv_output):
                # Extract the final progress information
                pattern_final_progress = r'received\s+([\d.]+[KMG]?)\s+stream\s+in\s+(\d+)\s+seconds\s+\(([\d.]+[KMG]?)\/sec\)'

                match_final_progress = re.search(pattern_final_progress, str(recv_output))
                if match_final_progress:
                    received_size = match_final_progress.group(1)
                    status = "finished"
                    # Create the final data object
                    final_data = {
                        "snapSent": snapshot_name,
                        "status": status,
                        "progSize": received_size,
                        "totalSize": total_size,
                    }

                    print(final_data)

       # Check if final_data is defined before appending to output_data
        if final_data is not None and any(final_data):
            output_data.append(final_data)

        print("Current Working Directory:", os.getcwd())
        # When running script from Client, stores output.json in /run/user/0

        # Write the entire output_data list to the JSON file
        with open('send_output.json', "w") as json_file:
            json.dump(output_data, json_file, indent=2)

        stdout, stderr = process_recv.communicate()

        if process_recv.returncode != 0:
            print(f"Error: {stderr}")
        else:
            print(stdout)

        # print(json.dumps(output_data, indent=2))
        return(json.dumps(output_data, indent=2))

    except Exception as e:
        print(f"An error occurred: {e}")

def main() :
    parser = argparse.ArgumentParser(description='Send ZFS Dataset')
    parser.add_argument('sendName', type=str, help='sending dataset name')
    parser.add_argument('recvName', type=str, help='receiving dataset name')
    parser.add_argument('sendName2', type=str, help='first snap for incremental send')
    parser.add_argument('forceOverwrite', type=str, default='False', help='forcefully overwrite existing dataset')
    parser.add_argument('compressed', type=str, default='False', help='sending dataset compression')
    parser.add_argument('raw', type=str, default='False', help='sending dataset raw')
    parser.add_argument('recvHost', type=str, help='receiving dataset host')
    parser.add_argument('recvPort', type=str, default='22', help='receiving dataset port')
    parser.add_argument('recvHostUser', type=str, help='receiving dataset host user')

    args = parser.parse_args()

    sendName = args.sendName
    recvName = args.recvName
    sendName2 = args.sendName2
    forceOverwrite = args.forceOverwrite.lower() == 'true'
    compressed = args.compressed.lower() == 'true'
    raw = args.raw.lower() == 'true'
    recvHost = args.recvHost
    recvPort = args.recvPort
    recvHostUser = args.recvHostUser

    if sendName2 != "":
        print(f"Sending incrementally to {recvName} from {sendName2} to {sendName}")
    else:
        print(f"Executing command: zfs send {sendName} | {recvName}")

    send_dataset(sendName, recvName, sendName2, forceOverwrite, compressed, raw, recvHost, recvPort, recvHostUser)

if __name__ == '__main__':
    main()