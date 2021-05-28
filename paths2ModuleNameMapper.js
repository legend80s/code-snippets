/**
 * paths: { "@/*": ["./src/*"], }
 * to
 * moduleNameMapper: { '^@/(.*)': ['<rootDir>/src/$1'], },
 * @param {Record<string, string[]>} paths
 */
exports.paths2ModuleNameMapper = (paths) => {
  return Object.keys(paths).reduce((acc, key) => {
    const values = paths[key];

    return {
      ...acc,

      [`^${key.replace(/\*/, "(.*)")}`]: values.map(value =>
        join(`<rootDir>/${value.replace(/\*/, "$1")}`)
      )
    }
  }, {});
}
