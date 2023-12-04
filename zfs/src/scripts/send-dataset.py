# Python script for sending snapshots
import subprocess
import argparse

def destroy_for_overwrite(recvName):
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

# def check_if_recv_dataset_exists(recvName, remote_user, remote_host):
#     # Construct the SSH command
#     ssh_cmd = ['ssh', f'{remote_user}@{remote_host}', f'zfs list -H -o name {recvName}']

#     # Run the SSH command
#     process_check_dataset = subprocess.Popen(
#         ssh_cmd,
#         stdout=subprocess.PIPE,
#         stderr=subprocess.PIPE,
#         universal_newlines=True,  # Ensures text mode for stdout and stderr
#     )

#     # Wait for the command to complete and capture the output
#     stdout, stderr = process_check_dataset.communicate()

#     # Check the return code
#     if process_check_dataset.returncode != 0:
#         print(f"Error: {stderr}")
#         return False
#     else:
#         # Check if the output matches the recvName
#         return stdout.strip() == recvName

def send_dataset(sendName, recvName, sendName2="", forceOverwrite=False, compressed=False, raw=False, recvHost="", recvPort=22, recvHostUser=""):
    try:
        if forceOverwrite:
            destroy_for_overwrite(recvName)

        send_cmd = ['zfs', 'send', '-v']

        if compressed:
            send_cmd.append('-Lce')

        if raw:
            send_cmd.append('-w')

        if sendName2 != "":
            send_cmd.extend(['-i', sendName2])

        send_cmd.append(sendName)

        print(f"SEND_CMD: {send_cmd}")

        process_send = subprocess.Popen(
            send_cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )

        if recvHost != "":
            ssh_cmd = ['ssh']

            if recvPort != '22':
                ssh_cmd.extend(['-p', recvPort])

            ssh_cmd.append(recvHostUser + '@' + recvHost)

            ssh_cmd.append('-v')

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
            recv_cmd = ['zfs', 'recv']

            if forceOverwrite:
                recv_cmd.append('-F')

            recv_cmd.append(recvName)

            print(f"RECV_CMD: {recv_cmd}")

            process_recv = subprocess.Popen(
                recv_cmd,
                stdin=process_send.stdout,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )

            stdout, stderr = process_recv.communicate()

            if process_recv.returncode != 0:
                print(f"Error: {stderr}")
            else:
                print(stdout)


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

    if sendName2 is not "":
        print(f"Sending incrementally to {recvName} from {sendName2} to {sendName}")
    else:
        print(f"Executing command: zfs send {sendName} | {recvName}")

    send_dataset(sendName, recvName, sendName2, forceOverwrite, compressed, raw, recvHost, recvPort, recvHostUser)

if __name__ == '__main__':
    main()