/**
 * 将对象转为 query string
 * 注意不能转换嵌套对象
 *
 * @public
 *
 * @param {Object} object
 * @return {string}
 *
 * @example
 * stringifyObject({ a: 1, b: 2 })
 * // => "a=1&b=2"
 *
 * @example
 * // 嵌套对象转换
 * stringifyObject({ a: 1, b: 2, c: { a: 1, b: 2 } })
 * // "a=1&b=2&c[a]=1&c[b]=2"
 */
function stringifyObject(object) {
  return Object.entries(flattenObj(object)).map(([key, value]) => `${key}=${value}`).join('&');
}

/**
 * 将嵌套的对象扁平化
 *
 * @public
 *
 * @param  {Object} object
 * @return {Object}
 *
 * @example
 * flattenObj({ a: 1, b: 2, c: { a: 1, b: 2 } });
 * // => { a: 1, b: 2, 'c[a]': 1, 'c[b]': 2 } }
 */
function flattenObj(object) {
  return Object.keys(object).reduce((result, key) => {
    const value = object[key];

    if (typeof value === 'object') {
      return {
        ...result,
        ...mapKeys(flattenObj(value), (_, innerKey) => `${key}[${innerKey}]`),
      };
    }

    return {
      ...result,
      [key]: value,
    };
  }, {});
}

/**
 * 将对象的 key 按照 `iteratee` 做转换，value 保持不变，并返回一个新对象
 *
 * @public
 *
 * @param  {Object} object     待转换的对象
 * @param  {Function} iteratee 转换规则
 *
 * @return {Object}          新对象
 *
 * @example
 * mapKeys({ 'a': 1, 'b': 2 }, (value, key) => key + value);
 * // => {a1: 1, b2: 2}
 */
function mapKeys(object, iteratee) {
  return Object.keys(object).reduce((result, key) => {
    const value = object[key];

    return {
      ...result,
      [iteratee(value, key)]: value,
    };
  }, {});
}
