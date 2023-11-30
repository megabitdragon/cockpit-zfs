# Python script for sending snapshots
import subprocess
import argparse
import json
import threading
import tempfile
import os

def destroy_for_overwrite(recvName):
        destroy_cmd = ['zfs', 'destroy']
        destroy_cmd.append(recvName)
        destroy_cmd.append('-R')
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

# def process_send_output(output_stream):
#     total_size = None

#     for line in output_stream:
#         line_data = line.strip()

#         if line_data.startswith("total estimated size"):
#             total_size = line_data.split()[-1]

#         elif line_data.startswith("TIME"):
#             # Skip header line
#             continue

#         elif total_size:
#             # Extract progress data and return as JSON
#             time, sent, snapshot = line_data.split()
#             progress_data = {
#                 'time': time,
#                 'sent': sent,
#                 'snapshot': snapshot,
#                 'total_size': total_size,
#             }
#             yield json.dumps({'progress': progress_data})

# def read_output(output_stream):
#     for progress_json in process_send_output(output_stream):
#         print(progress_json)

# def connect_remotely(host, port, user, password):
#     try:
#         with tempfile.NamedTemporaryFile(mode='w+', delete=False) as temp_pass_file:
#             temp_pass_file.write(password)
#             temp_pass_file_path = temp_pass_file.name

#         try:
#             ssh_cmd = ['ssh']

#             if port is not 22:
#                 ssh_cmd.append('-p')
#                 ssh_cmd.append(port)
            
#             ssh_cmd.append(user + "@")
#             ssh_cmd.append(host)

#             ssh_process = subprocess.Popen(
#                 ssh_cmd,
#                 stdin=subprocess.PIPE,
#                 stdout=subprocess.PIPE,
#                 stderr=subprocess.PIPE,
#             )

#             # Provide the pass file as input to the process
#             with open(temp_pass_file_path, 'rb') as f:
#                 stdout, stderr = ssh_process.communicate(input=f.read())

#             if ssh_process.returncode != 0:
#                 print(f"Error: {stderr}")
#             else:
#                 print(stdout)

#         finally:
#             # Delete the temporary pass file after using it
#             os.remove(temp_pass_file_path)

#     except Exception as e:
#         print(f"An error occurred: {e}")

def send_dataset(sendName, recvName, sendName2="", forceOverwrite=False, compressed=False, raw=False, recvHost="", recvPort=22, recvHostUser="", recvHostPass=""):
    try:
        # Create a secure temporary file to store the passphrase
        with tempfile.NamedTemporaryFile(mode='w+', delete=False) as temp_recvHostPass:
            temp_recvHostPass.write(recvHostPass)
            temp_recvHostPass_path = temp_recvHostPass.name

        try:
            if forceOverwrite:
                destroy_for_overwrite(recvName)

            send_cmd = ['zfs', 'send', '-v']

            if compressed:
                send_cmd.append('-Lce')

            if raw:
                send_cmd.append('-w')

            if sendName2 is not "":
                send_cmd.append('-i')
                send_cmd.append(sendName2)

            send_cmd.append(sendName)

            process_send = subprocess.Popen(
                send_cmd,
                stdout=subprocess.PIPE,
            )

            if recvHost is not "":
                ssh_cmd = ['ssh']

                if recvPort != 22:
                    ssh_cmd.append('-p')
                    ssh_cmd.append(recvPort)

                ssh_cmd.append(recvHostUser + '@')
                ssh_cmd.append(recvHost)

                ssh_cmd.extend(['zfs', 'recv'])

                if forceOverwrite:
                    ssh_cmd.append('-F')

                ssh_cmd.append(recvName)

                process_ssh_recv = subprocess.Popen(
                    ssh_cmd,
                    stdin=process_send.stdout,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                )

                with open(temp_recvHostPass_path, 'rb') as f:
                    stdout, stderr = process_ssh_recv.communicate(input=f.read())

                if process_ssh_recv.returncode != 0:
                    print(f"Error: {stderr}")
                else:
                    print(stdout)
            
            else:
                recv_cmd = ['zfs', 'recv']

                if forceOverwrite:
                    recv_cmd.append('-F')

                recv_cmd.append(recvName)

                process_recv = subprocess.Popen(
                    recv_cmd,
                    stdin=process_send.stdout,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                )

                # for progress_json in process_send_output(process_recv.stdout):
                #     print(progress_json)

                # Start a separate thread to read and process the output in real-time
                # output_thread = threading.Thread(target=read_output, args=(process_recv.stdout,), daemon=True)
                # output_thread.start()

                # # Wait for the subprocess to finish
                # process_recv.wait()

                stdout, stderr = process_recv.communicate()

                if process_recv.returncode != 0:
                    print(f"Error: {stderr}")
                else:
                    print(stdout)

        finally:
            # Delete the temporary passphrase file after using it
            os.remove(temp_recvHostPass_path)

    except Exception as e:
        print(f"An error occurred: {e}")

# def send_dataset_remotely():
    

def main() :
    parser = argparse.ArgumentParser(description='Send ZFS Dataset')
    parser.add_argument('sendName', type=str, help='sending dataset name')
    parser.add_argument('recvName', type=str, help='receiving dataset name')
    parser.add_argument('sendName2', type=str, help='first snap for incremental send')
    parser.add_argument('forceOverwrite', type=str, default='False', help='forcefully overwrite existing dataset')
    parser.add_argument('compressed', type=str, default='False', help='sending dataset compression')
    parser.add_argument('raw', type=str, default='False', help='sending dataset raw')
    parser.add_argument('recvHost', type=str, help='receiving dataset host')
    parser.add_argument('recvPort', default=22, type=int, help='receiving dataset port')
    parser.add_argument('recvHostUser', type=str, help='receiving dataset host user')
    parser.add_argument('recvHostPass', type=str, help='receiving dataset host password')

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
    recvHostPass = args.recvHostPass

    # if recvHost is not "":
    #     connect_remotely(recvHost, recvPort, recvHostUser, recvHostPass)
    #     send_dataset_remotely()
    # else:

    if sendName2 is not "":
        print(f"Sending incrementally to {recvName} from {sendName2} to {sendName}")
    else:
        print(f"Executing command: zfs send {sendName} | {recvName}")

    send_dataset(sendName, recvName, sendName2, forceOverwrite, compressed, raw, recvHost, recvPort, recvHostUser, recvHostPass)

if __name__ == '__main__':
    main()