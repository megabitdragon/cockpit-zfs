Name: ::package_name::
Version: ::package_version::
Release: ::package_build_version::%{?dist}
Summary: ::package_description_short::
License: ::package_licence::
URL: ::package_url::
Source0: %{name}-%{version}.tar.gz
BuildArch: ::package_architecture_el::
Requires: ::package_dependencies_el_el8::

BuildRoot: %{_tmppath}/%{name}-%{version}-%{release}-root

%description
::package_title::
::package_description_long::

%prep
%setup -q

%build
make OS_PACKAGE_RELEASE=el8

%install
make DESTDIR=%{buildroot} install

%files
/usr/share/cockpit/zfs/*

%changelog
* Wed Feb 19 2025 Jordan Keough <jkeough@45drives.com> 1.1.14-3
- trying to build debs
* Wed Feb 19 2025 Jordan Keough <jkeough@45drives.com> 1.1.14-2
- Trying to build package again after cleaning remnants of common lib
* Wed Feb 19 2025 Jordan Keough <jkeough@45drives.com> 1.1.14-1
- Rolls back previous Houston-Common-Library updates due to some bugs that came up
  during usage. Bugfixes pushed during common lib implementation should all be retained,
  but removed common library usage for the time being to work out those issues.
* Fri Jan 17 2025 Rachit Hans <rhans@45drives.com> 1.1.11-1
- Refacotred UI and script code
* Tue Jan 07 2025 Jordan Keough <jkeough@45drives.com> 1.1.10-1
- Fixes package number
* Tue Jan 07 2025 Jordan Keough <jkeough@45drives.com> 1.1.20-1
- Fixes binary size bug
* Tue Jan 07 2025 Jordan Keough <jkeough@45drives.com> 1.1.9-1
- Adds block device name to disk name for better UX, fixes available disk selection
  issue where in-use disks shown as available
* Mon Dec 16 2024 Jordan Keough <jkeough@45drives.com> 1.1.8-1
- Updates readme and fixes get-importable-pools functionality.
* Mon Dec 09 2024 Jordan Keough <jkeough@45drives.com> 1.1.7-2
- Testing capacity bugfix for non-aliased disks
* Mon Dec 09 2024 Jordan Keough <jkeough@45drives.com> 1.1.7-1
- Adjusts disk capacity strings and removes accidental double conversion of binary
  size values where applicable
* Fri Dec 06 2024 Jordan Keough <jkeough@45drives.com> 1.1.6-1
- Fixes issue with convertSizeToBytes function, which would give errors when creating
  vdevs with same size disks (incorrectly flagging as different sizes)
* Thu Dec 05 2024 Rachit Hans <rhans@45drives.com> 1.1.5-1
- Updated Datatypes
* Thu Nov 28 2024 Jordan Keough <jkeough@45drives.com> 1.1.4-1
- Fixes some notification bugs (errorString formatting issues)
* Thu Nov 21 2024 Jordan Keough <jkeough@45drives.com> 1.1.3-1
- FIXED VERSION NUMBER - Adds log files for getDisks and getPools scripts
* Thu Nov 21 2024 Jordan Keough <jkeough@45drives.com> 1.2.3-1
- Adds log files for getDisks and getPools script execution for better debugging
* Mon Nov 18 2024 Jordan Keough <jkeough@45drives.com> 1.1.2-1
- Reworked bytes conversion function to fix mismatched disk size bug
* Wed Nov 06 2024 Jordan Keough <jkeough@45drives.com> 1.1.1-1
- Updates disk data retrieval using lsdev with a fallback to lsblk data if lsdev
  is not available (on VMs or non-aliased third party hardware)
* Mon Nov 04 2024 Jordan Keough <jkeough@45drives.com> 1.1.0-1
- Stable Release
* Wed Oct 23 2024 Jordan Keough <jkeough@45drives.com> 1.0.4-3
- Rebuilding
* Wed Oct 23 2024 Jordan Keough <jkeough@45drives.com> 1.0.4-2
- Rebuilding
* Wed Oct 23 2024 Jordan Keough <jkeough@45drives.com> 1.0.4-1
- Adds upgrade pool feature for pools made in legacy zfs version
* Mon Oct 21 2024 Jordan Keough <jkeough@45drives.com> 1.0.3-1
- Bug fixes and some minor updates
* Tue Sep 24 2024 Jordan Keough <jkeough@45drives.com> 1.0.2-3
- Fixes rendering issue with status bar in Pools list
* Tue May 28 2024 Jordan Keough <jkeough@45drives.com> 1.0.2-2
- Building for focal
* Fri May 17 2024 Jordan Keough <jkeough@45drives.com> 1.0.1-1-3
- Updated build package to newest version
* Fri May 17 2024 Jordan Keough <jkeough@45drives.com> 1.0.1-2
- Feature Addition: Bulk destroy snapshots
* Wed May 15 2024 Jordan Keough <jkeough@45drives.com> 0.1.1-1
- Updates to data display + loading spinners for snapshots
* Fri May 10 2024 Jordan Keough <jkeough@45drives.com> 0.1.0-11
- fixed bug with missing disks breaking pools
* Fri May 10 2024 Jordan Keough <jkeough@45drives.com> 0.1.0-10
- fixed bug with missing disks breaking pools
* Wed Apr 24 2024 Jordan Keough <jkeough@45drives.com> 0.1.0-9
- fixes a bug with finding importable pools
* Tue Apr 23 2024 Jordan Keough <jkeough@45drives.com> 0.1.0-8
- adds py-libzfs to dependencies
* Mon Mar 11 2024 Jordan Keough <jkeough@45drives.com> 0.1.0-7
- wip bug fixing for root_dataset property
* Mon Mar 11 2024 Jordan Keough <jkeough@45drives.com> 0.1.0-6
- wip bug fixing for root_dataset property
* Mon Mar 11 2024 Jordan Keough <jkeough@45drives.com> 0.1.0-5
- wip bug fixing for root_dataset property
* Mon Mar 11 2024 Jordan Keough <jkeough@45drives.com> 0.1.0-4
- wip bug fix for root_dataset property again
* Mon Mar 11 2024 Jordan Keough <jkeough@45drives.com> 0.1.0-3
- wip bug fix for root_dataset property
* Mon Mar 11 2024 Jordan Keough <jkeough@45drives.com> 0.1.0-2
- bug fix for scan property
* Fri Mar 08 2024 Jordan Keough <jkeough@45drives.com> 0.1.0-1
- initial release