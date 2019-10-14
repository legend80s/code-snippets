/**
 * @fileoverview 通用 utils，作为 js 语言的补充
 */

type IJSONObject = Record<string, any>;

/**
 * 获取对象中 key 对应的字符串 value，并将 value `JSON.parse`
 *
 * @param target
 * @param key
 * @returns 返回 JSON.parse 后的值。若 JSON parse 报错，则返回空对象
 */
export function getStringData<T extends IJSONObject, K extends keyof T>(target: T, key: K): IJSONObject {
  if (!target || !target[key]) {
    return {};
  }

  try {
    return JSON.parse(target[key]);
  } catch (error) {
    console.error('getStringData JSON.parse', target[key], 'error:', error);

    return {};
  }
}

/**
 * 访问嵌套对象，避免代码中出现类似 user && user.personalInfo ? user.personalInfo.name : '' 的代码
 */
export default function get<T>(object: any, path: Array<number | string>, defaultValue?: T) : T {
  const result = path.reduce((obj, key) => obj !== undefined ? obj[key] : undefined, object);

  return result !== undefined ? result : defaultValue;
}
