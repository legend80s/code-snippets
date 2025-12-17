#!/usr/bin/env node

// @ts-check
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { extname } from 'node:path';
import { SILENT_THRESHOLD } from './shared.mjs';

// 颜色输出
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  bold: '\x1b[1m',
  reset: '\x1b[0m',
};

const scanDir = 'src/';

const verbose = false;
const LABEL = '[🗝️ SCANNER_SECRETS]';

// @ts-expect-error
function colorize(color, text) {
  // @ts-expect-error
  return `${colors[color]}${text}${colors.reset}`;
}

// @ts-expect-error
function info(text) {
  verbose && console.log(colorize('green', `${text}`));
}

// @ts-expect-error
function success(text) {
  console.log(colorize('green', `${LABEL} ✅ ${text}`));
}

// @ts-expect-error
function error(text) {
  console.error(colorize('bold', colorize('red', text)));
}

/**
 * 检测敏感信息
 */
function scanSecrets() {
  const startTime = Date.now();
  info(`${LABEL} 🔍 正在执行敏感信息扫描...`);

  try {
    // 获取暂存区文件列表
    const filesOutput = execSync(`git diff --cached --diff-filter=d --name-only -- "${scanDir}"`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();

    if (!filesOutput) {
      const duration = Date.now() - startTime;
      duration > SILENT_THRESHOLD &&
        success(`没有 ${scanDir} 文件变更，跳过扫描 🕑 耗时: ${duration}ms。`);
      return true;
    }

    const files = filesOutput.split('\n').filter(f => f);

    info('待检查文件列表:');
    files.forEach((file, index) => info(`${index + 1}. ${file}`));
    info('');

    // 定义正则表达式模式
    const patterns = [
      {
        name: 'JWT 令牌',
        regex: /(eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*)/i,
        description: '以 "eyJ" 开头的JWT令牌',
      },
      {
        name: 'API 密钥',
        regex: /(sk_(live|test)_[0-9a-zA-Z]{24,})|(AKIA[0-9A-Z]{16})/i,
        description: '类似 "sk_live_xxx" 或 "AKIA..." 的API密钥',
      },
      {
        name: '基础认证',
        regex: /(https?:\/\/[^:]+:[^@]+@)/i,
        description: '包含 "username:password@" 的URL',
      },
      {
        name: 'UUID',
        // eaa0985b-6cbe-4b98-92fc-26b2cd5190e6
        regex: /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/i,
        description: '符合 UUID 格式的字符串',
      },
      {
        name: 'Bearer 令牌',
        regex: /(Bearer\s+[0-9a-fA-F-]{2,})/i,
        description: '以 "Bearer " 开头的令牌',
      },
    ];

    let hasViolation = false;

    // 检查每个文件
    for (const file of files) {
      if (!existsSync(file)) {
        continue;
      }

      // 跳过二进制文件
      const ext = extname(file).toLowerCase();
      const binaryExtensions = [
        '.bin',
        '.png',
        '.jpg',
        '.jpeg',
        '.gif',
        '.ico',
        '.svg',
        '.pdf',
        '.zip',
        '.tar',
        '.gz',
        '.exe',
        '.dll',
        '.so',
      ];
      if (binaryExtensions.includes(ext)) {
        continue;
      }

      // 获取文件的差异内容
      const diff = execSync(`git diff --cached --no-color "${file}"`, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      // 提取新增行（排除删除行）
      const addedLines = diff
        .split('\n')
        .filter(line => line.startsWith('+') && !line.startsWith('+++'))
        .map(line => line.substring(1)); // 移除前导+

      // 检查每个模式
      for (const pattern of patterns) {
        const matches = addedLines.filter(line => pattern.regex.test(line));

        if (matches.length > 0) {
          error('───────────────────────────────────────────────────────────────────────────');
          error(
            `${verbose ? '' : LABEL} 🚨 在文件 ${file} 中发现硬编码的【${pattern.name}】请移除：`,
          );

          // 显示匹配的行（最多2个）
          matches.slice(0, 2).forEach((match, index) => {
            const truncated = match.length > 100 ? `${match.substring(0, 100)}...` : match;
            error(`${index + 1}. ${truncated.trim()}`);
          });
          console.log('');

          hasViolation = true;
          break; // 为了性能考虑，一个文件发现一种敏感信息就足够
        }
      }

      // 如果已经发现违规，直接退出
      if (hasViolation) {
        break;
      }
    }

    const duration = Date.now() - startTime;

    if (hasViolation) {
      error(`${LABEL} ❌ 敏感信息扫描未通过，存在违规内容 🕑 耗时: ${duration}ms。`);
      error('───────────────────────────────────────────────────────────────────────────');

      return false;
    }

    duration > SILENT_THRESHOLD && success(`敏感信息扫描通过 🕑 耗时: ${duration}ms。`);
    return true;
  } catch (err) {
    // 处理可能的错误
    // @ts-expect-error
    if (err.status === 128 || err.message.includes('not a git repository')) {
      error('❌ 当前目录不是Git仓库');
      return false;
    }

    // @ts-expect-error
    console.error(colorize('yellow', `⚠️  扫描过程中出错: ${err.message}`));
    // 出错时允许继续提交，避免阻塞开发
    return true;
  }
}

/**
 * 主函数
 * @returns {boolean} 是否通过扫描
 */
export function main() {
  try {
    const passed = scanSecrets();
    process.exitCode = passed ? 0 : 1;

    return passed;
  } catch (error) {
    // @ts-expect-error
    console.error(colorize('red', `❌ 脚本执行错误: ${error.message}`));
    process.exitCode = 1;

    return false;
  }
}

// 执行
if (import.meta.main) {
  main();
}
