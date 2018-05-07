import angular from 'angular';

/**
 * 因为 1.5.8 才有 $q.race，但不能升级到 1.5.8 因为相当于重写
 * @link https://gist.github.com/jrencz/0bf3917d0a28c2b87dff
 * 注意：IE 可能报错 “Expected promises to be an iterable or a hash, got object”，因为用的是 `Symbol.iterator`
 *
 * @example
 * $q.race([promise1, promise2]);
 * $q.race({ key1: promise1, key2: promise2 });
 */
export default angular
  .module('q.race', [])

  .config(['$provide', ($provide) => {
    $provide.decorator('$q', ['$delegate', ($delegate) => {
      $delegate.race = promises => $delegate((resolve, reject) => {
        const bind = promise => {
          if (typeof promise === 'object' && promise != null &&
            'then' in promise && 'catch' in promise) {
            promise
              .then((result) => {
                resolve(result);

                return result;
              })
              .catch((reason) => {
                reject(reason);

                return $delegate.reject(reason);
              });
          } else {
            throw new TypeError('Expected all promises to be thanables,' +
              ` got '${typeof promise}'`);
          }
        };

        if (promises && Symbol.iterator in promises) {
          for (const promise of promises) {
            bind(promise);
          }
        } else if (typeof promises === 'object' && promises != null) {
          /* eslint-disable no-restricted-syntax */
          for (const promiseName in promises) {
          /* eslint-enable no-restricted-syntax */
            if (promises.hasOwnProperty(promiseName)) {
              bind(promises[promiseName]);
            }
          }
        } else {
          throw new TypeError('Expected promises to be an iterable or a' +
            ` hash, got '${typeof promises}'`);
        }
      });

      return $delegate;
    }]);
  }])
  .name
  ;
