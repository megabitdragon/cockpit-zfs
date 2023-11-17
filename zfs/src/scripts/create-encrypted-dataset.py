import subprocess
import argparse

def create_encrypted_dataset(cmd, atime, case, compress, dedup, dnode, xattr, record, readonly, quota, encryption, keyformat, keylocation, path, passphrase):
    try:
        process = subprocess.Popen(
            [cmd, 'create',
             '-o', atime,
             '-o', case,
             '-o', compress,
             '-o', dedup,
             '-o', dnode,
             '-o', xattr,
             '-o', record,
             '-o', quota,
             '-o', readonly,
             '-o', encryption,
             '-o', keyformat,
             '-o', keylocation,
             path],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )

        stdout, stderr = process.communicate(input=f"{passphrase}\n{passphrase}\n".encode())

        if process.returncode != 0:
            print(f"Error: {stderr}")
        else:
            print(stdout)

    except Exception as e:
        print(f"An error occurred: {e}")

def main():
    parser = argparse.ArgumentParser(description='Create and encrypt a ZFS Dataset')
    parser.add_argument('cmdString', type=str, help='zfs create')
    parser.add_argument('atime',type=str, help='access time')
    parser.add_argument('case',type=str, help='case sensitivity')
    parser.add_argument('compress',type=str, help='compression')
    parser.add_argument('dedup',type=str, help='deduplication')
    parser.add_argument('dnode',type=str, help='dnode size')
    parser.add_argument('xattr',type=str, help='extended attributes')
    parser.add_argument('record',type=str, help='record size')
    parser.add_argument('quota',type=str, help='quota')
    parser.add_argument('readonly',type=str, help='read only')
    parser.add_argument('encryption',type=str, help='encryption')
    parser.add_argument('keyformat',type=str, help='keyformat')
    parser.add_argument('keylocation',type=str, help='keylocation')
    parser.add_argument('path',type=str, help='path')
    parser.add_argument('passphrase',type=str, help='passphrase')

    args = parser.parse_args()

    cmdString = args.cmdString
    atime = args.atime
    case = args.case
    compress = args.compress
    dedup = args.dedup
    dnode = args.dnode
    xattr = args.xattr
    record = args.record
    quota = args.quota
    readonly = args.readonly
    encryption = args.encryption
    keyformat = args.keyformat
    keylocation = args.keylocation
    path = args.path
    passphrase = args.passphrase

    print(f"Executing command: {cmdString} create {atime} {case} {compress} {dedup} {dnode} {xattr} {record} {quota} {readonly} {encryption} {keyformat} {keylocation} {path}")

    create_encrypted_dataset(cmdString, atime, case, compress, dedup, dnode, xattr, record, quota, readonly, encryption, keyformat, keylocation, path, passphrase)

if __name__ == '__main__':
    main()

