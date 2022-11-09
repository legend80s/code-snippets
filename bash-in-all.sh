# download in batch

#!/bin/bash

files=(
  "https://xxx.xlsx"
  "xxxx"
)

# length=${#files[@]}

# # https://www.cyberciti.biz/faq/bash-for-loop-array/
# for (( j=0; j<${length}; j++ ));
# do
#   curl -o ${j+1}.xlsx ${files[$j]}
# done

for file in "${files[@]}"
do
  curl -O file
done

echo "Done ✅"


# file size
# du -sh dir "du - tells the disk use not the file size." https://superuser.com/questions/22460/how-do-i-get-the-size-of-a-linux-or-mac-os-x-directory-from-the-command-line
find directory -type f -print0 | xargs -0 stat -f'%z' | awk '{b+=$1} END {print b}'
