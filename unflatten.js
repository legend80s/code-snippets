const flat1 = {
  'a.b.c': 1,
  'a.b.d': 2,
}

const expected1 = {
  a: {
    b: {
      c: 1,
      d: 2
    }
  }
}

const flat2 = {
  'a.b': 1,
  'a': 2,
}

const expected1 = {
  a: 2
}

// 依赖 lodash
function mergeDeep(...sources) {
  return _.merge(...sources)
}

function isPlainObject(value) {
  return _.isPlainObject(value)
}

function _nest(nodeValue, keys) {
  if (keys.length === 0) {
    return nodeValue;
  }

  return {
    [keys[0]]: _nest(nodeValue, keys.slice(1))
  };
}

function unflatten(flat) {
  const nested = {};

  Object.keys(flat).forEach((key) => {
    const nodeValue = flat[key];
    const keys = key.split('.').map((k) => k.trim()).filter(k => k !== '');

    const level1 = _nest(nodeValue, keys.slice(1));

    if (nested[keys[0]] && isPlainObject(level1)) {
      nested[keys[0]] = mergeDeep({}, nested[keys[0]], level1);
    } else {
      nested[keys[0]] = level1;
    }
  });

  return nested;
}

nest(flat)
