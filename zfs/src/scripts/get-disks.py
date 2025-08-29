#!/usr/bin/env python3
import sys, os, logging, subprocess, json, re

# --- minimal inline logger (works without external module) ---
from logging.handlers import RotatingFileHandler, SysLogHandler
from pathlib import Path

def get_logger(name: str, file_basename: str, app_name: str = "cockpit-zfs") -> logging.Logger:
    logger = logging.getLogger(name)
    if logger.handlers:  # avoid duplicate handlers if re-imported
        return logger
    logger.setLevel(logging.DEBUG)
    logger.propagate = False

    # 1) Syslog if available
    for addr in ("/dev/log", "/run/systemd/journal/syslog"):
        try:
            if os.path.exists(addr):
                h = SysLogHandler(address=addr, facility=SysLogHandler.LOG_USER)
                h.setFormatter(logging.Formatter(f"{name}: %(levelname)s: %(message)s"))
                logger.addHandler(h)
                logger.debug(f"Syslog handler attached via {addr}")
                return logger
        except Exception:
            pass

    # 2) User-writable rotating file
    def _candidates():
        xs = os.environ.get("XDG_STATE_HOME", os.path.expanduser("~/.local/state"))
        xc = os.environ.get("XDG_CACHE_HOME", os.path.expanduser("~/.cache"))
        xr = os.environ.get("XDG_RUNTIME_DIR")
        for base in [xs, xc, xr]:
            if base:
                yield os.path.join(base, app_name, "logs", file_basename)
        yield os.path.join(os.path.expanduser("~/.local/state"), app_name, "logs", file_basename)
        yield os.path.join("/tmp", app_name, file_basename)

    fmt = logging.Formatter("%(asctime)s - %(levelname)s - %(name)s - %(message)s")
    for path in _candidates():
        try:
            Path(path).parent.mkdir(parents=True, exist_ok=True)
            fh = RotatingFileHandler(path, maxBytes=5 * 1024 * 1024, backupCount=3, delay=True)
            fh.setFormatter(fmt)
            logger.addHandler(fh)
            logger.debug(f"File logger attached at {path}")
            return logger
        except Exception:
            pass

    # 3) Fallback stdout
    sh = logging.StreamHandler(sys.stdout)
    sh.setFormatter(fmt)
    logger.addHandler(sh)
    logger.warning("No syslog/file target available; logging to stdout.")
    return logger
# --- end inline logger ---

logger = get_logger("cockpit_zfs_getdisks", "getdisks.log")

def get_lsdev_disks():
    try:
        # If lsdev needs root and fails, we fall back
        result = subprocess.run(
            ["lsdev", "-jdHmtTsfcp"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=False,
        )
        if result.returncode != 0:
            logger.error(f"lsdev command failed: {result.stderr.decode(errors='ignore')}")
            return None  # triggers lsblk-only path

        logger.debug("lsdev command succeeded.")
        # NOTE: decode() was missing; json.loads requires str
        json_data = json.loads(result.stdout.decode())

        disks = []
        for row in json_data.get("rows", []):
            for disk in row:
                if not disk.get("occupied"):
                    continue

                device_path = disk["dev"]
                partitions = int(disk.get("partitions", 0))

                disk_data = {
                    "vdev_path": f"/dev/disk/by-vdev/{disk['bay-id']}",
                    "phy_path": disk.get("dev-by-path") or "unknown",
                    "sd_path": device_path,
                    "name": disk["bay-id"],
                    "model": disk.get("model-name", "Unknown"),
                    "serial": disk.get("serial", "Unknown"),
                    "capacity": disk.get("capacity", "0"),
                    "type": disk.get("disk_type", "Disk"),
                    "usable": True,
                    "temp": disk.get("temp-c"),
                    "health": disk.get("health", "Unknown"),
                    "rotation_rate": disk.get("rotation-rate", 0),
                    "power_on_count": disk.get("power-cycle-count"),
                    "power_on_time": disk.get("power-on-time"),
                    "has_partitions": partitions > 0,
                }

                logger.debug(
                    f"Discovered disk (lsdev): "
                    f"{ {'name': disk_data['name'], 'type': disk_data['type'], 'health': disk_data['health'], 'temp': disk_data['temp']} }"
                )
                disks.append(disk_data)

        logger.info(f"Disks discovered via lsdev: {len(disks)}")
        return disks
    except Exception as e:
        logger.error(f"Exception in get_lsdev_disks: {e}")
        return None

def get_boot_disk():
    """Finds the physical disk that contains /boot or / using lsblk."""
    try:
        result = subprocess.run(
            ["lsblk", "-no", "NAME,MOUNTPOINT"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        if result.returncode != 0:
            logger.error(f"lsblk command failed: {result.stderr}")
            return None

        mount_data = result.stdout.strip().splitlines()
        boot_device = None

        for line in mount_data:
            parts = line.strip().split(None, 1)
            if len(parts) == 1:
                continue
            device, mountpoint = parts
            san = re.sub(r'[^\w/-]', '', device.strip())
            device = f"/dev/{san}"
            if mountpoint == "/boot":
                boot_device = device
                break
            elif mountpoint == "/":
                boot_device = device

        if not boot_device:
            return None

        # Reduce partition to parent disk: sda2 -> sda, nvme0n1p3 -> nvme0n1
        parent_disk = re.sub(r"(p?\d+)$", "", boot_device)
        return parent_disk
    except Exception as e:
        logger.error(f"Error determining boot disk: {e}")
        return None

def get_smartctl_data(device):
    """Best-effort SMART. Non-root often fails -> return Unknowns."""
    try:
        smartctl_result = subprocess.run(
            ["smartctl", "-a", f"/dev/{device}"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        if smartctl_result.returncode != 0:
            logger.info(f"smartctl limited/failed for {device}: {smartctl_result.stderr.strip()}")
            return {"temp": None, "power_on_hours": None, "power_cycle_count": None, "health": None}

        output = smartctl_result.stdout.splitlines()
        info = {"temp": None, "power_on_hours": None, "power_cycle_count": None, "health": None}

        for line in output:
            # These heuristics are intentionally loose and vendor-agnostic
            if ("Temperature" in line and "Celsius" in line) or "Temperature_Celsius" in line:
                try:
                    # Try last numeric
                    nums = [int(tok) for tok in re.findall(r"(\d+)", line)]
                    if nums:
                        info["temp"] = nums[-1]
                except Exception:
                    pass
            elif "Power_On_Hours" in line or "Power On Hours" in line:
                nums = re.findall(r"(\d+)", line)
                info["power_on_hours"] = int(nums[-1]) if nums else None
            elif "Power_Cycle_Count" in line or "Power Cycle Count" in line:
                nums = re.findall(r"(\d+)", line)
                info["power_cycle_count"] = int(nums[-1]) if nums else None
            elif "SMART overall-health" in line or "SMART overall-health self-assessment" in line:
                # e.g., "SMART overall-health self-assessment test result: PASSED"
                if ":" in line:
                    info["health"] = line.split(":", 1)[1].strip()

        return info
    except Exception as e:
        logger.error(f"Exception in get_smartctl_data: {e}")
        return {"temp": None, "power_on_hours": None, "power_cycle_count": None, "health": None}

def _map_by_vdev():
    """
    Returns dict { '/dev/sdX': '/dev/disk/by-vdev/NAME', '/dev/nvme0n1': '/dev/disk/by-vdev/NAME', ... }
    Only maps the *base* device (no partition suffix).
    """
    base_dir = "/dev/disk/by-vdev"
    m = {}
    if not os.path.isdir(base_dir):
        return m
    for link in os.listdir(base_dir):
        full = os.path.join(base_dir, link)
        try:
            target = os.path.realpath(full)  # e.g. /dev/sda1 or /dev/nvme0n1p2 or /dev/sda
            base = re.sub(r"(p?\d+)$", "", target)      # strip partition suffix
            base_name = link.split("-part")[0]          # 1-1-part1 -> 1-1
            m[base] = os.path.join(base_dir, base_name) # map to the *base* by-vdev link
        except Exception:
            pass
    return m

def get_lsblk_disks(nvme_only=False):
    """Get disks using lsblk JSON and udevadm. Works unprivileged."""
    try:
        boot_drive = get_boot_disk()
        logger.info(f"Boot drive detected: {boot_drive}")
        
        # Build the by-vdev map ONCE
        byv_map = _map_by_vdev()   # {'/dev/sda': '/dev/disk/by-vdev/1-1', '/dev/nvme0n1': '/dev/disk/by-vdev/2-1', ...}
        logger.debug(f"by-vdev map: {byv_map}")

        lsblk_result = subprocess.run(
            ["lsblk", "-dnpJ", "-o", "NAME,TYPE,SIZE,ROTA,SERIAL,MODEL,MOUNTPOINT,RO"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        if lsblk_result.returncode != 0:
            logger.error(f"lsblk command failed: {lsblk_result.stderr}")
            return []

        data = json.loads(lsblk_result.stdout)
        disks = []

        for device in data.get("blockdevices", []):
            name = device["name"]                            # /dev/sda or /dev/nvme0n1
            base = re.sub(r"(p?\d+)$", "", name)             # /dev/sda, /dev/nvme0n1
            dtype = device.get("type", "").lower()

            if nvme_only and "nvme" not in name:
                continue
            if dtype == "loop":
                continue
            if boot_drive and (name == boot_drive or (boot_drive in name)):
                logger.info(f"Skipping boot drive: {name}")
                continue
            
            # Look up a base (whole) device in the by-vdev map
            # (lsblk -d already gives whole devices, but we strip just in case)
            base = re.sub(r"(p?\d+)$", "", name)
            vdev_path = byv_map.get(base, "N/A")

            # udevadm info (works as user)
            ures = subprocess.run(
                ["udevadm", "info", "--query=all", f"--name={name}"],
                stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
            )
            udev_info = {}
            if ures.returncode == 0:
                for line in ures.stdout.splitlines():
                    if "=" in line:
                        k, v = line.split("=", 1)
                        udev_info[k.strip()] = v.strip()
            else:
                logger.warning(f"udevadm failed for {name}: {ures.stderr.strip()}")

            smart = get_smartctl_data(name.split("/")[-1])

            # rota may be 0/1 (int) or "0"/"1" (str). Convert safely.
            rota_raw = device.get("rota", 0)
            try:
                rota_bool = bool(int(rota_raw))
            except Exception:
                rota_bool = False

            ro_raw = device.get("ro", 0)
            try:
                ro = int(ro_raw) == 0
            except Exception:
                ro = True

            id_path = udev_info.get("E: ID_PATH")
            phy_path = f"/dev/disk/by-path/{id_path}" if id_path else "unknown"

            health_raw = smart.get("health")
            health = "Unknown" if not health_raw else ("OK" if health_raw.upper() == "PASSED" else "POOR")

            leaf = os.path.basename(base)  # "sda"
            disk_data = {
                "vdev_path": vdev_path,
                "phy_path": phy_path,
                "sd_path": name,
                "name": leaf,
                "model": device.get("model") or udev_info.get("E: ID_MODEL", "Unknown"),
                "serial": device.get("serial") or udev_info.get("E: ID_SERIAL_SHORT", "Unknown"),
                "capacity": device.get("size", "0"),
                "type": "NVMe" if "nvme" in name else device.get("type", "Disk").capitalize(),
                "usable": ro,  # True if not read-only
                "temp": f"{smart['temp']}℃" if smart["temp"] is not None else "Unknown",
                "health": health,
                "rotation_rate": 0 if "nvme" in name else (7200 if rota_bool else 0),  # heuristic
                "power_on_count": smart["power_cycle_count"],
                "power_on_time": smart["power_on_hours"],
                "has_partitions": "E: ID_PART_TABLE_TYPE" in udev_info,
            }

            logger.debug(f"Discovered disk (lsblk): {{'name': '{disk_data['name']}', 'vdev_path': '{vdev_path}'}}")
            disks.append(disk_data)

        logger.info(f"Disks discovered: {len(disks)}")
        return disks
    except Exception as e:
        logger.error(f"Exception in get_lsblk_disks: {e}")
        return []

def main():
    try:
        if hasattr(os, "geteuid") and os.geteuid() != 0:
            logger.info("Running unprivileged: SMART/serial may be limited.")

        logger.info("=" * 80)
        logger.info("Starting a new run of get-disks script")

        lsdev_disks = get_lsdev_disks()
        if lsdev_disks is not None:
            nvme_disks = get_lsblk_disks(nvme_only=True)
            all_disks = lsdev_disks + nvme_disks
        else:
            all_disks = get_lsblk_disks(nvme_only=False)

        logger.info(f"Total disks discovered: {len(all_disks)}")
        print(json.dumps(all_disks, indent=4))
    except Exception as e:
        logger.error(f"Exception in main: {e}")
        print("[]")  # ensure caller never sees empty/undefined

if __name__ == "__main__":
    main()
