/**
 * Resource fetch function which returns a Promise
 *
 * @example
 * const fetchUser = (id) => window.fetch(`http://jsonplaceholder.typicode.com/users/${id}`);
 *
 * @callback fetchResource
 * @param {string} id any resource id
 * @return {Promise}
 */

/**
 * Execute async tasks on by one
 *
 * @example
 * // Example 1
 * serialize([() => Promise.resolve(1), () => Promise.resolve(2)]).then((results) => console.log('results:', results));
 * // results: [1, 2]
 *
 * // Example 2
 * // 2 more common use cases in actual development
 * // Example 2.1
 * const userIds = [1, 2, 3, 4];
 * const fetchUser = id => window.fetch(`http://jsonplaceholder.typicode.com/users/${id}`).then((response) => {
 *   console.log(`GET user#${id} finished`);
 *   return response.json();
 * });
 *
 * serialize(userIds.map(id => () => fetchUser(id))).then((users) => console.log('users:', users));
 * // GET user#1 finished
 * // GET user#2 finished
 * // GET user#3 finished
 * // GET user#4 finished
 * // users: [[{ id: 1 },  { id: 2 }], [ { id: 3 },  { id: 4 }]]
 *
 * // Equals to
 * serialize([
 *   () => window.fetch('http://jsonplaceholder.typicode.com/users/1')
 *     .then((response) => { console.log('GET user#1 finished'); return response.json(); }),
 *
 *   () => window.fetch('http://jsonplaceholder.typicode.com/users/2')
 *     .then((response) => { console.log('GET user#2 finished'); return response.json(); }),
 *
 *   () => window.fetch('http://jsonplaceholder.typicode.com/users/3')
 *     .then((response) => { console.log('GET user#3 finished'); return response.json(); }),
 *
 *   () => window.fetch('http://jsonplaceholder.typicode.com/users/4')
 *     .then((response) => { console.log('GET user#4 finished'); return response.json(); }),
 *  ]).then((users) => console.log('users:', users));
 *
 * // Example 2.2
 * // fetching user information at concurrncy 2
 * serialize([
 *   () => Promise.all([
 *     window.fetch('http://jsonplaceholder.typicode.com/users/1').then((response) => response.json()),
 *     window.fetch('http://jsonplaceholder.typicode.com/users/2').then((response) => response.json()),
 *   ]),
 *   () => Promise.all([
 *     window.fetch('http://jsonplaceholder.typicode.com/users/3').then((response) => response.json()),
 *     window.fetch('http://jsonplaceholder.typicode.com/users/4').then((response) => response.json()),
 *   ]),
 *  ]).then((users) => console.log('users:', users));
 * // users: [[{ id: 1 },  { id: 2 }], [ { id: 3 },  { id: 4 }]]
 *
 * @param  {fetchResource[]} tasks Tasks to be executed
 * @return {Promise<Array>}
 */
function serialize(tasks = []) {
  /* eslint-disable arrow-body-style */
  return tasks.reduce((initialPromise, cur) => {
    return initialPromise.then((initialValues) => {
      return cur().then((curValue) => {
        /* eslint-enable arrow-body-style */
        return [...initialValues, curValue];
      });
    });
  }, Promise.resolve([]));
}

module.exports = serialize;
