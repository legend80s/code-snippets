#!/usr/bin/env node

// @ts-check
// Modified https://www.npmjs.com/package/tsc-files
// Fix: pnpm not work due to tsc bin file path not resolve correctly
// Feature: filter and show only errors about the files
// Perf: use tsgo instead of tsc for better performance (4.3x = 5.66s ↓ 1.3s)

// import { $ } from 'bun';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const randomChars = () => {
  return Math.random().toString(36).slice(2);
};

// @ts-expect-error
const resolveFromRoot = (...paths) => {
  return join(process.cwd(), ...paths);
};

let args = process.argv.slice(2);

const isVerbose = args.includes('--my-verbose');
// Remove none tsc args
args = args.filter(arg => !['--my-verbose'].includes(arg));

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
  // const args = `-v`;
  let args = [`-p`, tempTsConfigFilename, ...remainingArgsToForward];
  // @ts-expect-error
  args = args.join(' ');
  const typescriptCompiler = 'tsgo';
  const absolutePath = resolveFromRoot(`node_modules/.bin/${typescriptCompiler}`);
  const cmd = `${absolutePath} ${args}`;

  if (isVerbose) {
    console.log(`Running command: "${cmd}"`);
  }

  try {
    const stdout = execSync(cmd);
    console.log('✅ Type-checking success for ALL files', stdout?.toString());
  } catch (execError) {
    /** @type {string} */
    // @ts-expect-error
    const stdout = execError.stdout.toString().trim();
    /** @type {string} */
    // @ts-expect-error
    const stderr = execError.stderr.toString().trim();
    /** @type {number} */
    // @ts-expect-error
    const exitCode = execError.status;
    // if absolutePath not exists
    if (!existsSync(absolutePath)) {
      errorLog('Type-checking failed:', stderr);
      errorLog(`Please check if "${typescriptCompiler}" is installed.`);
      process.exitCode = exitCode;
      return;
    }

    const fullOutput = `${stdout}\n${stderr}`;
    const lines = fullOutput.split('\n');
    const filteredLines = lines.filter(line => tsFilesToCheck.some(file => line.includes(file)));

    // 其他文件有错误也会导致退出码非0，这里只关注指定文件的错误，故认为是成功
    if (filteredLines.length === 0) {
      console.log(
        '✅ Type-checking passed for the specified files. (Errors in other files were skipped.):',
        tsFilesToCheck,
      );

      if (isVerbose) {
        console.error();
        console.error('But other files have errors:');
        console.error(fullOutput);
        process.exitCode = exitCode;
      }

      process.exitCode = 0;
      return;
    }

    console.error('❌ Type-checking failed with exit code:', exitCode, '\n');
    console.error(filteredLines.join('\n'));

    process.exitCode = exitCode;
    return;
  }
}

/**
 * @param {...any} args
 */
function errorLog(...args) {
  console.error('[tsc-files] ❌', ...args);
}
