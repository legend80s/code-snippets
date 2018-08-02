export default function rateFilter(filter) {
  const numberFilter = filter('number');

  /**
   * 将数字转换为增长率
   * 增加正负号和百分号
   *
   * @param  {number} number 目标数字
   * @param  {number} [fractionSize=2] 保留多少位小数
   *
   * @return {string}
   *
   * @example
   * rate(0.12567)
   * // => '+12.57%'
   *
   * rate(0)
   * // => '+0%'
   *
   * rate(-1.15326)
   * // => '-115.33%'
   */
  return function rate(number, fractionSize = 2) {
    /**
     * 小数位被截断
     * @type {string}
     */
    const truncated = numberFilter(number * 100, fractionSize);
    const flag = Number(truncated) >= 0 ? '+' : '';

    return `${flag}${truncated}%`;
  };
}

rateFilter.$inject = ['$filter'];
