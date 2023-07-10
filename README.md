### Building on Rocky:

```
dnf install libzfs5-devel python3-devel -y
pip3 install Cython
git clone https://github.com/truenas/py-libzfs.git && cd py-libzfs
./configure --prefix=/usr
make
make install
```