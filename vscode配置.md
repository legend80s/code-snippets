1. 安装terminal。

1. 安装各种包。

1. 安装code命令。



```
code --install-extension Shan.code-settings-sync
code --install-extension TwentyChung.jsx
code --install-extension alefragnani.project-manager
code --install-extension christian-kohler.path-intellisense
code --install-extension dbaeumer.vscode-eslint
code --install-extension dracula-theme.theme-dracula
code --install-extension eg2.tslint
code --install-extension esbenp.prettier-vscode
code --install-extension flowtype.flow-for-vscode
code --install-extension joelday.docthis
code --install-extension mohsen1.prettify-json
code --install-extension naumovs.color-highlight
code --install-extension octref.vetur
code --install-extension qinjia.view-in-browser
code --install-extension redhat.java
code --install-extension robertohuertasm.vscode-icons
code --install-extension vscjava.vscode-java-debug
code --install-extension vscjava.vscode-java-pack
code --install-extension waderyan.gitblame
code --install-extension wayou.vscode-todo-highlight
code --install-extension wix.vscode-import-cost
code --install-extension xyz.local-history
code --install-extension yzhang.markdown-all-in-one
code --install-extension zhuangtongfa.Material-theme
```



```
code --install-extension alefragnani.project-manager
code --install-extension cpylua.language-postcss
code --install-extension dbaeumer.vscode-eslint
code --install-extension eamodio.gitlens
code --install-extension esbenp.prettier-vscode
code --install-extension firsttris.vscode-jest-runner
code --install-extension flowtype.flow-for-vscode
code --install-extension jasonnutter.search-node-modules
code --install-extension octref.vetur
code --install-extension Shan.code-settings-sync
code --install-extension shengchen.vscode-leetcode
code --install-extension shinnn.stylelint
code --install-extension svipas.prettier-plus
code --install-extension vscode-icons-team.vscode-icons
code --install-extension zyy7259.vscode-zoro-pack
```



1. common + ,  唤起配置文件

1. 替换配置文件。



```
// Place your settings in this file to overwrite the default settings
{
  // Editor
  "editor.fontSize": 15,
  "editor.tabSize": 2,
  "editor.acceptSuggestionOnEnter": "off",
  "editor.selectionHighlight": false,
  "editor.wordWrap": "on",
  "editor.formatOnSave": true,
  // File Explorer
  "explorer.openEditors.visible": 0,
  "vsicons.dontShowNewVersionMessage": true,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "workbench.iconTheme": "vscode-icons",
  "vsicons.projectDetection.autoReload": true,
  // search
  "search.exclude": {
    "**/node_modules": true,
    "**/bower_components": true,
    "**/spm_modules": true,
    "**/.history": true,
    "**/dist": true,
    "**/dist_html": true
  },
  // window
  "window.title": "${activeEditorMedium}${separator}${rootPath}",
  // ESLint
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "vue"
  ],
  // Prettier-eslint
  // Terminal
  "terminal.integrated.shell.osx": "/bin/zsh",
  "terminal.integrated.fontSize": 13,
  "typescript.check.npmIsInstalled": false,
  // Vim
  "vim.disableAnnoyingNeovimMessage": true,
  "vim.enableNeovim": true,
  "vim.handleKeys": {
    "<D-d>": false
  },
  "vim.useSolidBlockCursor": true,
  "vim.useSystemClipboard": true,
  // Debug
  "launch": {
    // 使用 IntelliSense 以学习相关的 Node.js 调试属性。
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
      {
        "type": "node",
        "request": "launch",
        "name": "debug current file",
        "program": "${file}"
      }
    ]
  },
  "emmet.syntaxProfiles": {
    "html": {
      "attr_quotes": "single"
    }
  },
  "emmet.triggerExpansionOnTab": true,
  "files.associations": {
    "*.vm": "html",
    "*.css": "postcss"
  },
  "window.restoreWindows": "all",
  "workbench.startupEditor": "none",
  "javascript.validate.enable": false,
  "flow.runOnEdit": false,
  "flow.useNPMPackagedFlow": true,
  "prettier.eslintIntegration": true,
  "prettier.singleQuote": true,
  "prettier.javascriptEnable": [
    "javascript",
    "javascriptreact"
  ],
  "prettier.jsonEnable": [],
  "window.zoomLevel": 0,
  "gitlens.blame.line.enabled": false,
  "gitlens.codeLens.locations": [],
  "atomKeymap.promptV3Features": true,
  "editor.multiCursorModifier": "ctrlCmd",
  "editor.formatOnPaste": true
}
```



**快捷键**
cmd + p 开启搜索
shift＋cmd＋p 执行命令
**配置project Manager 新窗口快捷键**：搜索project Manager 配置open in new window
**配置save project 新窗口快捷键**：可以save当前项目为
