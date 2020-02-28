# code-snippets
Overused and valuable code snippets

## Shell

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

## JS

### General

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

## URL

### Parse URL query string to object 

```js
const token = new window.URLSearchParams(document.location.search).get('token')
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

