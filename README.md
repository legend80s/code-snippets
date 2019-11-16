# code-snippets
Overused and valuable code snippets

## URL

### Parse URL query string to object 

```js
const token = new window.URLSearchParams(document.location.search).get('token')
```

## Vue

### Vue Minimum Reactivity Core

Code extracted from [vue-advanced-workshop](https://github.com/legend80s/vue-advanced-workshop/tree/master/1-reactivity). And Bilibili Video: https://www.bilibili.com/video/av49047971?p=1.

Part 1: Minimum reactivity core functions.

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

// Reason for why `this.subscribers = new Set();`?
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
