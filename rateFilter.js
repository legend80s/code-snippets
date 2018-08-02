export default function rateFilter(filter) {
  const numberFilter = filter('number');

  /**
   * 将数字转换为增长率
   * 增加正负号和百分号
   * @param  {number} number 目标数字
   * @param  {number} [fractionSize=2] 保留多少位小数
   * @return {string}
   *
   * @example
   * rate(0.125)
   * // => '+0.13%'
   *
   * rate(0)
   * // => '+0%'
   *
   * rate(-1.15326)
   * // => '-1.15%'
   */
  return function rate(number, fractionSize = 2) {
    /**
     * 小数位被截断
     * @type {string}
     */
    const truncated = numberFilter(number, fractionSize);

    return Number(truncated) >= 0 ? `+${truncated}%` : `${truncated}%`;
  };
}

rateFilter.$inject = ['$filter'];
