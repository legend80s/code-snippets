#!/bin/bash
set -e

# 没有参数
if [[ $# == 0 ]]; then
    echo "Usage: sh ip.sh app_name[ app_name]"
    exit
fi

echo "IP Statistics for 4 Servers of HangZhou"

for index_name in "$@"; do
    echo
    echo "$index_name"

    echo "$index_name" > search-ips.dat

    zcat access.20180326_1[4-6].log.gz | grep "search?" | grep "index_name=${index_name}"  | awk '{ print $2 }' |sort | uniq -c | sort -nr >> search-ips.dat

    awk 'BEGIN { N = 4 } $1 ~ /^[0-9]+$/ {a[$2] += $1} END { for (ip in a) { print ip " " a[ip] * N } }' search-ips.dat
done
