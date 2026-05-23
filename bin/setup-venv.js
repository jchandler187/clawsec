#!/usr/bin/env node
/**
 * ClawSec postinstall — sets up Python venv
 * Called by npm postinstall. Safe to run multiple times.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const CLAWSEC_HOME = process.env.CLAWSEC_HOME || path.join(os.homedir(), '.clawsec');
const VENV_DIR = path.join(CLAWSEC_HOME, 'venv');
const PYTHON = path.join(VENV_DIR, 'bin', 'python3');

// Don't fail install if setup fails — user can run clawsec setup later
try {
  if (fs.existsSync(PYTHON)) {
    process.exit(0); // Already set up
  }

  fs.mkdirSync(CLAWSEC_HOME, { recursive: true });
  execSync(`python3 -m venv "${VENV_DIR}"`, { stdio: 'pipe' });

  const PKG_ROOT = path.resolve(__dirname, '..');
  const REQUIREMENTS = path.join(PKG_ROOT, 'requirements.txt');

  if (fs.existsSync(REQUIREMENTS)) {
    execSync(`"${PYTHON}" -m pip install --quiet --upgrade pip`, { stdio: 'pipe' });
    execSync(`"${PYTHON}" -m pip install --quiet -r "${REQUIREMENTS}"`, { stdio: 'pipe' });
  }
} catch {
  // Postinstall is best-effort. The CLI will try again on first run.
  process.exit(0);
}