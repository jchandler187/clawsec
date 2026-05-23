#!/usr/bin/env bash
# ClawSec Common - Configuration
# Centralizes INTEL_DIR and CLAWSEC_HOME with env var overrides
# Usage: source this file from any script

export CLAWSEC_HOME="${CLAWSEC_HOME:-$HOME/.clawsec}"
export CLAWSEC_INTEL_DIR="${CLAWSEC_INTEL_DIR:-$CLAWSEC_HOME/intel}"
export CLAWSEC_REPORTS_DIR="${CLAWSEC_REPORTS_DIR:-$CLAWSEC_HOME/reports}"
