/**
 * 串行运行多个 Promise task
 *
 * @private
 *
 * @param  {[]Function} tasks 一组返回 Promise 的函数
 * @return {Promise}
 */
function serialize(tasks) {
  const result = [];

  return tasks.reduce((cur, next) => cur.then((values) => {
    result.push(...values);

    return next();
  }), Promise.resolve([]))
    .then((lastValues) => {
      result.push(...lastValues);

      return Promise.resolve(result);
    });
}

// example
const tasks = chunk(appIds, concurrency).map((chunkOfIds) =>
  () => this.q.all(chunkOfIds.map((appId) =>
    this.App.get({ appName: appId, handleError: false }).$promise
      // 先到先展现
      .then(({ id, quota, quotaReviewingTask, statistics }) => {
        this.otherInformationList[id] = { quota, quotaReviewingTask, statistics };
      })))
);

return serialize(tasks);
