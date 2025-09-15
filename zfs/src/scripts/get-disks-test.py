#!/usr/bin/env python3
import sys, os, logging, subprocess, json, re
from logging.handlers import RotatingFileHandler, SysLogHandler
from pathlib import Path

# ------------------------- debug prints -------------------------
# Set GETDISKS_DEBUG=0 to suppress stderr debug prints.
DEBUG = os.environ.get("GETDISKS_DEBUG", "1") not in ("0", "false", "False", "no", "NO")

def dprint(msg: str):
    if DEBUG:
        try:
            print(msg, file=sys.stderr, flush=True)
        except Exception:
            pass

# ------------------------- logging -------------------------
def get_logger(name: str, file_basename: str, app_name: str = "cockpit-zfs") -> logging.Logger:
    logger = logging.getLogger(name)
    if logger.handlers:
        dprint(f"[get_logger] Reusing existing logger for {name}")
        return logger
    logger.setLevel(logging.DEBUG)
    logger.propagate = False

    for addr in ("/dev/log", "/run/systemd/journal/syslog"):
        try:
            if os.path.exists(addr):
                h = SysLogHandler(address=addr, facility=SysLogHandler.LOG_USER)
                h.setFormatter(logging.Formatter(f"{name}: %(levelname)s: %(message)s"))
                logger.addHandler(h)
                logger.debug(f"Syslog handler attached via {addr}")
                dprint(f"[get_logger] Using syslog at {addr}")
                return logger
        except Exception as e:
            dprint(f"[get_logger] Syslog attach failed for {addr}: {e}")
            pass

    def _candidates():
        xs = os.environ.get("XDG_STATE_HOME", os.path.expanduser("~/.local/state"))
        xc = os.environ.get("XDG_CACHE_HOME", os.path.expanduser("~/.cache"))
        xr = os.environ.get("XDG_RUNTIME_DIR")
        for base in (xs, xc, xr):
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
            dprint(f"[get_logger] Using file logger at {path}")
            return logger
        except Exception as e:
            dprint(f"[get_logger] File logger setup failed at {path}: {e}")
            pass

    sh = logging.StreamHandler(sys.stderr)
    sh.setFormatter(fmt)
    logger.addHandler(sh)
    logger.warning("No syslog/file target available; logging to stderr.")
    dprint("[get_logger] Using stderr logging (fallback)")
    return logger


logger = get_logger("cockpit_zfs_getdisks", "getdisks.log")

# ------------------------- helpers -------------------------
_partitions_text_cache = None

def _partitions_text():
    """Cache /proc/partitions for cheap has_partitions checks (non-root-safe)."""
    global _partitions_text_cache
    if _partitions_text_cache is None:
        try:
            with open("/proc/partitions", "r") as f:
                _partitions_text_cache = f.read()
                dprint(f"[_partitions_text] Loaded /proc/partitions ({len(_partitions_text_cache)} bytes)")
        except Exception as e:
            dprint(f"[_partitions_text] Failed to read /proc/partitions: {e}")
            _partitions_text_cache = ""
    return _partitions_text_cache

def _has_partitions_for(base_name: str) -> bool:
    # matches sda1 / nvme0n1p2 lines in /proc/partitions
    return re.search(rf"\b{re.escape(base_name)}(p?\d+)\b", _partitions_text()) is not None


def _dev_base(p: str) -> str:
    """
    Normalize to base block dev:
      /dev/sda2         -> /dev/sda
      /dev/nvme0n1p3    -> /dev/nvme0n1
      /dev/mmcblk0p1    -> /dev/mmcblk0
    Never strip the trailing '1' from nvme0n1!
    """
    s = str(p)
    # NVMe partitions: keep nvmeXnY, drop pZ
    s = re.sub(r'^(.*?/nvme\d+n\d+)p\d+$', r'\1', s)
    # MMC partitions
    s = re.sub(r'^(.*?/mmcblk\d+)p\d+$', r'\1', s)
    # SCSI/SATA (sdX<partition#>)
    s = re.sub(r'^(.*?/sd[a-z]+)\d+$', r'\1', s)
    return s


def _get_boot_disk():
    """Return base device of /boot (preferred) or / (fallback), e.g. /dev/sda or /dev/nvme0n1."""
    try:
        r = subprocess.run(
            ["lsblk", "-no", "NAME,MOUNTPOINT"],
            stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True
        )
        if r.returncode != 0:
            logger.error(f"lsblk for boot detection failed: {r.stderr}")
            dprint(f"[_get_boot_disk] lsblk failed with code {r.returncode}: {r.stderr.strip()}")
            return None

        boot = None
        lines = r.stdout.strip().splitlines()
        dprint(f"[_get_boot_disk] Scanning {len(lines)} lsblk lines for /boot or /")
        for line in lines:
            parts = line.strip().split(None, 1)
            if len(parts) < 2:
                continue
            dev, mp = parts
            dev = "/dev/" + re.sub(r"[^\w/-]", "", dev.strip())
            if mp == "/boot":
                boot = dev; break
            if mp == "/":
                boot = dev
        boot_base = _dev_base(boot) if boot else None
        logger.info(f"Boot base device: {boot_base}")
        dprint(f"[_get_boot_disk] boot={boot} -> base={boot_base}")
        return boot_base
    except Exception as e:
        logger.error(f"boot detection error: {e}")
        dprint(f"[_get_boot_disk] Exception: {e}")
        return None


def _enrich_with_lsblk_and_udev(disks):
    """
    Non-root enrichment: add model/serial/usable/rota and better phy_path if missing,
    using one lsblk JSON call and per-device udevadm property calls.
    """
    if not disks:
        dprint("[_enrich_with_lsblk_and_udev] No disks to enrich")
        return disks

    dprint(f"[_enrich_with_lsblk_and_udev] Starting with {len(disks)} disks")

    # Build quick lookup by sd_path base
    by_sd = { _dev_base(d["sd_path"]): d for d in disks if d.get("sd_path") }

    # Single lsblk JSON call for base block devices
    try:
        r = subprocess.run(
            ["lsblk", "-dnpJ", "-o", "NAME,ROTA,SERIAL,MODEL,RO,SIZE,TYPE"],
            stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True
        )
        if r.returncode == 0:
            data = json.loads(r.stdout or "{}")
            touched = 0
            for bd in data.get("blockdevices", []):
                name = bd.get("name")
                if not name:
                    continue
                base = _dev_base(name)
                target = by_sd.get(base)
                if not target:
                    continue

                # model / serial
                model = (bd.get("model") or "").strip()
                serial = (bd.get("serial") or "").strip()
                if target.get("model", "Unknown") == "Unknown" and model:
                    target["model"] = model
                if target.get("serial", "Unknown") == "Unknown" and serial:
                    target["serial"] = serial

                # usable from RO bit, if present
                ro = bd.get("ro")
                try:
                    if ro is not None:
                        target["usable"] = (int(ro) == 0)
                except Exception:
                    pass

                # rotation heuristic (true rota -> assume 7200, else 0)
                rota = bd.get("rota")
                try:
                    rota_bool = bool(int(rota))
                    if target.get("type","" ).upper() != "NVME":
                        target["rotation_rate"] = 7200 if rota_bool else 0
                except Exception:
                    pass
                touched += 1
            dprint(f"[_enrich_with_lsblk_and_udev] Updated {touched} entries from lsblk")
        else:
            logger.warning(f"lsblk enrichment failed: {r.stderr.strip()}")
            dprint(f"[_enrich_with_lsblk_and_udev] lsblk returned {r.returncode}: {r.stderr.strip()}")
    except Exception as e:
        logger.warning(f"lsblk enrichment exception: {e}")
        dprint(f"[_enrich_with_lsblk_and_udev] Exception running lsblk: {e}")

    # Per-device udevadm for ID_PATH fallback and possible model/serial if lsblk lacked them
    had_id_path = 0
    model_set = 0
    serial_set = 0
    for base, d in by_sd.items():
        try:
            ur = subprocess.run(
                ["udevadm", "info", "--query=property", f"--name={base}"],
                stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True
            )
            if ur.returncode != 0:
                continue
            props = {}
            for line in ur.stdout.splitlines():
                if "=" in line:
                    k, v = line.split("=", 1)
                    props[k.strip()] = v.strip()
            # by-path: if lsdev text didn't have a good one
            if (not d.get("phy_path")) or d["phy_path"] in ("unknown", "N/A"):
                id_path = props.get("ID_PATH")
                if id_path:
                    d["phy_path"] = f"/dev/disk/by-path/{id_path}"
                    had_id_path += 1

            # model / serial (only fill if still Unknown)
            if d.get("model", "Unknown") == "Unknown":
                m = props.get("ID_MODEL")
                if m:
                    d["model"] = m
                    model_set += 1
            if d.get("serial", "Unknown") == "Unknown":
                s = props.get("ID_SERIAL_SHORT") or props.get("ID_SERIAL")
                if s:
                    d["serial"] = s
                    serial_set += 1
        except Exception as e:
            dprint(f"[_enrich_with_lsblk_and_udev] udevadm failed for {base}: {e}")
            pass

    dprint(f"[_enrich_with_lsblk_and_udev] Added ID_PATH for {had_id_path}, model for {model_set}, serial for {serial_set}")
    return disks

# ------------------------- lsdev paths -------------------------
ANSI_RE = re.compile(r'\x1B\[[0-?]*[ -/]*[@-~]')

def _parse_lsdev_text_table(text: str):
    """
    Parse `lsdev -n -dtcp` rows like:
      | ** 1-1  (/dev/sda,/dev/disk/by-path/...,HDD,10.91 TiB) |
    """
    disks = []
    nonmatch_sample = 0

    dprint(f"[_parse_lsdev_text_table] Parsing {len(text)} bytes of lsdev text")

    for raw in text.splitlines():
        # 0) Strip ANSI
        raw = ANSI_RE.sub('', raw)

        # 1) Normalize borders: remove leading/trailing '|' and whitespace
        line = raw.strip()
        if line.startswith('|'):
            line = line[1:].rstrip()
        if line.endswith('|'):
            line = line[:-1].rstrip()
        line = line.strip()

        # 2) Skip ASCII borders / headers / legends
        if (not line or
            line.startswith("Storage Disk Info") or
            line.startswith("Disk Controller") or
            "Row " in line or
            "Legend:" in line or
            set(line) <= set("+-")  # lines like +-----+
        ):
            continue

        # 3) Remove non-color occupancy markers: "* " or "** "
        line = re.sub(r'^\*{1,2}\s*', '', line)

        # 4) We only care about rows that contain a tuple with a /dev/ path
        if "(" not in line or "/dev/" not in line:
            if nonmatch_sample < 5:
                logger.debug(f"lsdev row ignored (no tuple/dev): {repr(line)}")
                nonmatch_sample += 1
            continue

        # 5) Parse: 1-1 (/dev/sdx, /dev/disk/by-path/..., TYPE, CAPACITY)
        m = re.match(
            r'^\s*([0-9]+-[0-9]+)\s*'
            r'\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([A-Za-z]+)\s*,\s*([^)]+)\s*\)\s*$',
            line
        )
        if not m:
            if nonmatch_sample < 5:
                logger.debug(f"lsdev row did not match regex: {repr(line)}")
                nonmatch_sample += 1
            continue

        bay_id, dev, by_path, dtype, capacity = m.groups()
        base_name = os.path.basename(dev)

        disk_data = {
            "vdev_path": f"/dev/disk/by-vdev/{bay_id}",
            "phy_path": by_path or "unknown",
            "sd_path": dev,
            "name": bay_id,
            "model": "Unknown",
            "serial": "Unknown",
            "capacity": capacity.strip(),
            "type": dtype.strip(),
            "usable": True,
            "temp": "Unknown",
            "health": "Unknown",
            "rotation_rate": 0 if dtype.strip().upper() in ("SSD", "NVME") else 0,
            "power_on_count": None,
            "power_on_time": None,
            "has_partitions": _has_partitions_for(base_name),
        }
        logger.debug(f"Discovered disk (lsdev-text): {disk_data['name']} {dev} {by_path}")
        disks.append(disk_data)

    logger.info(f"Disks discovered via lsdev (text): {len(disks)}")
    dprint(f"[_parse_lsdev_text_table] Parsed {len(disks)} disks from lsdev text")
    return disks


def get_lsdev_disks():
    try:
        boot_base = _get_boot_disk()
        dprint(f"[get_lsdev_disks] boot_base={boot_base}")

        if hasattr(os, "geteuid") and os.geteuid() == 0:
            dprint("[get_lsdev_disks] Running as root: using lsdev JSON path")
            # Root path: JSON with SMART
            r = subprocess.run(["lsdev", "-jdHmtTsfcp"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
            if r.returncode != 0:
                logger.error(f"lsdev JSON failed: {r.stderr}")
                dprint(f"[get_lsdev_disks] lsdev JSON failed ({r.returncode}): {r.stderr.strip()}")
                return None

            data = json.loads(r.stdout or "{}")
            disks = []
            for row in data.get("rows", []):
                for d in row:
                    if not d.get("occupied"):
                        continue
                    dev = d.get("dev")
                    if not dev:
                        continue
                    if boot_base and _dev_base(dev) == boot_base:
                        logger.info(f"Skipping boot drive (lsdev JSON): {dev}")
                        dprint(f"[get_lsdev_disks] Skipping boot drive (JSON): {dev}")
                        continue
                    parts = int(d.get("partitions", 0))
                    disks.append({
                        "vdev_path": f"/dev/disk/by-vdev/{d['bay-id']}",
                        "phy_path": d.get("dev-by-path") or "unknown",
                        "sd_path": dev,
                        "name": d["bay-id"],
                        "model": d.get("model-name", "Unknown"),
                        "serial": d.get("serial", "Unknown"),
                        "capacity": d.get("capacity", "0"),
                        "type": d.get("disk_type", "Disk"),
                        "usable": True,
                        "temp": d.get("temp-c"),
                        "health": d.get("health", "Unknown"),
                        "rotation_rate": d.get("rotation-rate", 0),
                        "power_on_count": d.get("power-cycle-count"),
                        "power_on_time": d.get("power-on-time"),
                        "has_partitions": parts > 0,
                    })
            logger.info(f"Disks discovered via lsdev (JSON): {len(disks)}")
            dprint(f"[get_lsdev_disks] Parsed {len(disks)} disks from lsdev JSON")
            return disks

        # Non-root path: parse table, enrich
        dprint("[get_lsdev_disks] Non-root path: using lsdev text + enrichment")
        r = subprocess.run(["lsdev", "-ndtcp"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
        if r.returncode != 0:
            logger.warning(f"lsdev text failed ({r.returncode}): {r.stderr.strip()}")
            dprint(f"[get_lsdev_disks] lsdev text failed ({r.returncode}): {r.stderr.strip()}")
            return None

        disks = _parse_lsdev_text_table(r.stdout)

        # Skip boot drive
        if boot_base:
            before = len(disks)
            disks = [d for d in disks if _dev_base(d.get("sd_path","")) != boot_base]
            if len(disks) != before:
                logger.info(f"Skipped boot drive (lsdev text): {boot_base}")
                dprint(f"[get_lsdev_disks] Skipped boot drive (text): {boot_base}")

        # Enrich non-root details
        disks = _enrich_with_lsblk_and_udev(disks)
        dprint(f"[get_lsdev_disks] Returning {len(disks)} disks after enrichment")
        return disks

    except Exception as e:
        logger.error(f"Exception in get_lsdev_disks: {e}")
        dprint(f"[get_lsdev_disks] Exception: {e}")
        return None

# ------------------------- lsblk (NVMe & fallback) -------------------------
def get_smartctl_data(device):
    """Best-effort SMART; usually fails non-root → returns Unknowns."""
    try:
        r = subprocess.run(["smartctl", "-a", f"/dev/{device}"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
        if r.returncode != 0:
            logger.info(f"smartctl limited/failed for {device}: {r.stderr.strip()}")
            dprint(f"[get_smartctl_data] smartctl {device} returned {r.returncode}: {r.stderr.strip()}")
            return {"temp": None, "power_on_hours": None, "power_cycle_count": None, "health": None}

        out = r.stdout.splitlines()
        info = {"temp": None, "power_on_hours": None, "power_cycle_count": None, "health": None}
        for line in out:
            if ("Temperature" in line and "Celsius" in line) or "Temperature_Celsius" in line:
                nums = [int(t) for t in re.findall(r"(\d+)", line)]
                if nums: info["temp"] = nums[-1]
            elif "Power_On_Hours" in line or "Power On Hours" in line:
                nums = re.findall(r"(\d+)", line); info["power_on_hours"] = int(nums[-1]) if nums else None
            elif "Power_Cycle_Count" in line or "Power Cycle Count" in line:
                nums = re.findall(r"(\d+)", line); info["power_cycle_count"] = int(nums[-1]) if nums else None
            elif "SMART overall-health" in line or "SMART overall-health self-assessment" in line:
                if ":" in line: info["health"] = line.split(":", 1)[1].strip()
        return info
    except Exception as e:
        logger.error(f"smartctl exception: {e}")
        dprint(f"[get_smartctl_data] Exception for {device}: {e}")
        return {"temp": None, "power_on_hours": None, "power_cycle_count": None, "health": None}

def _map_by_vdev():
    base_dir = "/dev/disk/by-vdev"
    m = {}
    if not os.path.isdir(base_dir):
        dprint(f"[_map_by_vdev] {base_dir} not present")
        return m
    for link in os.listdir(base_dir):
        full = os.path.join(base_dir, link)
        try:
            target = os.path.realpath(full)
            base = _dev_base(target)
            base_name = link.split("-part")[0]
            m[base] = os.path.join(base_dir, base_name)
        except Exception as e:
            dprint(f"[_map_by_vdev] Failed to resolve {full}: {e}")
            pass
    dprint(f"[_map_by_vdev] Mapped {len(m)} entries from {base_dir}")
    return m

def get_lsblk_disks(nvme_only=False):
    try:
        boot_base = _get_boot_disk()
        byv_map = _map_by_vdev()

        dprint(f"[get_lsblk_disks] nvme_only={nvme_only} boot_base={boot_base}")
        r = subprocess.run(
            ["lsblk", "-dnpJ", "-o", "NAME,TYPE,SIZE,ROTA,SERIAL,MODEL,MOUNTPOINT,RO"],
            stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True
        )
        if r.returncode != 0:
            logger.error(f"lsblk command failed: {r.stderr}")
            dprint(f"[get_lsblk_disks] lsblk failed ({r.returncode}): {r.stderr.strip()}")
            return []

        data = json.loads(r.stdout or "{}")
        disks = []

        skipped_loop = 0
        skipped_nvme_only = 0
        skipped_boot = 0

        for device in data.get("blockdevices", []):
            name = device.get("name")
            if not name:
                logger.debug("lsblk device without name -> skip")
                continue
            if nvme_only and "nvme" not in name:
                skipped_nvme_only += 1
                continue
            if device.get("type","" ).lower() == "loop":
                skipped_loop += 1
                continue
            if boot_base and _dev_base(name) == boot_base:
                logger.info(f"Skipping boot drive (lsblk): {name}")
                skipped_boot += 1
                continue

            vdev_path = byv_map.get(_dev_base(name), "N/A")

            # non-root SMART likely empty; still call best-effort
            smart = get_smartctl_data(name.split("/")[-1])

            rota_raw = device.get("rota", 0)
            try:
                rota_bool = bool(int(rota_raw))
            except Exception:
                rota_bool = False

            ro_raw = device.get("ro", 0)
            try:
                usable = (int(ro_raw) == 0)
            except Exception:
                usable = True

            # prefer udev ID_PATH for phy_path
            phy_path = "unknown"
            try:
                ur = subprocess.run(
                    ["udevadm", "info", "--query=property", f"--name={name}"],
                    stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True
                )
                if ur.returncode == 0:
                    props = dict(line.split("=",1) for line in ur.stdout.splitlines() if "=" in line)
                    if props.get("ID_PATH"):
                        phy_path = f"/dev/disk/by-path/{props['ID_PATH']}"
            except Exception as e:
                dprint(f"[get_lsblk_disks] udevadm failed for {name}: {e}")
                pass

            health_raw = smart.get("health")
            health = "Unknown" if not health_raw else ("OK" if str(health_raw).upper() == "PASSED" else "POOR")

            disks.append({
                "vdev_path": vdev_path,
                "phy_path": phy_path,
                "sd_path": name,
                "name": os.path.basename(_dev_base(name)),
                "model": device.get("model") or "Unknown",
                "serial": device.get("serial") or "Unknown",
                "capacity": device.get("size", "0"),
                "type": "NVMe" if "nvme" in name else device.get("type","Disk").capitalize(),
                "usable": usable,
                "temp": f"{smart['temp']}℃" if smart["temp"] is not None else "Unknown",
                "health": health,
                "rotation_rate": 0 if "nvme" in name else (7200 if rota_bool else 0),
                "power_on_count": smart["power_cycle_count"],
                "power_on_time": smart["power_on_hours"],
                "has_partitions": False,  # we don't care here; UI can compute if needed
            })
        logger.info(f"Disks discovered via lsblk: {len(disks)}")
        dprint(f"[get_lsblk_disks] Built {len(disks)} disks (skipped loop={skipped_loop}, nvme_only={skipped_nvme_only}, boot={skipped_boot})")
        return disks
    except Exception as e:
        logger.error(f"Exception in get_lsblk_disks: {e}")
        dprint(f"[get_lsblk_disks] Exception: {e}")
        return []

UNKNOWN = {None, "", "Unknown", "N/A"}

PREFER_LSDEV = {
    # lsdev is authoritative for these
    "vdev_path", "name", "phy_path", "type", "capacity",
    # if you trust lsdev’s rotation_rate more than lsblk’s rota heuristic:
    "rotation_rate",
}

def merge_overlay(base: dict, overlay: dict) -> dict:
    out = dict(base)
    # 1) Add keys lsblk doesn’t have
    for k, v in overlay.items():
        if k not in out and v not in UNKNOWN:
            out[k] = v
    # 2) Resolve conflicts
    conflicts = []
    for k, v in overlay.items():
        if v in UNKNOWN:
            continue
        if k in PREFER_LSDEV:
            if out.get(k) != v:
                conflicts.append(k)
            out[k] = v
        else:
            # keep existing unless it's unknown
            if out.get(k) in UNKNOWN:
                out[k] = v
    if conflicts:
        dprint(f"[merge_overlay] Preferred lsdev fields overridden: {conflicts}")
    return out

# ------------------------- main -------------------------
def main():
    try:
        if hasattr(os, "geteuid") and os.geteuid() != 0:
            logger.info("Running unprivileged: SMART/serial may be limited.")
            dprint("[main] Running unprivileged; SMART/serial may be limited")

        logger.info("=" * 80)
        logger.info("Starting a new run of get-disks script")
        dprint("[main] Starting discovery run")

        # Always collect everything from lsblk first (covers NVMe + sda/sdb/...)
        blk_all = get_lsblk_disks(nvme_only=False)
        dprint(f"[main] lsblk returned {len(blk_all)} entries")
        disks_by_base = { _dev_base(d["sd_path"]): d for d in blk_all }
        dprint(f"[main] After lsblk, bases={len(disks_by_base)} (sample: {list(disks_by_base.keys())[:5]})")

        lsdev_disks = get_lsdev_disks() or []
        dprint(f"[main] lsdev returned {len(lsdev_disks)} entries")
        merged = 0
        for d in lsdev_disks:
            base = _dev_base(d.get("sd_path",""))
            if not base:
                continue
            disks_by_base[base] = merge_overlay(disks_by_base.get(base, {}), d)
            merged += 1
        dprint(f"[main] Merged {merged} lsdev entries into map -> {len(disks_by_base)} total bases")

        all_disks = list(disks_by_base.values())

        logger.info(f"Total disks discovered: {len(all_disks)}")
        dprint(f"[main] Total disks discovered: {len(all_disks)}")
        print(json.dumps(all_disks, indent=4))
    except Exception as e:
        logger.error(f"Exception in main: {e}")
        dprint(f"[main] Exception: {e}")
        print("[]")

if __name__ == "__main__":
    main()
