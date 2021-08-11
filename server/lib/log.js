function warn(...message) {
  // Yellow
  console.warn('\x1b[33m%s', getTimestamp(), '- WARN -', ...message, '\x1b[0m');
}

function error(...message) {
  // Red
  console.error('\x1b[31m%s', getTimestamp(), '- ERROR -', ...message, '\x1b[0m');
}

function info(...message) {
  // Blue
  console.info('\x1b[36m%s', getTimestamp(), '- INFO -', ...message, '\x1b[0m');
}

function log(...message) {
  console.log(getTimestamp(), '- LOG -', ...message);
}

function debug(...message) {
  // Magenta
  console.debug('\x1b[35m%s', getTimestamp(), '- DEBUG -', ...message, '\x1b[0m');
}
function getTimestamp() {
  return new Date().toISOString();
}

module.exports = {
  warn,
  error,
  info,
  log,
  debug,
};
