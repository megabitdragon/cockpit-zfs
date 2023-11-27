# Python script for sending datasets
import subprocess
import argparse

# def send_dataset(sendName, recvName, recvHost=None, recvPort=None, compressed=False, raw=False):
#     try :
#         command = ['zfs', 'send', sendName]

#         if recvHost is not None:
#             command.append(recvHost)

#         if recvPort is not None:
#             command.append(recvPort)

#         if compressed:
#             command.append('-Lce')

#         if raw:
#             command.append('-w')

#         command.append([ '|', 'zfs', 'recv', recvName])

#         process = subprocess.Popen(
#             command, 
#             stdin=subprocess.PIPE,
#             stdout=subprocess.PIPE,
#             stderr=subprocess.PIPE,
#         )

#         stdout, stderr = process.communicate()

#         if process.returncode != 0:
#             print(f"Error: {stderr}")
#         else:
#             print(stdout)
    
#     except Exception as e:
#         print(f"An error occurred: {e}")

def send_dataset(sendName, recvName, forceOverwrite):
    try: 
        send_cmd = ['zfs', 'send']

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
    parser.add_argument('forceOverwrite', type=str, help='forcefully overwrite existing dataset')
    # parser.add_argument('recvHost', type=str, help='receiving dataset host')
    # parser.add_argument('recvPort', type=str, help='receiving dataset port')
    # parser.add_argument('compression', type=bool, help='sending dataset compression')
    # parser.add_argument('raw', type=bool, help='sending dataset raw')

    args = parser.parse_args()

    sendName = args.sendName
    recvName = args.recvName
    forceOverwrite = args.forceOverwrite
    # recvHost = args.recvHost
    # recvPort = args.recvPort
    # compressed = args.compressed
    # raw = args.raw

    print(f"Executing command: zfs send {sendName} | {recvName}")

    # send_dataset(sendName, recvName, recvHost, recvPort, compressed, raw)
    send_dataset(sendName, recvName, forceOverwrite)

if __name__ == '__main__':
    main()