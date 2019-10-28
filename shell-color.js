/**
 * Node.js shell color
 */
const YELLOW = '\x1b[1;33m';
const GREEN = '\x1b[0;32m';
const GRAY = '\x1b[0;37m';
const UNDERLINED = '\x1b[4m';
const BOLD = '\x1b[1m';
const ITALIC = '\x1b[3m';
const EOS = '\x1b[0m';

// example
console.info(`${BOLD}${ITALIC}
  gallery-server@${packageJson.version}
  github: https://github.com/legend80s/gallery-server
  ${EOS}
`);
