const log = require('./lib/log');
const { initHttp } = require('./lib/http');
const { readConfig } = require('./lib/serverConfig');

(async () => {
  try {
    await readConfig();
  } catch (error) {
    log.error(error);
    process.exit(1);
  }
  initHttp();
})();
