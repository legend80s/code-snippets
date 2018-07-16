/* eslint-disable no-console */
const colors = require('colors');

colors.setTheme({
  info: 'green',
  prompt: 'white',
});

function LogPlugin() {}

LogPlugin.prototype.apply = function apply(compiler) {
  let bundleStart = null;
  let bundleStop = null;

  compiler.plugin('compile', () => {
    bundleStart = new Date();
    const startMsg = '\nBundle start at: '.prompt + bundleStart.toLocaleString().info;
    console.log(startMsg);
  });

  compiler.plugin('done', () => {
    bundleStop = new Date();
    const stopMsg = '\nBundle stop  at: '.prompt + bundleStop.toLocaleString().info;
    console.log(stopMsg);
  });
};

module.exports = LogPlugin;
