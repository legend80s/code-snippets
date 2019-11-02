# code-snippets
Overused and valuable code snippets

## URL

### Parse URL query string to object 

```js
const token = new window.URLSearchParams(document.location.search).get('token')
```
