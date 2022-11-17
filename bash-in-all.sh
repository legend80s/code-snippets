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

// 2022-11-17 15:58:55
function gpmr() {
  git push

  exitCode=$?

  if [[ $exitCode != 0 ]]
  then
    out=$((git push) 2>&1)

    # https://linuxize.com/post/how-to-compare-strings-in-bash/
    if [[ $out =~ .*'has no upstream branch'.* ]]
    then
      # 1. push new branch to remote 
      branch=$(git symbolic-ref --short HEAD)

      # https://misc.flogisoft.com/bash/tip_colors_and_formatting
      echo "\e[32m\$ git push --set-upstream origin $branch\n\e[0m"
      git push --set-upstream origin $branch

      # 2. launch a MR
      # git remote get-url origin
      # git@code.alipay.com:PayTM-Core/limo-core.git
      # to
      # https://example.com/group/repo/pull_requests/new?source_branch=fix/pub-failed-registry
      gitRepo=$(git remote get-url origin)
      # https://stackoverflow.com/questions/13210880/replace-one-substring-for-another-string-in-shell-script
      url=$(echo $gitRepo | sed "s|.git|/pull_requests/new?source_branch=$branch|")
      url=${url/:/\/}
      url=${url/git@/https:\/\/}

      echo "\n\e[32m\$ open $url\e[0m"
      sleep 2
      open $url
    fi
  fi
}
