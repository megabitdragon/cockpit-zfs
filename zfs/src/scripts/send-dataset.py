# Python script for sending snapshots
import subprocess
import argparse

# def send_dataset(sendName, recvName, recvHost=None, recvPort=None, compressed=False, raw=False):

def destroyForOverwrite(recvName):
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

def send_dataset(sendName, recvName, sendName2="", forceOverwrite=False):
    try:

        if forceOverwrite:
            destroyForOverwrite(recvName)

        send_cmd = ['zfs', 'send', '-v']

        if sendName2 is not "":
            send_cmd.append('-i')
            send_cmd.append(sendName2)

        send_cmd.append(sendName)

        process_send = subprocess.Popen(
            send_cmd,
            stdout=subprocess.PIPE,
        )

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
    # parser.add_argument('recvHost', type=str, help='receiving dataset host')
    # parser.add_argument('recvPort', type=str, help='receiving dataset port')
    # parser.add_argument('compression', type=bool, help='sending dataset compression')
    # parser.add_argument('raw', type=bool, help='sending dataset raw')

    args = parser.parse_args()

    sendName = args.sendName
    recvName = args.recvName
    sendName2 = args.sendName2
    forceOverwrite = args.forceOverwrite.lower() == 'true'
    # recvHost = args.recvHost
    # recvPort = args.recvPort
    # compressed = args.compressed
    # raw = args.raw

    if sendName2 is not "":
        print(f"Sending incrementally to {recvName} from {sendName2} to {sendName}")
    else:
        print(f"Executing command: zfs send {sendName} | {recvName}")

    # send_dataset(sendName, recvName, recvHost, recvPort, compressed, raw)
    send_dataset(sendName, recvName, sendName2, forceOverwrite)

if __name__ == '__main__':
    main()