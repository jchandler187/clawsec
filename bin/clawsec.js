#!/usr/bin/env node
/**
 * ⚡ ClawSec CLI Entry Point
 * Bootstraps Python venv if needed, then delegates to clawsec.py
 */

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const CLAWSEC_HOME = process.env.CLAWSEC_HOME || path.join(os.homedir(), '.clawsec');
const VENV_DIR = path.join(CLAWSEC_HOME, 'venv');
const PYTHON = path.join(VENV_DIR, 'bin', 'python3');

// Resolve package root — walk up from __dirname to find cli/clawsec.py
function findPackageRoot() {
  let dir = __dirname;
  // Check if we're running from installed package
  if (fs.existsSync(path.join(dir, '..', 'cli', 'clawsec.py'))) {
    return path.resolve(dir, '..');
  }
  // Fallback
  return path.resolve(dir, '..');
}

const PKG_ROOT = findPackageRoot();
const CLAWSEC_PY = path.join(PKG_ROOT, 'cli', 'clawsec.py');
const REQUIREMENTS = path.join(PKG_ROOT, 'requirements.txt');

function log(msg) {
  // Only show setup messages, not the ⚡ branding (Python handles that)
  process.stderr.write(msg + '\n');
}

function setupVenv() {
  if (fs.existsSync(PYTHON)) {
    return true;
  }

  log('⚡ Setting up ClawSec Python environment (first run only)...');

  try {
    // Create CLAWSEC_HOME
    fs.mkdirSync(CLAWSEC_HOME, { recursive: true });

    // Create venv
    log('  Creating Python venv...');
    execSync(`python3 -m venv "${VENV_DIR}"`, { stdio: 'inherit' });

    // Install requirements
    if (fs.existsSync(REQUIREMENTS)) {
      log('  Installing Python dependencies...');
      execSync(`"${PYTHON}" -m pip install --quiet --upgrade pip`, { stdio: 'inherit' });
      execSync(`"${PYTHON}" -m pip install --quiet -r "${REQUIREMENTS}"`, { stdio: 'inherit' });
    }

    log('  ✅ Python environment ready.');
    return true;
  } catch (err) {
    log(`❌ Failed to set up Python environment: ${err.message}`);
    log('   Try running: clawsec setup');
    return false;
  }
}

function run() {
  // Ensure venv exists
  if (!setupVenv()) {
    process.exit(1);
  }

  // Build args — pass through all CLI args
  const args = [CLAWSEC_PY, ...process.argv.slice(2)];

  // Set env vars for Python subprocess
  const env = {
    ...process.env,
    CLAWSEC_HOME: CLAWSEC_HOME,
    CLAWSEC_INTEL_DIR: process.env.CLAWSEC_INTEL_DIR || path.join(CLAWSEC_HOME, 'intel'),
    PATH: `${path.join(os.homedir(), '.local', 'bin')}:${process.env.PATH || '/usr/local/bin:/usr/bin:/bin'}`,
  };

  const child = spawn(PYTHON, args, {
    env,
    stdio: 'inherit',
  });

  child.on('close', (code) => {
    process.exit(code ?? 1);
  });

  child.on('error', (err) => {
    log(`❌ Failed to run clawsec: ${err.message}`);
    process.exit(1);
  });
}

run();