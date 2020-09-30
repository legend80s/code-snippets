# Code Snippets

Overused and valuable code snippets

## Shell

1. shell 文件内无法使用 nvm use 8

```sh
# nvm
export NVM_DIR="$HOME/.nvm"
. "/usr/local/opt/nvm/nvm.sh"

# nvm --version
unset npm_config_prefix

nvm use 8 && npm run dev:herb
```

1. replace `1.1.5-alpha.0` to `1.1.5` in a file

Use case: Copy and normalize version in package.json to crx's manifest.json.

package.json

```json
{
  "version": "1.1.6-alpha.1"
  "scripts": {
    "sync-version": "sh scripts/sync-version.sh"
  }
}
```

scripts/sync-version.sh

```sh
# 1.1.5-alpha.0 => 1.1.5
IFS='-' read -ra version_parts <<< "$npm_package_version"

npm_package_version_trimed=${version_parts[0]}

sed -i '' -e 's|"version": "[^"]\{1,\}"|"version": "'$npm_package_version_trimed'"|' src/public/manifest.json

echo '\x1b[32mVersion \x1b[1m'$npm_package_version_trimed'\x1b[0m\x1b[32m has synced to manifest.json.\x1b[0m'
```

2. start dev server after web server is ready

```sh
export HOST="anymock.local.alipay.net"
export PORT="7001"
url="http://${HOST}:${PORT}"
export WEB_URL="${url}"
export SOCKET_SERVER="${url}"
fkill :${PORT}

echo \[$(date)\]: IMOCK-WEB npm run dev START && cd ../imock-web && tnpm run dev & sleep 20s && echo $(date) && echo '10 SECOND PASSED, START CURLING THE http://anymock.local.alipay.net:7001' && echo $(date) && curl http://anymock.local.alipay.net:7001 && echo '\n\n' && echo \[$(date)\]': IMOCK-WEB IS READY, READY TO START THE IMOCK SERVER' && cd ../imock && tnpm run dev:local
```

## JS

### General

1. Diff JSON

https://runkit.com/embed/ynmsfkykt23p

```js
/**
 * Diff source against changed find out the difference
 * @example
 * expected = { a: 1, b: 'str', c: [1, '2'], d: { d1: 1, d2: 2.1 } };
 * actual = { a1, b: false, c: [1, {} ], d: { d1: '1', d2: 2, d3: '3' } };
 * diff(expected, actual)
 * // => {
 *   a: 'removed',
 *   a1: 'added',
 *   b: 'type changed from string to boolean',
 *   c: { 1: 'type changed from string to object' },
 *   d: { d1: 'type changed from number to string', d3: 'added' }
 * }
 * 
 * @example
 * diff({ a: true }, { a: false })
 * // => {}
 * 
 * @param expected 
 * @param actual 
 * @returns {IDifference}
 */
// function diff(expected, actual) {}

var jsonSchema = require("json-schema")
const toJsonSchema = require('to-json-schema');

const expected = { a: 1, b: 'str', c: [1, '2'], d: { d1: 1, d2: 2.1 } };
const actual = { a1: 'hello', b: false, c: [1, {} ], d: { d1: '1', d2: 2, d3: '3' } };
 
// const mock = {
//   name: 'David',
//   born: '1990-04-05T15:09:56.704Z',
//   rank: 1,
//   luckyNumbers: [7, 77, 5]
// }

// const objToBeConverted = {
//   a: 1,
//   name: 1,
//   born: '1990-04-05T15:09:56.704Z',
//   luckyNumbers: [7, 77, 5]
// };

const rawSchema = toJsonSchema(expected, {
  required: true,
  objects: { additionalProperties: false },
  arrays: {mode: 'tuple'},
 });
console.log('rawSchema', rawSchema)

const schema = rawSchema;

console.log(jsonSchema(actual, schema))
```

1. sync pipe

![map filter reduce explained with emoji](https://i.redd.it/yf7rw3pjiapx.jpg)

- pipe: reduce from left to right
- compose: reduce from right to left. In math terms, composing the functions f(), g(), and h() produces f(g(h())).

method 1
```ts
type IFunction = (...args: any[]) => any;

function pipe(...fns: IFunction[]): any {
  return (...args: any[]) => {
    return fns.slice(1).reduce((acc, fn, idx) => {
      return fn(acc);
    }, fns[0](...args));
  };
}
```

method 2
```ts
type IFunction = (...args: any[]) => any;

function pipe(...fns: IFunction[]): any {
  if (fns.length < 1) {
    throw Error('pipe requires at least one argument')
  }

  fns.forEach((fn, i) => {
    if (typeof fn !== 'function') {
      throw Error(
        'pipe requires each argument to be a function. ' +
        `Argument #${i+1} is of type "${typeof fn}"`,
      )
    }
  })

  return (...args: any[]) => {
    return fns.reduce((acc, fn, idx) => {
      return idx === 0 ? fn.apply(null, acc) : fn(acc);
    }, args);
  };
}
```

compose - underscore way

```ts
_.compose = function() {
  var args = arguments;
  var start = args.length - 1;
  return function() {
    var i = start;
    var result = args[start].apply(this, arguments);
    while (i--) result = args[i].call(this, result);
    return result;
  };
};

// test
var greet    = function(name){ return "hi: " + name; };
var exclaim  = function(statement){ return statement.toUpperCase() + "!"; };
var welcome = _.compose(greet, exclaim);
welcome('moe');
=> 'hi: MOE!'
```

1. async some and find。https://segmentfault.com/a/1190000014598785#item-6

```typescript
async function asyncSome<T>(array: T[], callback: (item: T, idx: number, arr: T[]) => Promise<boolean>) {
  for (let [index, item] of Object.entries(array)) {
    if (await callback(item, Number(index), array)) return true;
  }

  return false;
}

async function asyncFind<T>(array: T[], callback: (item: T, idx: number, arr: T[]) => Promise<boolean>) {
  for (let [index, item] of Object.entries(array)) {
    if (await callback(item, Number(index), array)) return item;
  }

  return null;
}
```

## Browser

### Request

fetch synchronously

```js
console.log(1)

var xhr = new XMLHttpRequest();
xhr.open("GET", "https://jsonplaceholder.typicode.com/todos/1", false);
xhr.onload = function (e) {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      console.log(xhr.responseText);
    } else {
      console.error('status not 200:', xhr.status);
    }
  }
};
xhr.onerror = function (e) {
  console.error('onerror', xhr.statusText);
};
xhr.send(null);
console.log(2)
```

```js
/**
 * 
 * @param url 
 * @param {{ method: string; body: any; headers: any; }} options 
 */
function fetchSync(url, options = {}) {
  const { method, body, headers } = options;
  const req = new XMLHttpRequest();

  req.open(method, url, false);
  req.send(JSON.stringify(body));

  Object.keys(headers).forEach(key => {
    xhr.setRequestHeader(key, headers[key]);
  });

  if (xhr.readyState === XMLHttpRequest.DONE) {
    if(xhr.getResponseHeader('content-type')==='application/json'){
      var result = JSON.parse(xhr.responseText);	
        //根据返回结果判断验证码是否正确
    } else {
        console.log(xhr.responseText);
}
}
}

```

### URL

#### Parse URL query string to object 

```js
const token = new window.URLSearchParams(document.location.search).get('token')
```
from https://gist.github.com/pirate/9298155edda679510723.

> I've tested all the functions above by https://runkit.com/embed/n18yhf9u2nqc and the conclusion is that **url-parse** and **URLSearchParams** is the rightest and most expected ones against the standard **url - Node.js built-in module**. Even the query-string module is not work as expected.
>
> ```javascript
> const search = '?abc=foo&def=[asf]&xyz==5&flag&&double&q=test1=test2&keyB=hff92hfgg=';
> 
> console.log((search));
> 
> const url = require('url')
> console.log('0. url - the Node.js built-in module √');
> console.log(url.parse(search, true).query);
> 
> console.log('1. queryString ×');
> console.log(queryString.parse(search));
> 
> const parse = require('url-parse')
> console.log('2. url-parse √');
> console.log(parse(search, true).query);
> 
> console.log('3. URLSearchParams √');
> console.log([...new URLSearchParams(search).entries()].reduce((q, [k, v]) => Object.assign(q, {[k]: v}), {}))
> ```
>
> result:
>
> ```
> ?abc=foo&def=[asf]&xyz==5&flag&&double&q=test1=test2&keyB=hff92hfgg=
> 
> 0. url - the Node.js built-in module √
> Object {abc: "foo", def: "[asf]", double: "", flag: "", keyB: "hff92hfgg=", q: "test1=test2", xyz: "=5"}
> 
> 1. queryString ×
> Object {: null, abc: "foo", def: "[asf]", double: null, flag: null, keyB: "hff92hfgg=", q: "test1=test2", xyz: "=5"}
> 
> 2. url-parse √
> Object {abc: "foo", def: "[asf]", double: "", flag: "", keyB: "hff92hfgg=", q: "test1=test2", xyz: "=5"}
> 
> 3. URLSearchParams √
> Object {abc: "foo", def: "[asf]", double: "", flag: "", keyB: "hff92hfgg=", q: "test1=test2", xyz: "=5"}
> ```

### Beautiful Log

```js
function log() {
  const t = 'onReady';
  const o = "padding:2px 5px;background:#91d5ff;border:1px solid #91d5ff;";
  const i = "padding:2px 5px;background:#e6f7ff;border:1px solid #91d5ff;";

  console.log.apply(void 0, ["%c" + "global-state-core".toUpperCase() + "%c" + t, o, i].concat([].slice.call(arguments, 0)));
}

log('legend80s')
```

## Vue

### Vue Minimum Reactivity Core

Code extracted from [vue-advanced-workshop](https://github.com/legend80s/vue-advanced-workshop/tree/master/1-reactivity). And Bilibili Video: https://www.bilibili.com/video/av49047971?p=1.

Part 1: Minimum reactivity core functions: `observe`, `autorun` and `Dep` class.

```js
function observe(obj) {
  Object.keys(obj).forEach((key) => {
    let internalValue = obj[key];
    const dep = new Dep();

    Object.defineProperty(obj, key, {
      get() {
        // console.log(`${key} is ${internalValue}`)

        dep.depend();

        return internalValue;
      },

      set(newValue) {
        internalValue = newValue;

        dep.notify()
      }
    })
  })
}

let activeUpdate = null;

function autorun(update) {
  activeUpdate = update;

  update();

  activeUpdate = null;
}

window.Dep = class Dep {
  constructor() {
    this.subscribers = new Set();
  }

  depend() {
    if (activeUpdate) {
      this.subscribers.add(activeUpdate);
    }
  }

  notify() {
    this.subscribers.forEach(sub => sub());
  }
}
```

Part 1: Use and validate the minimum reactivity core functions.

```js
const state = {
  age: 22,
  name: 'legend80s',
}

observe(state)

const updateAge = (age) => {
  document.getElementById('age').textContent = state.age;
  console.log('age updated');
}

const updateName = (name) => {
  document.getElementById('name').textContent = state.name;
  console.log('name updated');
}

autorun(updateAge)

// reason for why `this.subscribers = new Set();`
autorun(updateAge)

// set default value for input
document.getElementById('name-input').value = state.name;

autorun(updateName)

// change age state and the template is expected to be changed
document.getElementById('incrementer').addEventListener('click', () => {
  state.age += 1;
})

// change name state and the template is expected to be changed
document.getElementById('name-input').addEventListener('input', (event) => {
  state.name = event.target.value;
})
```

See complete code: https://github.com/legend80s/code-snippets/blob/master/vue-minimum-reactivity-core.html or [codepen](https://codepen.io/chuanzonglcz/pen/dyyQKNp).

## eslint rules

.eslintrc.js

```js
{
  "extends": [
    "eslint:recommended",
    "plugin:vue/recommended"
  ],
  "plugins": ["vue", "jsx"],
  "globals": {
    "window": true,
    "require": true,
    "$": true,
    "Tracert": true,
    "AlipayJSBridge": true,
    "describe": true,
    "it": true,
    "define": true
  },
  "parserOptions": {
    "parser": "babel-eslint",
    "ecmaFeatures": {
      "legacyDecorators": true
    }
  },
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  },
  "rules": {
    "vue/max-attributes-per-line": ["warn", {
      "singleline": 3,
      "multiline": {
        "max": 1,
        "allowFirstLine": false
      }
    }],
    "vue/singleline-html-element-content-newline": ["off"],
    "vue/no-parsing-error": ["error", {
      "control-character-in-input-stream": false
    }],
    "vue/html-self-closing": ["error", {
      "html": {
        "void": "always",
        "normal": "never",
        "component": "always"
      },
      "svg": "always",
      "math": "always"
    }],

    "padding-line-between-statements": ["error",
      { "blankLine": "always", "prev": "*", "next": "return" },

      { "blankLine": "always", "prev": ["const", "let", "var"], "next": "*"},
      { "blankLine": "any",    "prev": ["const", "let", "var"], "next": ["const", "let", "var"]},

      { "blankLine": "always", "prev": "directive", "next": "*" },
      { "blankLine": "any",    "prev": "directive", "next": "directive" }
    ],
    "comma-dangle": ["error", {
      "arrays": "always-multiline",
      "objects": "always-multiline",
      "imports": "always-multiline",
      "exports": "always-multiline",
      "functions": "always-multiline"
    }],
    "arrow-parens": ["error", "as-needed", {
      "requireForBlockBody": true
    }],
    "arrow-body-style": ["error", "as-needed", {
      "requireReturnForObjectLiteral": false
    }],
    "space-in-parens": ["error", "never"],
    "space-before-blocks": "error",
    "space-before-function-paren": ["error", {
      "anonymous": "always",
      "named": "never",
      "asyncArrow": "always"
    }],
    "keyword-spacing": ["error", {
      "before": true,
      "after": true,
      "overrides": {
        "return": { "after": true },
        "throw": { "after": true },
        "case": { "after": true }
      }
    }],
    "spaced-comment": ["error", "always", {
      "line": {
        "exceptions": ["-", "+"],
        "markers": ["=", "!"]
      },
      "block": {
        "exceptions": ["-", "+"],
        "markers": ["=", "!"],
        "balanced": true
      }
    }],
    "key-spacing": ["error", { "beforeColon": false, "afterColon": true }],
    "comma-spacing": ["error", { "before": false, "after": true }],
    "object-curly-spacing": ["error", "always"],
    "space-infix-ops": "error",
    "arrow-spacing": ["error", { "before": true, "after": true }],
    "semi":["warn", "always"],
    "no-unused-vars": 1,
    "no-extra-semi": 1,
    "prefer-const": 1,
    "indent": ["off"],
    "no-console": "off",
    "quotes": ["warn", "single"],
    "no-extra-boolean-cast": ["warn"]
  }
}
```

### TS

the same signature only return type

```ts
interface IRequestPipeParams {
  url: string;
  headers: { [key: string]: any };
  method: string;
  data: { [key: string]: any };
}

export type IRequestPipe = (config: IRequestPipeParams) => Promise<any>;
export type IRequestPipeSync = (...args: Parameters<IRequestPipe>) => any;

```

## SQL

```sql
# KPI
SELECT * FROM 
(SELECT COUNT(*) as '总用户' FROM imock_user) as user,
(SELECT COUNT(*) as 'X 用户' FROM imock_user WHERE user_id LIKE '2088%') as alipay_user,
(SELECT COUNT(*) as 'Y 用户' FROM imock_user WHERE user_id NOT LIKE '2088%') as buc_user,
(SELECT COUNT(*) as '项目' FROM imock_project) as project,
(SELECT COUNT(*) as '接口' FROM imock_interface) as interface,
(SELECT COUNT(*) as '数据' FROM imock_request) as request
```

## VSCode

### Settings

1. If you want to enjoy seeing that vscode is detecting that the file is dirty showing the "dirty cycle" in the tab, set `files.autoSaveDelay` to any number above 1000ms.

```json
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1001,
```

## Images


## CSS

### Arrow

```css
.my-arrow {
  .arrow(9px, red);
}

.arrow (@size; @color; @width: 1px; @direction: right) {
  width: @size;
  height: @size;
  display: inline-block;
  .arrow-shape(@color, @width, @direction);
}

.arrow-shape (@color; @width: 1px; @direction) when (@direction = right) {
  border: @width solid @color;
  border-width: @width @width 0 0;
  transform: rotate(45deg);
}
```

```html
更多 <span class="my-arrow"></span>
```

demo: https://codepen.io/chuanzonglcz/pen/vYNveXx
