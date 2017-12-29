import serialize from './serialize';
import chunk from 'lodash/array/chunk';

/**
 * 资源并发请求调度器
 *
 * @author 孟陬
 *
 * @example
 * const userIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 * const concurrency = 3;
 * const fetcher = (userId) => window.fetch(`http://jsonplaceholder.typicode.com/users/${userId}`)
 *   .then((response) => response.json())
 *   .catch(() => {});
 *
 * const cs = new ConcurrencyScheduler(userIds, fetcher, concurrency);
 *
 * cs.start().then(console.log);
 */
class ConcurrencyScheduler {
  /**
   * 返回 Promise 的函数
   *
   * @callback fetchCallback
   * @param {string} id 资源 id
   * @return {Promise}
   */

  /**
   * @constructor
   *
   * @param  {Array}  [resourceIds=[]] 资源 ID 集合
   * @param  {fetchCallback} [resourceFetcher=() => Promise.resolve()] 获取资源函数
   * @param  {integer} [concurrency=5] 并发度
   */
  constructor(resourceIds = [], resourceFetcher = () => Promise.resolve(), concurrency = 5) {
    this.resourceIds = resourceIds;
    this.resourceFetcher = resourceFetcher;
    this.concurrency = concurrency;
  }

  /**
   * 生成并发任务
   *
   * @private
   *
   * @return {Function[]} 返回 Promise 函数的数组
   */
  makeTasks() {
    return chunk(this.resourceIds, this.concurrency).map((chunkOfIds) =>
      () => Promise.all(chunkOfIds.map((id) =>
        // 出错不影响后面的继续获取资源
        this.resourceFetcher(id).catch(() => {})
      ))
    );
  }

  /**
   * 开始获取
   * @return {Promise}
   */
  start() {
    return serialize(this.makeTasks());
  }
}

module.exports = ConcurrencyScheduler;
