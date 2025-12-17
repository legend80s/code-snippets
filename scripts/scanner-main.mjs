#!/usr/bin/env node
// @ts-check

import { main as scanMockData } from './scanner-mock-data.mjs';
import { main as scanSecrets } from './scanner-secrets.mjs';

const secretsPassed = scanSecrets();

if (secretsPassed) {
  scanMockData();
}

// console.log('process.exitCode:', process.exitCode);
