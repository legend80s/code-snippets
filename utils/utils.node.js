/**
 * Find all the files in the target folder recursively.
 * @param {string} folder directory
 * @returns {string[]} file paths
 */
function findAllFiles(folder) {
  return fs.readdirSync(folder).reduce((acc, cur) => {
    // console.log('folder', folder, 'cur:', cur);
    const filePath = path.join(folder, cur);

    if (fs.statSync(filePath).isFile()) {
      acc.push(filePath);
    } else {
      acc.push(...findAllFiles(filePath));
    }

    return acc;
  }, []);
}
