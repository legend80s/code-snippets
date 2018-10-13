/**
 * 计算显示器的每英寸像素值，即像素密度 PPI Pixels Per Inch
 * @link https://zh.wikipedia.org/wiki/%E6%AF%8F%E8%8B%B1%E5%AF%B8%E5%83%8F%E7%B4%A0 
 *
 * @param  {number} w 屏幕横向分辨率
 * @param  {number} h 屏幕纵向分辨率
 * @param  {number} d 屏幕对角线的长度（单位为英寸）
 *
 * @return {number}   像素密度
 */
function ppi(w, h, d) {
  return Math.sqrt(w ** 2 + h ** 2) / d;
}
