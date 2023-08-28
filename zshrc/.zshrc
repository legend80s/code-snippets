# Fig pre block. Keep at the top of this file.
[[ -f "$HOME/.fig/shell/zshrc.pre.zsh" ]] && builtin source "$HOME/.fig/shell/zshrc.pre.zsh"
ZSH_DISABLE_COMPFIX="true"

# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:/usr/local/bin:$PATH

# Path to your oh-my-zsh installation.
export ZSH="/Users/legend80s/.oh-my-zsh"

# Set name of the theme to load --- if set to "random", it will
# load a random theme each time oh-my-zsh is loaded, in which case,
# to know which specific one was loaded, run: echo $RANDOM_THEME
# See https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
# ZSH_THEME="cloud"
# https://github.com/ohmyzsh/ohmyzsh/wiki/Themes#candy
# https://github.com/unixorn/awesome-zsh-plugins#themes
# ZSH_THEME="gallois"
# ZSH_THEME="amuse"
# ZSH_THEME="robbyrussell"

# Set list of themes to pick from when loading at random
# Setting this variable when ZSH_THEME=random will cause zsh to load
# a theme from this variable instead of looking in $ZSH/themes/
# If set to an empty array, this variable will have no effect.
# ZSH_THEME_RANDOM_CANDIDATES=( "robbyrussell" "agnoster" )

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to use hyphen-insensitive completion.
# Case-sensitive completion must be off. _ and - will be interchangeable.
# HYPHEN_INSENSITIVE="true"

# Uncomment the following line to disable bi-weekly auto-update checks.
# DISABLE_AUTO_UPDATE="true"

# Uncomment the following line to automatically update without prompting.
# DISABLE_UPDATE_PROMPT="true"

# Uncomment the following line to change how often to auto-update (in days).
# export UPDATE_ZSH_DAYS=13

# Uncomment the following line if pasting URLs and other text is messed up.
# DISABLE_MAGIC_FUNCTIONS="true"

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
# ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
# Caution: this setting can cause issues with multiline prompts (zsh 5.7.1 and newer seem to work)
# See https://github.com/ohmyzsh/ohmyzsh/issues/5765
# COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# You can set one of the optional three formats:
# "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# or set a custom format using the strftime function format specifications,
# see 'man strftime' for details.
# HIST_STAMPS="mm/dd/yyyy"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# Which plugins would you like to load?
# Standard plugins can be found in $ZSH/plugins/
# Custom plugins may be added to $ZSH_CUSTOM/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
plugins=(
  git
  git-plus
  zsh-syntax-highlighting
  zsh-autosuggestions
)

source $ZSH/oh-my-zsh.sh

# User configuration

# export MANPATH="/usr/local/man:$MANPATH"

# You may need to manually set your language environment
# export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='mvim'
# fi

# Compilation flags
# export ARCHFLAGS="-arch x86_64"

# Set personal aliases, overriding those provided by oh-my-zsh libs,
# plugins, and themes. Aliases can be placed here, though oh-my-zsh
# users are encouraged to define aliases within the ZSH_CUSTOM folder.
# For a full list of active aliases, run `alias`.
#
# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"

alias 。。=".."

alias p="pnpm"

alias zshrc="code ~/.zshrc"
alias cz="code ~/.zshrc"
alias sz="source ~/.zshrc"
alias hosts="code /private/etc/hosts"

alias alipay="~/workspace/alipay"
alias workspace="~/workspace"
alias yue="~/workspace/alipay/mini-balance"
alias mb="~/workspace/alipay/mini-balance"
alias mini-balance="~/workspace/alipay/mini-balance"
alias minirecharge="~/workspace/alipay/MiniRecharge"
alias cz="~/workspace/alipay/cz"
alias legend80s="~/workspace/legend80s"
alias infra="~/workspace/alipay/infra"
alias ccr="~/workspace/alipay/credit-card-payment"
alias xyk="~/workspace/alipay/credit-card-payment"
alias 信用卡="~/workspace/alipay/credit-card-payment"
alias wxf="~/workspace/alipay/tinyapp_bank_transfer"

alias cml="~/workspace/legend80s/commit-msg-linter"

alias dtb-offline="~/workspace/alipay/dtb-offline-2"
alias dtb="~/workspace/alipay/dtb-offline-2"
alias oc="~/workspace/alipay/digital-bank-oc"
alias gzm="~/workspace/alipay/gzmsdtb-staffmng"

alias 无限付="~/workspace/alipay/tinyapp_bank_transfer"
alias limo="~/workspace/alipay/infra/limo-core"
alias limo-core="~/workspace/alipay/infra/limo-core"

alias stdlib="~/projj/code.alipay.com/smallfish/stdlib/"

alias temp="/tmp"
alias tmp="/tmp"

alias xtest="npm run test"
alias jest="npm run jest"
alias t="bun run test"
alias dev="npm run dev"
alias DEV="npm run dev"
alias d="npm run dev"
alias start="npm run start"
alias s="npm run start"
alias ci="npm run ci"

alias vitest="npx vitest run"

# - run staged (changed) tests only
# - but run all tests when no staged files
# alias vt="npx vitest run \$(git status --short | grep 'test')"
function vt() {
  # 非空。注意：`-z` 不支持
  if [ -n "$1" ]; then
    npx vitest run "$1"
  else
    npx vitest run $(git status --short | grep 'test\.')
  fi
}

alias i="echo 'tnpm i' && tnpm i"
alias install="echo 'tnpm i' && tnpm i"
alias ti="tnpm i --save"
alias tid="tnpm i --save"

alias init="npm run init"

alias br="bun run"

alias mock="npm run mock"
alias dev2="npm run dev2"
alias watch="npm run watch"
alias dev:withdraw="npm run dev:withdraw"
alias build="npm run build"
alias b="npm run build"
alias lint="npm run lint"
alias stylelint="npm run stylelint"
alias lintfix="npm run lint:fix"
alias proxy="npm run proxy"
alias hss="hpm sim start"
alias rmi="rm -rf node_modules && tnpm i"

# cargo start
# cargo new formatted-print
function cargonew() {
  cargo new $1
  cd $1
  cargo run

  code .
}
# cargo end

# https://linuxhint.com/configure-use-aliases-zsh/
alias ginit="git init ."
alias -s js=code
alias -s ts=code
alias -s txt=code
alias -s json=code

function opennpm() {
  open-npm $*
}
function iopen() {
  open-npm $*
}

alias dict="node ~/workspace/legend80s/dict"
# alias ydd="dict"
function ydd() {
  dict $* -c
}

function fanyi() {
  node --input-type=module -e "
    import { translate } from '/Users/legend80s/workspace/legend80s/dict/src/translator/engines/baidu.mjs';

    console.log(await translate('Covenant and Consideration'))
  "
}

# bun
alias r="bun run"

alias c="code ."
alias cmb='code ~/workspace/alipay/mini-balance'
alias cmr='code ~/workspace/alipay/MiniRecharge'

# alias coverage="npm run coverage"
# alias cov="npm run cov"

GREEN='\e[32m'
YELLOW='\e[33m'
RESET='\e[0m'

function mean() {
  local js="
    const { execSync } = require('child_process');

    main();

    function main() {
      const word = process.argv[2]?.trim();

      if (!word) {
        console.error('\n❌ Please input word to query.');
        process.exitCode = 1;

        return;
      }

      // curl --silent https://dict.youdao.com/w/expletive/\#keyfrom\=dict2.top | grep '"trans-container"'
      const html = execSync(`curl --silent https://dict.youdao.com/w/${word}/#keyfrom=dict2.top`).toString('utf-8');

      const config = {
        // listItemIcon: '🟢',
        // listItemIcon: '⭕️',
        // listItemIcon: '✅',
        listItemIcon: '💬',
      };

      // 尽量少依赖故未使用查询库和渲染库
      // https://www.npmjs.com/package/node-html-parser
      // https://github.com/charmbracelet/glow
      const lis = html.match(/<div class="trans-container">\s*<ul>([\s\S]+?)<\/ul>/)?.[1].trim();

      // 中文不支持
      if (!lis || !lis.includes('<li>')) {
        console.error('\n❌ Please input an English word.');
        process.exitCode = 1;

        return;
      }

      const translation = lis.replace(/\s{2,}/g, ' ')
        .replace(/<li>([\s\S]+?)<\/li>/g, `\n${config.listItemIcon} $1`)
      ;

      console.log();
      console.log('Word:', `"${word}"`);
      console.log();
      console.log('Explanation:');
      console.log(translation);
    }
  "

  node -p "1+1"
}

function coverage() {
  npm run coverage

  if [[ $? != 0 ]]
  then
    local out=$((npm run coverage) 2>&1)

    # https://linuxize.com/post/how-to-check-if-string-contains-substring-in-bash/
    if [[ $out == *'Missing script'* ]]
    then
      echo '\e[33m\nMissing script `cov`.\e[0m'
      local script=cov

      ## match cov1 from 'run the "cov1" package script'
      if [[ $out =~ \#[[:space:]]run[[:space:]]the[[:space:]]\"([^\"]+)\"[[:space:]]package[[:space:]]script ]]
      then
        script=${BASH_REMATCH[1]}
      fi

      if [[ $script = cov ]]
      then
        echo $GREEN'$ npm run cov'$RESET

        npm run $script && openCoverageHtmlReport
        return $?
      fi

      # https://effective-shell.com/part-4-shell-scripting/mastering-conditional-logic#case-statements
      echo $GREEN'Do you wish to '"npm run $script"'? Yes or no: '$RESET
      read response

      case $response in
        y | Y | yes | Yes) npm run $script && openCoverageHtmlReport
        ;;
      esac
    fi
  fi
}

openCoverageHtmlReport() {
  # coverage/index.html
  if [ -f coverage/index.html  ]
  then
    open coverage/index.html
  else
    echo 'coverage/index.html not exists'
  fi
}

function cov() {
  npm run cov

  if [[ $? != 0 ]]
  then
    local out=$((npm run cov) 2>&1)

    # https://linuxize.com/post/how-to-check-if-string-contains-substring-in-bash/
    if [[ $out == *'Missing script'* ]]
    then
      # echo $out
      local script=coverage

      ## match cov1 from 'run the "cov1" package script'
      if [[ $out =~ \#[[:space:]]run[[:space:]]the[[:space:]]\"([^\"]+)\"[[:space:]]package[[:space:]]script ]]
      then
        script=${BASH_REMATCH[1]}
      fi

      echo $YELLOW'\nMissing script "cov"'$RESET

      if [[ $script == coverage ]]
      then
        # `|| echo ""` make it that `openCoverageHtmlReport` will run either success or failed
        npm run $script || echo ""
        openCoverageHtmlReport

        return $?
      fi

      # https://effective-shell.com/part-4-shell-scripting/mastering-conditional-logic#case-statements
      echo -e $GREEN"Do you wish to \"npm run $script\"? (Yes or no):"$RESET
      read response

      case $response in
        y | Y | yes | Yes) npm run $script && openCoverageHtmlReport
        ;;
      esac
    fi
  fi
}

function isCommandExists() {
  local cmd=$1

  if ! [ -x "$(which $cmd)" ]; then
    # echo "Error: $cmd is not installed."
    echo false
  else
    # echo "Success: $cmd installed."
    echo true
  fi
}

# touch and edit
function touchc() {
  touch $1 && code $1
}

# touchr - touch recursively
function touchr() {
  local fp=$1

  # if [[ $(isCommandExists code) == true ]]
  if $(isCommandExists code)
  then
    code $fp
    return 0
  fi

  touch $fp

  # if [[ $? != 0 ]]
  if [[ $? -ne 0 ]]
  then
    ## https://wangchujiang.com/reference/docs/bash.html#bash-%E5%8F%82%E6%95%B0%E6%89%A9%E5%B1%95
    local dir=$(dirname $fp) # ~/effective-shell/data
    local filename=$(basename $fp) # top100.csv

    # echo $dir, $filename

    mdcd $dir
    touch $filename

    # echo "In function $FUNCNAME: FUNCNAME=${FUNCNAME[*]}" >&2
    # echo "In function $funcstack: funcstack=${funcstack[*]}" >&2

    # https://stackoverflow.com/questions/1835943/how-to-determine-function-name-from-inside-a-function#:~:text=You%20can%20use%20%24%7BFUNCNAME,to%20get%20the%20function%20name.
    echo ${funcstack[1]}: $GREEN$fp created

    sleep 1
    code $filename
  fi
}

# resourceId resourceType
function iopen() {
  node ~/workspace/alipay/infra/openi $*
}

dict-open() {
  rawKeyword='"'"$@"'"'

  # echo "search word $rawKeyword"

  keyword=$(node -p "encodeURIComponent($rawKeyword)")

  open "http://dict.youdao.com/w/$keyword"
}

# "git@gitlab.alipay-inc.com:minifish/boilerplates.git"
# =>
# https://gitlab.alipay-inc.com/inifish/boilerplates
# and
# git+https://github.com/lodash/lodash.git
# =>
# https://github.com/lodash/lodash
function git2url() {
  node -p "'$1'.replaceAll('\"', '').replace('com:', 'com/').replace('git@', 'https://').replace(/\.git|git\+/g, '').replace('gitlab.alipay-inc.com', 'code.alipay.com')"
}

# Open repo or open npm url.
# open-npm lodash # open npmjs.com
# open-npm lodash repo # open lodash git github url
open-npm() {
  # https://fedingo.com/how-to-check-if-input-argument-exists-in-shell-script/
  if [ ! -z "$1" ]; then
    name=$1
  else
    rawName=$(jq .name package.json)

    name=$(node -p "$rawName.replace(/^\"$/g, '')")
  fi

  # open in yuyan
  if [[ $name =~ ^1800[0-9]{14}$ ]]; then
    if [[ $2 =~ ^[0-9]+$ ]]; then
      local yuyanCode=$2
      open https://yuyan.antfin-inc.com/app/$name/monitor/dashboard/$yuyanCode
      return
    fi

    # https://yuyan.antfin-inc.com/app/180020010001199734
    open https://yuyan.antfin-inc.com/app/$name
    return
  fi

  # open in npm
  # @type {'repo' | undefined} open repo or open npm url
  local mode=$2
  local registry

  local registryNpm='https://registry.npmjs.org'
  local registryTnpm='https://registry.npm.alibaba-inc.com'

  local pkgNpm='https://www.npmjs.com/package'
  local pkgTnpm='https://web.npm.alibaba-inc.com/package'

  local dest
  local repo

  # tnpm
  if [[ $name = @ali* ]]; then
    if [[ $mode == 'repo' ]]; then
      dest=$(get_repository $registryTnpm/$name)
    elif [[ $mode == 'doc' ]]; then
      tnpm doc $name
    else
      dest="$pkgTnpm/$name"
    fi

    open $dest

    return
  fi

  # npm
  local repo

  # npm
  if [[ $mode == 'repo' ]]; then
    repo=$(get_repository $registryNpm/$name)

    open $repo
  elif [[ $mode == 'doc' ]]; then
      npm doc $name
  else
    dest="$pkgNpm/$name"
    open $dest

    repo=$(get_repository $registryNpm/$name)
    echo $repo
  fi
}

function get_repository() {
  local registryUrl=$1

  local gitUrl=$(curl -s $registryUrl | jq '.repository.url')

  git2url $gitUrl
}

alias pkg=view-package-json $*
alias vpj=view-package-json $*

view-package-json() {
  # https://linuxize.com/post/bash-functions/#passing-arguments-to-bash-functions
  # The $* and $@ variables hold all positional parameters/arguments passed to the function.
  # - When not double-quoted, $* and $@ are the same.
  less-package-json $*
}

less-package-json() {
  # https://fedingo.com/how-to-check-if-input-argument-exists-in-shell-script/
  if [ ! -z "$1" ]
  then
    local name=$1
    local packageJsonPath="./node_modules/$name/package.json"
  else
    local packageJsonPath="./package.json"
  fi

  if [ ! -z "$2" ]
  then
    key=$2
    jq ".$key" $packageJsonPath

    return
  fi

  less $packageJsonPath && head -n 6 $packageJsonPath
}

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# cdi begin
# /Users/legend80s/Downloads/cdi-v1
cdipath='/Users/legend80s/Downloads/cdi-v5'

cdi() {
  target=$($cdipath "$@")

  # TODO: 绝对路径huo . - 开头直接 cd xxx 否则时间太长
  if [[ $target == *"no such dirname"* ]]; then
    # fallback to original
    cd $@
  else
    echo $target
    cd $target
  fi
}

# cdi dir and gcmpull
cdim() {
  cdi "$@" && gcmpull
}

cdi-echo() {
  target=$($cdipath "$@")

  echo $target
}

# Intelligent `code` command `codi`
codi() {
  target=$($cdipath "$@")

  # 绝对路径直接 code xxx 否则时间太长
  if [[ $target == *"no such dirname"* ]]; then
    # fallback to original
    code $@
    cd $@
  else
    echo $target
    cd $target
    code $target
    # code $(cdi-echo $1)
  fi
}

alias cdi-stat="$cdipath stat"
alias cdi-stat-clear="$cdipath stat --clear"
# cdi end

nvm use 16 # default

# java begin
export JAVA_HOME="/Library/Java/JavaVirtualMachines/jdk1.8.0_311.jdk/Contents/Home"
export PATH="$JAVA_HOME/bin:$PATH"
# echo
# java -version | grep version
# java end

# https://github.com/starship/starship
eval "$(starship init zsh)"

function set_win_title(){
    echo -ne "\033]0; $(basename "$PWD") \007"
}
starship_precmd_user_func="set_win_title"

# pnpm
export PNPM_HOME="/Users/legend80s/Library/pnpm"
export PATH="$PNPM_HOME:$PATH"
# pnpm end
# bun
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# bun completions
[ -s "/Users/legend80s/.bun/_bun" ] && source "/Users/legend80s/.bun/_bun"

# Fig post block. Keep at the bottom of this file.
[[ -f "$HOME/.fig/shell/zshrc.post.zsh" ]] && builtin source "$HOME/.fig/shell/zshrc.post.zsh"
