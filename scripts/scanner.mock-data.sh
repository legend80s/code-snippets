# ========== Mock数据检测（简单正则版）==========

start=$(date +%s%3N)  # 获取开始时间的毫秒时间戳

RED='\033[31m'
GREEN='\033[32m'
BOLD='\033[1m'
RESET='\033[0m'

verbose=true

info() { [ "$verbose" = true ] && echo -e "${GREEN}$1${RESET}"; }
success() { echo -e "${GREEN}$1${RESET}"; }
error() { echo -e "${BOLD}${RED}$1${RESET}"; }


info "🔍 检查 src/ 目录下是否存在禁止提交的 Mock 数据..."

FILES_TO_CHECK=$(git diff --cached --diff-filter=d --name-only)

# 匹配 src/ 目录下新增/修改的文件
SRC_FILES_TO_CHECK=$(echo "$FILES_TO_CHECK" | grep '^src/' || true)
SRC_FILE_COUNT=$(echo "$SRC_FILES_TO_CHECK" | wc -w | tr -d ' ')

if [ "$SRC_FILE_COUNT" -eq 0 ]; then
    success "无 src/ 目录文件变更，跳过。"
    exit 0
fi

echo "🔍 扫描 ${SRC_FILE_COUNT} 个 src/ 目录文件..."

if [ -n "$SRC_FILES_TO_CHECK" ]; then
    VIOLATION_FOUND=false
    
    for FILE in $SRC_FILES_TO_CHECK; do
        if [ ! -f "$FILE" ]; then
            continue
        fi
        
        # 获取新增/修改的内容（合并为单行，移除空白便于匹配）
        DIFF_CONTENT=$(git diff --cached --no-color "$FILE" | 
                      grep -E '^[+]' | grep -v '^[+]{3}' | 
                      tr '\n' ' ' | tr -s ' ')
        
        # 关键：检测四个属性是否同时存在（支持跨行）
        # 使用 tr 将换行转为空格后，跨行对象就变成单行了
        if [[ -n "$DIFF_CONTENT" ]]; then
            # 检查四个关键属性
            HAS_SUCCESS=false
            HAS_CODE=false  
            HAS_ERRORMSG=false
            HAS_DATA=false
            
            echo "$DIFF_CONTENT" | grep -qi 'success[[:space:]]*:[[:space:]]*' && HAS_SUCCESS=true
            echo "$DIFF_CONTENT" | grep -qi 'code[[:space:]]*:[[:space:]]*' && HAS_CODE=true
            echo "$DIFF_CONTENT" | grep -qi 'errorMsg[[:space:]]*:[[:space:]]*' && HAS_ERRORMSG=true
            echo "$DIFF_CONTENT" | grep -qi 'data[[:space:]]*:[[:space:]]*' && HAS_DATA=true
            
            # 如果四个属性都存在，则违规
            if [ "$HAS_SUCCESS" = true ] && [ "$HAS_CODE" = true ] && 
               [ "$HAS_ERRORMSG" = true ] && [ "$HAS_DATA" = true ]; then
                error "🚨 发现危险的 Mock 数据: $FILE"
                VIOLATION_FOUND=true
                
                # 显示匹配的上下文（原始格式）
                error "匹配内容:"
                git diff --cached --no-color "$FILE" | grep -E '^[+]' | grep -v '^[+]{3}' | grep -i -B1 -A1 'success\|code\|errorMsg\|data' | head -6
                echo ""
            fi
        fi
    done
    
    if [ "$VIOLATION_FOUND" = true ]; then
        error "💡 提交 Mock 响应数据到代码库是危险行为！可能导致被意外发布。建议："
        error "   1. 使用真实 API 调用"
        error "   2. 或将 Mock 数据移到 mock 目录（如有）"
        exit 1
    fi
fi


end=$(date +%s%3N)    # 获取结束时间的毫秒时间戳
duration=$((end - start))

success "✅ Mock 数据检查通过，耗时: ${duration} 毫秒。"
