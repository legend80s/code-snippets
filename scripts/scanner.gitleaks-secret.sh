#!/bin/bash

# 防止推送密钥文件 (Prevent pushing secret files to the repository)
# 比如误将 getToken 函数中的 token 字符串直接提交到仓库

start=$(date +%s%3N)  # 获取开始时间的毫秒时间戳

RED='\033[31m'
GREEN='\033[32m'
BOLD='\033[1m'
RESET='\033[0m'

verbose=false

info() { [ "$verbose" = true ] && echo -e "${GREEN}$1${RESET}"; }
success() { echo -e "${GREEN}$1${RESET}"; }
error() { echo -e "${BOLD}${RED}$1${RESET}"; }

info "🔍 正在执行敏感信息扫描 (Shell)..."

# 定义要检测的敏感信息正则表达式模式
# 模式1: JWT令牌 (以 "Bearer " 开头或 "eyJ" 开头的长字符串)
PATTERN_JWT='(eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*)'
# 模式2: 通用API密钥 (类似 "sk_live_xxx" 或 "AKIA...")
PATTERN_API_KEY='(sk_(live|test)_[0-9a-zA-Z]{24,})|(AKIA[0-9A-Z]{16})'
# 模式3: 基础认证 (包含 "username:password@" 的URL)
PATTERN_BASIC_AUTH='(https?://[^:]+:[^@]+@)'

# 将所有模式合并，用 '|' 分隔
COMBINED_PATTERN="$PATTERN_JWT|$PATTERN_API_KEY|PATTERN_BASIC_AUTH"

# 检查暂存区（即将提交）的所有文本文件
# --diff-filter=d: 忽略已删除的文件
# --name-only: 只输出文件名
FILES_TO_CHECK=$(git diff --cached --diff-filter=d --name-only)
# 打印待检查的文件列表
info ""
info "待检查的文件列表:"
info "$FILES_TO_CHECK"
info ""

# 循环检查每个文件是否包含敏感信息
for FILE in $FILES_TO_CHECK
do
    # 检查文件是否存在以及是否为文本文件（简单判断）
    if [ -f "$FILE" ] && [[ "$FILE" != *.bin && "$FILE" != *.png && "$FILE" != *.jpg ]]; then
        # 使用git diff检查暂存区版本中是否包含敏感信息
        # 我们只检查以+开头的新行（排除+++文件名行）删除的不检测
        if git diff --cached --no-color "$FILE" | grep -E '^[+]' | grep -v '^[+]{3}' | grep -q -i -E "$COMBINED_PATTERN"; then
            error "🚨 在文件 $FILE 中发现可能的敏感信息。"
            error "   请移除或混淆上述敏感信息后重试。"
            echo ""
            # 显示匹配到的具体行内容（前2处）
            error "匹配到的内容示例："
            git diff --cached --no-color "$FILE" | grep -E '^[+]' | grep -v '^[+]{3}' | grep -i -E "$COMBINED_PATTERN" | head -2
            exit 1
        fi
    fi
done

end=$(date +%s%3N)    # 获取结束时间的毫秒时间戳
duration=$((end - start))

success "✅ 敏感信息扫描通过，耗时: ${duration} 毫秒。"
exit 0