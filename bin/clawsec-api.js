#!/usr/bin/env node
/**
 * ⚡ ClawSec API Server Entry Point
 * Starts the Express API server
 */

const path = require('path');

// Set defaults before requiring server
const CLAWSEC_HOME = process.env.CLAWSEC_HOME || path.join(require('os').homedir(), '.clawsec');
const INTEL_DIR = process.env.CLAWSEC_INTEL_DIR || path.join(CLAWSEC_HOME, 'intel');
const REPORTS_DIR = path.join(CLAWSEC_HOME, 'reports');

process.env.CLAWSEC_HOME = CLAWSEC_HOME;
process.env.CLAWSEC_INTEL_DIR = INTEL_DIR;
process.env.CLAWSEC_REPORTS_DIR = REPORTS_DIR;

// Require the server — it reads env vars at module level
require('../api/src/server');