#!/usr/bin/env node

// @ts-check

import { execSync } from "node:child_process"
import { SILENT_THRESHOLD } from "./shared.mjs"

// 颜色输出
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  bold: "\x1b[1m",
  reset: "\x1b[0m",
}

const scanDir = "src/"

const LABEL = "[🎭 SCANNER_MOCK]"
const verbose = false

/**
 * 主函数
 * @returns {boolean} 是否通过扫描
 */
export function main() {
  const startTime = Date.now()
  let diffContent = ""

  try {
    // 1. 一次性获取 src/ 目录下的差异内容 🔥
    diffContent = execSync(`git diff --cached --no-color -- "${scanDir}"`, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    })
  } catch (err) {
    error(`获取 ${scanDir} 目录下的差异内容失败:`)
    console.error(err)

    // 如果没有 src/ 目录的变更，git diff 会失败
    // @ts-expect-error
    if (err.status === 128 || err.message.includes("No such file")) {
      const duration = Date.now() - startTime
      success(`无 ${scanDir} 目录文件变更，跳过 🕑 耗时: ${duration}ms`)
      return true
    }

    // @ts-expect-error
    console.error(colorize("yellow", `⚠️ 检查失败: ${err.message}`))
    // 出错时允许继续提交
    return true
  }
  // console.log(`diffContent:|${diffContent}|`);
  // process.exit(1);

  // diffContent: `diff --git a/src/services/reasoning-service-permissions.ts b/src/services/reasoning-service-permissions.ts`
  const passed = scanMockData(diffContent)

  const duration = Date.now() - startTime

  const srcFileCount = diffContent.split("diff --git").length - 1
  const timeCost = `🕑 耗时: ${duration}ms。`
  const stat = `(共扫描 ${scanDir} 目录下 ${srcFileCount} 个文件) ${timeCost}`

  const printStat = () => {
    if (!passed) {
      return error(`${LABEL} ❌ Mock 数据检查未通过 ${stat}`)
    }

    if (duration <= SILENT_THRESHOLD) {
      // 尽量减少输出干扰
      return
    }

    if (!srcFileCount) {
      return success(`没有 ${scanDir} 文件变更，跳过扫描 ${timeCost}`)
    }

    return success(`Mock 数据检查通过 ${stat}`)
  }

  printStat()

  process.exitCode = passed ? 0 : 1
  return passed

  //   console.error(colorize('red', `❌ 脚本执行错误: ${error.message}`));
  //   process.exitCode = 1;
  // } finally {
  // const duration = Date.now() - startTime;

  // info(`🕑 共扫描 ${srcFileCount} 个文件，耗时: ${duration} 毫秒。`);
  // }
}

if (import.meta.main) {
  main()
}

/**
 *
 * @param {keyof typeof colors} color
 * @param {string} text
 * @returns
 */
function colorize(color, text) {
  return `${colors[color]}${text}${colors.reset}`
}

/**
 * 输出信息
 * @param {string} text
 */
function info(text) {
  verbose && console.log(colorize("green", `${LABEL} ${text}`))
}

/**
 * 输出错误信息
 * @param {string} text
 */
function error(text, bold = false) {
  if (!bold) {
    console.error(colorize("red", text))
    return
  }

  console.error(colorize("bold", colorize("red", text)))
}

/**
 * 输出成功信息
 * @param {string} text
 */
function success(text) {
  console.log(colorize("green", `${LABEL} ✅ ${text}`))
}

/**
 * 检测此次变更内容是否包含 Mock 数据
 * @param {string} diffContent
 * @returns {boolean} return `true` if no mock data found
 */
function scanMockData(diffContent) {
  info(`🔍 检查 ${scanDir} 目录下是否存在禁止提交的 Mock 数据...`)

  if (!diffContent.trim()) {
    // 无 src/ 目录文件变更，跳过
    return true
  }

  // 2. 解析差异内容
  const violations = parseDiffContent(diffContent)

  // 3. 输出结果
  if (violations.length > 0) {
    error(
      `${LABEL} 🚨 发现含 Mock 数据的违规文件 ${violations.length} 个。`,
      true,
    )
    // console.log('violations', violations);

    violations.forEach((violation, index) => {
      error(`${index + 1}. ${violation.file}`, true)

      // 显示相关代码行（最多5行）
      violation.lines.slice(0, 5).forEach(line => {
        console.log(`   ${line}`)
      })

      console.log() // 空行分隔
    })

    error("🚨 提交 Mock 响应数据到代码库是危险行为！可能导致被意外发布。")
    error(
      "💡 建议：1. 使用真实 API 调用 2. 或将 Mock 数据移到 mock 目录（若有）。",
    )

    return false
  }

  return true
}

/**
 * 解析 git diff 内容，检测 Mock 数据
 * @param {string} diffContent
 * @returns {Array<{ file: string, lines: string[] }>}
 */
export function parseDiffContent(diffContent) {
  const lines = diffContent.split("\n")
  /** @type {Array<{ file: string, lines: string[] }>} */
  const violations = []

  let currentFile = ""
  let currentFileProperties = {
    hasSuccess: false,
    hasCode: false,
    hasErrorMsg: false,
    hasData: false,
    hasMessage: false,
  }
  /** @type {string[]} */
  let collectedLines = []

  // 正则模式
  const patterns = {
    // 必须包含的属性
    code: /\bcode\s*:/i,
    data: /\bdata\s*:/i,

    // 可选属性
    success: /\bsuccess\s*:/i,
    errorMsg: /\berrorMsg\s*:/i,
    message: /\bmessage\s*:/i,
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // 检测新文件开始
    if (line.startsWith("diff --git")) {
      // 检查上一个文件是否违规
      checkAndAddViolation()

      // 提取文件名
      const parts = line.split(" ")
      if (parts.length >= 3) {
        currentFile = parts[2].replace(/^a\//, "")
        resetFileState()
      }
      continue
    }

    // 只检查新增行
    if (line.startsWith("+") && !line.startsWith("+++")) {
      // 提取实际内容（去掉行首的 '+'）
      const content = line.substring(1)

      // 跳过注释行
      if (content.trim().startsWith("//")) {
        continue
      }

      // 移除行内注释
      const cleanContent = content.replace(/\/\/.*$/, "")

      let lineCollected = false

      for (const [prop, pattern] of Object.entries(patterns)) {
        // 正则表达式匹配，这是关键代码 🔥
        if (pattern.test(cleanContent)) {
          /** @type {keyof typeof currentFileProperties} */
          // @ts-expect-error
          const key = `has${prop.charAt(0).toUpperCase() + prop.slice(1)}`
          currentFileProperties[key] = true

          // console.log('prop', { prop, key, pattern });
          // console.log('line', `[${line}]`);
          // console.log('cleanContent', `[${cleanContent}]`);

          // 收集相关行（最多收集5行）
          if (collectedLines.length < 5) {
            // 一行找到1个匹配属性后，则无需收集，否则一行会被收集多次。
            if (!lineCollected) {
              collectedLines.push(line)
              lineCollected = true
            }
          }
          // console.log('collectedLines', collectedLines);
        }
      }
    }
  }

  // 检查最后一个文件
  checkAndAddViolation()

  return violations

  // 辅助函数
  function resetFileState() {
    currentFileProperties = {
      hasSuccess: false,
      hasCode: false,
      hasErrorMsg: false,
      hasData: false,
      hasMessage: false,
    }
    collectedLines = []
  }

  function checkAndAddViolation() {
    if (!currentFile) return

    const { hasSuccess, hasCode, hasErrorMsg, hasData, hasMessage } =
      currentFileProperties

    // 检测条件：必须有 code 和 data，同时有 success 或 message 或 errorMsg
    const hasRequired =
      hasCode && hasData && (hasSuccess || hasMessage || hasErrorMsg)
    // console.log('hasRequired', hasRequired, collectedLines);

    if (hasRequired && collectedLines.length > 0) {
      violations.push({
        file: currentFile,
        lines: [...collectedLines],
      })
    }

    resetFileState()
  }
}
