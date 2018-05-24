/**
 * 所有的 console.log info error 均添加日期，方便 debug
 *
 * @example
 * console.log('Server listening on port 6001');
 * // => 2018-5-24 10:45:19 Server listening on port 6001
 */

/* eslint-disable no-console */
const util = require('util');

const log = console.log;
const info = console.info;
const error = console.error;

console.log = (...args) => {
  log(...[(new Date).toLocaleString(), util.format(...args)]);
};

console.info = (...args) => {
  info(...[(new Date).toLocaleString(), util.format(...args)]);
};

console.error = (...args) => {
  error(...[(new Date).toLocaleString(), util.format(...args)]);
};

/* eslint-enable no-console */
