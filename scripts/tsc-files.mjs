#!/usr/bin/env node

// @ts-check
// modified https://www.npmjs.com/package/tsc-files
// Fix: pnpm not work due to tsc bin file path not resolve correctly
// Feature: filter and show only errors about the files

import { execSync } from 'node:child_process';
import { readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const randomChars = () => {
  return Math.random().toString(36).slice(2);
};

// @ts-expect-error
const resolveFromRoot = (...paths) => {
  return join(process.cwd(), ...paths);
};

const args = process.argv.slice(2);
const isVerbose = args.includes('--verbose');

const argsProjectIndex = args.findIndex(arg => ['-p', '--project'].includes(arg));

const argsProjectValue = argsProjectIndex !== -1 ? args[argsProjectIndex + 1] : undefined;

const files = args.filter(file => /\.(ts|tsx)$/.test(file));
if (files.length === 0) {
  process.exit(0);
}

const remainingArgsToForward = args.slice().filter(arg => !files.includes(arg));

if (argsProjectIndex !== -1) {
  remainingArgsToForward.splice(argsProjectIndex, 2);
}

// Load existing config
const tsconfigPath = argsProjectValue || resolveFromRoot('tsconfig.json');
const tsconfigContent = readFileSync(tsconfigPath).toString();
// biome-ignore lint/style/useConst: TypeError: Attempted to assign to readonly property.
let tsconfig = {};

// biome-ignore lint/security/noGlobalEval: Use 'eval' to read the JSON as regular JavaScript syntax so that comments are allowed
eval(`tsconfig = ${tsconfigContent}`);

// Write a temp config file
const tempTsConfigFilename = `tsconfig.tsc-files.${randomChars()}.json`;
const tmpTsconfigPath = resolveFromRoot(tempTsConfigFilename);
const tmpTsconfig = {
  ...tsconfig,
  compilerOptions: {
    // @ts-expect-error
    ...tsconfig.compilerOptions,
    skipLibCheck: true,
  },
  files,
  include: [],
};

const tmpTsconfigContent = JSON.stringify(tmpTsconfig, null, 2);

if (isVerbose) {
  console.log('write to:', tmpTsconfigPath, 'with content:', tmpTsconfigContent);
}

writeFileSync(tmpTsconfigPath, tmpTsconfigContent);

// Attach cleanup handlers
let didCleanup = false;
for (const eventName of ['exit', 'SIGHUP', 'SIGINT', 'SIGTERM']) {
  process.on(eventName, exitCode => {
    if (didCleanup) return;
    didCleanup = true;
    // console.log('Cleaning up temporary tsconfig file:', tmpTsconfigPath)

    unlinkSync(tmpTsconfigPath);

    if (eventName !== 'exit') {
      process.exit(exitCode);
    }
  });
}

main(tempTsConfigFilename, files);

/**
 * @param {string} tempTsConfigFilename
 * @param {string[]} tsFilesToCheck
 */
function main(tempTsConfigFilename, tsFilesToCheck) {
  const cmd = `npx tsc -p ${tempTsConfigFilename} --noEmit`;
  // console.log('Running command:', cmd)
  try {
    const stdout = execSync(cmd);
    console.log('✅ Type-checking success for ALL files', stdout?.toString());
  } catch (error) {
    /** @type {string} */
    // @ts-expect-error
    const stdout = error.stdout.toString();
    /** @type {number} */
    // @ts-expect-error
    const status = error.status;

    const lines = stdout.split('\n');
    const filteredLines = lines.filter(line => tsFilesToCheck.some(file => line.includes(file)));

    // 其他文件有错误也会导致退出码非0，这里只关注指定文件的错误，故认为是成功
    if (filteredLines.length === 0) {
      console.log(
        '✅ Type-checking success for the files (others files errors ignored):',
        tsFilesToCheck,
      );

      if (isVerbose) {
        console.error();
        console.error('But other files have errors:');
        console.error(stdout);
        process.exitCode = status;
      }

      process.exitCode = 0;
      return;
    }

    console.error('❌ Type-checking failed with status:', status, '\n');
    console.error(filteredLines.join('\n'));

    process.exitCode = status;
    return;
  }
}
