import { call } from './common/h5';
import { isAppx } from './nativeUtil';

interface IOptions {
  delay?: number;
  debug?: boolean;
  loadingMessage?: string;
}

/**
 * `showLoading` wrapper.
 *
 * Show loading during fetching and
 * hide loading automatically when request finished either successful or failed.
 *
 * 默认值 300ms 是为了体验考虑，比如在 300ms 内请求返回了就没必要展示loading了，否则loading一闪而过体验不好，而且给用户『飞快』的感觉，因为没有 loading
 *
 * @param {Promise<any>} target not a async function but a Promise returned by a function.
 * @param options
 * [options.delay=300] in ms. Delay show loading until target time cost > `delay`. Unexpected result will happen when target time const === `delay`
 * [options.debug=false] show debug info: time cost etc.
 *
 * @returns {Promise<any>}
 */
export async function withLoading<T>(
  target: Promise<T>,
  { delay = 300, debug = false, loadingMessage = '' }: IOptions = {},
): Promise<T> {
  if (!isPromise(target)) {
    // eslint-disable-next-line no-console
    console.error({
      msg:
        "[showLoading] won't works as expected to `showLoading`. target must be a Promise. It must be a misuse and thus a bug",

      error: { target, 'typeof target': typeof target },
    });

    return target;
  }

  showLoading({ content: loadingMessage || '', delay });

  try {
    // eslint-disable-next-line no-console
    debug && console.time && console.time('target cost time');

    return await target;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[showLoading] target promise rejected', error);

    throw error;
  } finally {
    // eslint-disable-next-line no-console
    debug && console.timeEnd && console.timeEnd('target cost time');

    // 自己发起的 loading 你才有资格关闭
    // 防止 hide 别的页面的 loading
    hideLoading();
  }
}

function showLoading({
  content,
  delay,
}: {
  content: string;
  delay: number;
}): void {
  if (isAppx()) {
    return my.showLoading({ content, delay });
  }

  try {
    return call('showLoading', { text: content, delay });
  } catch (error) {
    console.error('call showLoading failed:', error);

    return;
  }
}

function hideLoading(): void {
  if (isAppx()) {
    return my.hideLoading();
  }

  try {
    return call('hideLoading');
  } catch (error) {
    console.error('call hideLoading failed:', error);

    return;
  }
}

/**
 *
 * @param {any} obj
 * @returns {boolean}
 */
function isPromise(obj: any): boolean {
  return obj && typeof obj.then === 'function';
}
