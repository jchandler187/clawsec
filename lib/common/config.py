"""ClawSec Common - Configuration

Centralizes INTEL_DIR and CLAWSEC_HOME with env var overrides.
Usage:
    from lib.common.config import INTEL_DIR, CLAWSEC_HOME
"""

import os

CLAWSEC_HOME = os.environ.get("CLAWSEC_HOME", os.path.expanduser("~/.clawsec"))
INTEL_DIR = os.environ.get("CLAWSEC_INTEL_DIR", os.path.join(CLAWSEC_HOME, "intel"))
REPORTS_DIR = os.environ.get("CLAWSEC_REPORTS_DIR", os.path.join(CLAWSEC_HOME, "reports"))
