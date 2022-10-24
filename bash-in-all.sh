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
