# /Users/legend80s/.oh-my-zsh/custom/plugins/git-plus/git-plus.plugin.zsh

# 完整代码 https://code.alipay.com/monkey-wrench/bash-snippets/blob/master/git-plus.plugin.zsh

# https://stackoverflow.com/a/58598185
# capture the output of a command so it can be retrieved with ret
cap () { tee /tmp/capture.out; }
# return the output of the most recent command that was captured by cap
ret () { cat /tmp/capture.out; }
# $ find . -name 'filename' | cap
# /path/to/filename

# $ ret
# /path/to/filename


# https://stackoverflow.com/questions/60131270/how-do-i-open-a-url-from-node-in-a-new-browser-tab-or-go-to-existing-one-if-its
function open_plus() {
  node -p "require('react-dev-utils/openBrowser')('$1');"
}

alias gmm="gcm && gl && gco - && git merge origin/master"
alias gcmpull="gcm && gl"
alias gcml="gcmpull"
alias gcmp="gcmpull"
# gco is often typed as gcp by mistake
alias gcp="gco"
alias gstshort="git status --short --branch"
alias GST="git status"

# alias gclone="git clone"
alias gbd="delete_git_branch"
alias gbdelete="delete_git_branch"
alias db="delete_git_branch"
# open yuyan
alias gty="git rev-parse --abbrev-ref HEAD | grep 'S\d\+' -o | grep 'S\d\+' -o | awk '{print \"https://yuyan.antfin-inc.com/proxy/sprint/\"\$1}' | xargs open_plus"

# delete local and remote branch
delete_git_branch() {
  local branch=$1
  git branch -d "$branch" && git push origin --delete "$branch"
}

gcamn() {
  check_master && git commit -nam $@
}

check_master() {
  echo '[git-plus] checking master';

  if [[ $(__getCurrentBranch) == "master" ]]; then
    echo '[git-plus] 请不要在 master 执行任何提交操作！'
    exit 1
  fi
}

# git comit -am with check
gcamc() {
  check_master && git commit -am $@
}

gcamp() {
  gcampush $@ && git push
}
gcampush() {
  check_master && git commit -am $@ && git push
}

# alias gcol="gco $1 && gl"
gcol() {
  gco "$1" && gl
}

gclone() {
  local repo_url=$1
  # a/b
  local project_id=$(__parse_git_url_core $repo_url)
  # b
  local dir=$(basename $project_id)

  git clone $repo_url

  cd $dir
  pwd

  code .
  tnpm i
}
# cd alipay && git clone xx && cd dir
# @examp gitclone2alipay git@example.com:repo/hello.git
gitclone2alipay() {
  local repo_url=$1
  # a/b
  local project_id=$(__parse_git_url_core $repo_url)
  # b
  local dir=$(basename $project_id)

  cd ~/workspace/alipay
  git clone $repo_url
  cd $dir

  pwd && sleep 0.5
  code .
  tnpm i
}

list_pull_requests() {
  group=$1
  repo=$2
  query_string=$3


  # echo hello=https://code.alipay.com/api/v3/projects/$group%2F$repo/pull_requests?$query_string

  curl -s "https://code.alipay.com/api/v3/projects/$group%2F$repo/pull_requests?$query_string" -H "PRIVATE-TOKEN: r-a";
}

normalize() {
  local resp=$1

  # echo '> normalize $resp'='<text>'$resp'</text>'

  echo $resp | tr '\n' ' '
}

get_pull_request_url() {
  local group=$1
  local repo=$2
  local source_branch=$(encode $3)

  # echo list_pull_requests "$group" "$repo" "source_branch=$source_branch"

  local resp=$((list_pull_requests "$group" "$repo" "source_branch=$source_branch") 2>&1)

  # echo resp="'$resp'"
  # echo web_url=$(echo $resp | jq --raw-output '.[] | .web_url')

  if [[ $resp == '['* && $resp != '[]' ]]; then
    findOpenedMR $resp
  else
    echo false
  fi
}

gpmr() {
  git push

	local exitCode=$?

  # echo exitCode=$exitCode

  local branch=$(__getCurrentBranch)

	if [[ $exitCode != 0 ]]; then
    local out=$((git push) 2>&1)

    # https://linuxize.com/post/how-to-compare-strings-in-bash/
    # https://linuxize.com/post/how-to-check-if-string-contains-substring-in-bash/
		if [[ $out == *'has no upstream branch'* ]]; then
      # https://misc.flogisoft.com/bash/tip_colors_and_formatting
			echo "\e[32m\$ git push --set-upstream origin $branch\n\e[0m"

      # 1. push new branch to remote
			git push --set-upstream origin $branch

      # 2. launch a MR
			__launchMR $branch
		else
			return $exitCode
		fi
	else
    local project_id=$(__parse_git_url)
    local group=$(dirname $project_id)
    local repo=$(basename $project_id)

    echo '> 'group='"'$group'"' repo='"'$repo'"' branch='"'$branch'"'
    local pull_request_url=$(get_pull_request_url $group $repo $branch)
    echo '> 'pull_request_url='"'$pull_request_url'"'

		if [[ $pull_request_url = https* ]]; then
      # open https://code.alipay.com/PayTM-Core/limo-core/pull_requests/178
      # match pull_requests/178

      # if [[ $out =~ (https:.*pull_requests\/[0-9]+) ]]; then
        # local mrUrl=${BASH_REMATCH[1]}

      __openExistingMR $pull_request_url
      # fi
    else
			__launchMR $branch
		fi
	fi
}

# @returns intelligent_pay_base/mini-transfer-app
__parse_git_url_core() {
  # git@code.alipay.com:intelligent_pay_base/mini-transfer-app.git
  local git_repo=$1

  # intelligent_pay_base/mini-transfer-app
  project_id=$(echo $git_repo | cut -d ':' -f 2 | cut -d '.' -f 1)

  echo $project_id
}

# parse from current git repo
__parse_git_url() {
  # git@code.alipay.com:intelligent_pay_base/mini-transfer-app.git
  local git_repo=$(git remote get-url origin)

  __parse_git_url_core $git_repo
}

__openExistingMR() {
  local mrUrl=$1

  echo "\n\e[32m\$ open_plus '$mrUrl'\e[0m"

  open_plus $mrUrl
}

__getCurrentBranch() {
  git rev-parse --abbrev-ref HEAD
}

encode() {
  node -p "encodeURIComponent(\"$1\")"
}

findOpenedMR() {
  local resp=$(normalize $1)
  # echo '> findOpenedMR $1'='<text>'$resp'</text>'

  touch $TMPDIR/git-plus-utils.js

  echo "
  const resp = process.env.resp;\n
  try {\n
    const webUrl = JSON.parse(resp).find(x => x.state === 'opened')?.web_url;\n
    console.log(webUrl);\n
  } catch (error) {\n
    console.error('JSON parse failed:', { resp }, error)\n
  }\n
  " > $TMPDIR/git-plus-utils.js

  resp=$resp node $TMPDIR/git-plus-utils.js

  # node -p "JSON.parse('$resp').find(x => x.state === 'opened')?.web_url"
}

# sprint_smallfish_upgrade_S29001192043_20221205-mengzou
__get_target_branch_by_source_branch() {
  echo $1 | grep -e "sprint_.\+_S\d\+_\d\+" -o || echo master
  # echo sprint_smallfish_upgrade_S29001192043_20221205-mengzou | grep -e "sprint_.\+_S\d\+_\d\+" -o || echo master
}

__launchMR() {
  # tansfrom output of `git remote get-url origin`
  # > git@code.alipay.com:PayTM-Core/limo-core.git
  # to
  # > https://code.alipay.com/PayTM-Core/limo-core/pull_requests/new?source_branch=fix/pub-failed-registry
  local branch=$1
  local gitRepo=$(git remote get-url origin)
  local encodedBranch=$(encode $branch)

  # https://stackoverflow.com/questions/13210880/replace-one-substring-for-another-string-in-shell-script
  # https://code.alipay.com/h5app-bj/mini-balance/pull_requests/new?source_branch=sprint_mini-balance_S29001185903_20221117-mengzou-main-rpc-log&tab=pr&target_branch=sprint_mini-balance_S29001185903_20221117
  local url=$(echo $gitRepo | sed "s|\.git|/pull_requests/new?source_branch=$encodedBranch|")
  url=${url/:/\/}
  url=${url/git@/https:\/\/}

  local target_branch=$(__get_target_branch_by_source_branch $branch)

  url="$url&target_branch=$(encode $target_branch)"

  echo "\n\e[32m\$ open_plus '$url'\e[0m"
  # sleep 0.5
  open_plus "$url"
}

# gcam and launch mr
gcamr() {
  gcamc $1
  gpmr
}

gcamrn() {
  gcamn $1
  gpmr
}
