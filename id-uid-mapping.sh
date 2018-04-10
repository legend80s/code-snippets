#!/bin/bash
set -e

echo '[id-uid-mapping.sh] Powered by Node.js'
node -v

# 没有参数
if [[ $# -lt 2 ]]; then
    echo "[id-uid-mapping.sh] Usage: sh id-uid-mapping.sh [host] [app-total-count] [size:1000] [file_name:result.txt]"
    exit
fi

host=$1;
total_count=$2;
# 每次下载 1000 个。并行下载，防止 DDOS
size=${3:-1000};
result_filename=${4:-'result.txt'};

echo "[id-uid-mapping.sh] host $host, total_count: $total_count, size: $size, result_filename: $result_filename";

remainings=$((total_count % size)) || 1;
echo "[id-uid-mapping.sh] remainings: $remainings";
batches=$((total_count/size + remainings));
echo "[id-uid-mapping.sh] Fetching $total_count apps by $batches times sequentially at $host..."

declare -a files;
declare -a endpoints;

prefix=$(date +%Y-%m-%d-%H:%M:%S);

for (( i = 1; i <= batches; i++ )); do
  files+=("$prefix-$size-$i.js");
  endpoints+=("$host/v3/innerapi/apps?page=$i&size=$size");
done

# 1. 下载应用
for (( i = 0; i < batches; i++ )); do
  echo "[id-uid-mapping.sh] wget -O" "${files[$i]}" "${endpoints[$i]}"
  wget -O "${files[$i]}" "${endpoints[$i]}"
done

# 相当于执行以下命令
# wget -O inner-shanghai-1000-1.js "http://example.com/apps?page=1&size=1000" && wget -O inner-shanghai-1000-2.js "http://example.com/apps?page=2&size=1000" && wget -O inner-shanghai-1000-3.js "http://example.com/apps?page=3&size=1000" && wget -O inner-shanghai-1000-4.js "http://example.com/apps?page=4&size=1000" && wget -O inner-shanghai-1000-5.js "http://example.com/apps?page=5&size=1000" && wget -O inner-shanghai-1000-6.js "http://example.com/apps?page=6&size=1000"

# 2. 修改 inner-shanghai-1000-6.js 并执行、然后打开文件
# 前面加 json = 
# 后面加 console.log(JSON.stringify(json.result.map(app => app.id + ", " + app.owner.aliyun_user_id), null, 2))

# 清空结果文件
echo "" > "$result_filename"

find ./ -name "$prefix-*.js" -exec sed -i.old '1s;^;json = ;' {} \; && find ./ -name "$prefix-*.js" -exec sh -c "echo '\\nconsole.log(JSON.stringify(json.result.map(app => app.id + \", \" + app.owner.aliyun_user_id), null, 2))' >> {}" \; && find ./ -name "$prefix-*.js" -exec sh -c "node {} >> $result_filename" \; && open "$result_filename"
