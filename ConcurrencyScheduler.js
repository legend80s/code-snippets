import serialize from './serialize';
import chunk from 'lodash/array/chunk';

/**
 * Async resources concurrency scheduler
 *
 * 资源并发请求调度器
 *
 * @author 孟陬
 *
 * @example
 * const userIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 * const concurrency = 3;
 * const fetchUser = (id) => window.fetch(`http://jsonplaceholder.typicode.com/users/${id}`)
 *   .then((response) => response.json())
 *   .catch(() => {});
 *
 * const rcs = new ResourceConcurrencyScheduler(userIds, fetchUser, concurrency);
 *
 * rcs.start().then(console.log);
 */
class ResourceConcurrencyScheduler {
  /**
   * @constructor
   *
   * @param  {string[]}  [resourceIds=[]] 资源 ID 集合
   * @param  {fetchResource} [resourceFetcher=() => Promise.resolve()] 获取资源函数
   * @param  {number} [concurrency=5] 并发度
   */
  constructor(resourceIds = [], resourceFetcher = () => Promise.resolve(), concurrency = 5) {
    this.resourceIds = resourceIds;
    this.resourceFetcher = resourceFetcher;
    this.concurrency = concurrency;
  }

  /**
   * 开始获取
   *
   * @return {Promise}
   */
  fetch() {
    return serialize(this.makeTasks()).then(ResourceConcurrencyScheduler.flatten);
  }

  /**
   * 生成并发任务
   *
   * @private
   * @return {fetchResource[]} 返回 Promise 函数的数组
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
   * 浅展平数组
   *
   * @private
   * @param  {Array} array 待展平的数组
   * @return {Array}       已展平的数组
   */
  static flatten(array) {
    return array.reduce((cur, next) => cur.concat(next));
  }
}

module.exports = ResourceConcurrencyScheduler;
