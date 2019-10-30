type IJson = Record<string, any>;

// TODO: 那就是第一天访问了拿了缓存，第二天第一次进去过api失败了就直接给缓存数据了
// 解决：如果过期太久了，就直接废弃缓存
// 放个五分钟的缓存过期就不管了以api为准了，现在服务端的机制也是这样的
class LocalStorageCache {
  private scopedKey: string;
  private scopedDateKey: string;
  private expiry: number;
  static scopedCountKey: string = `${NAMESPACE}_cache_count`;
  static MAX_COUNT = 10;

  /**
   * @param options.expiry 单位秒。默认 5 分钟
   */
  constructor({ key = '', expiry = 1 * 60 * 1000 } = {}) {
    this.expiry = expiry;

    if (!key) { throw new TypeError('key required'); }

    this.scopedKey = `${NAMESPACE}_${key}`;
    this.scopedDateKey = `${this.scopedKey}_stored_at`;
  }

  set(value: IJson): IJson {
    const validated = this.validateBeforeSave();

    if (!validated) {
      return;
    }

    console.info('[cache] and store at:', Date.now());

    LocalStorageCache.incrementCount();
    setLocalStorage(this.scopedKey, value);
    setLocalStorage(this.scopedDateKey, Date.now());

    return value;
  }

  /**
   * 保存前置校验
   * 若超过保存条数上限则退出保存
   * 若超过保存条数上限则将最不新鲜的一条数据删除
   */
  private validateBeforeSave(): boolean {
    const count: number = LocalStorageCache.getCount();

    console.info('[cache] current saved count', count, 'MAX_COUNT', LocalStorageCache.MAX_COUNT);

    if (count > LocalStorageCache.MAX_COUNT) {
      // return false;

      this.removeTheStalest();
    }

    return true;
  }

  private static getCount(): number {
    const count: number = Number(getLocalStorage(LocalStorageCache.scopedCountKey) || 0);

    return count;
  }

  private removeTheStalest() {
    // TODO 存储结构得变幻，否则
  }

  private static incrementCount(): number {
    const newCount = LocalStorageCache.getCount() + 1;

    setLocalStorage(LocalStorageCache.scopedCountKey, newCount);

    return newCount;
  }

  private static decrementCount(): number {
    const newCount = LocalStorageCache.getCount() - 1;

    setLocalStorage(LocalStorageCache.scopedCountKey, newCount);

    return newCount;
  }

  get(): IJson {
    return getLocalStorage(this.scopedKey);
  }

  private getStoredAt(): number {
    const storedAt: number = getLocalStorage(this.scopedDateKey);

    return storedAt || 0;
  }

  isExpired(): boolean {
    const now = Date.now();
    const storedAt = this.getStoredAt();

    const expired: boolean = now - storedAt > this.expiry;

    console.info(
      '[cache] isExpired Date.now()', now,
      'storedAt', storedAt,
      'this.expiry', this.expiry,
      'expired', expired,
    );

    return expired;
  }

  remove(): void {
    LocalStorageCache.decrementCount();

    removeLocalStorage(this.scopedDateKey);
    return removeLocalStorage(this.scopedKey);
  }
}

// use
export async function fetchH5data<R>(options: string | IH5dataOptions): Promise<R> {
  const totalPath = `https://render.alipay.com/p/s/h5data/${env}/${path}`;

  const cache = new LocalStorageCache({ key: totalPath });
  const hit = cache.get();

  if (!cache.isExpired() && hit) {
    console.info('[cache][fetchH5data] retrieved from cache', hit);
    return hit as R;
  }

  console.info('[cache][fetchH5data] try to retrieve from remote');

  return new Promise<R>(function (resolve, reject) {
    ap.httpRequest({
      url: totalPath,
      method: 'POST',
      dataType: 'json',
      success: function (result) {
        return resolve(data);
      },
      fail: function (res) {
        reject(res);
      },
    });
  }).then((resp) => {
    console.info('[cache][fetchH5data] retrieved from remote', resp);
    cache.set(resp);

    return resp;
  }).catch((error) => {
    console.warn('[cache][fetchH5data] retrieved from remote failed', error);

    if (hit) {
      cache.set(hit);
      console.warn('[cache][fetchH5data] reuse and save the previous fetched response', hit);

      return hit as R;
    }

    throw error;
  });
};

