/**
 * 将字符串按照每行长度分割为多行
 *
 * @param  {string} longText 被分割的字符串
 * @param  {number} lengthPerLine 每行长度
 * @param  {string} [lineBreaker=\n] 分行符，比如 '\n', '<br />'

 * @return {string} 分行符分割的字符串
 */
function lines(longText, lengthPerLine, lineBreaker = '\n') => {
  let result = longText;

  if (lengthPerLine > 1) {
    result = (longText.match(new RegExp(`.{1,${lengthPerLine}}`, 'g')) || []).join(lineBreaker);
  }

  return result;
}
