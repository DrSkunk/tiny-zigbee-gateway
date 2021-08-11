const express = require('express');
const path = require('path');
const {
  getConfigPath,
  updateConfig,
  initSchedulerConfig,
  getConfig,
} = require('./schedulerConfig');
const { scheduleJobs } = require('./scheduler');
const { initMqtt } = require('./mqtt');
const log = require('./log');
const { getServerConfig } = require('./serverConfig');

let app = null;

function initHttp() {
  console.log('serverConfig', getServerConfig());

  if (app) {
    throw new Error('HTTP server already initialized');
  }
  app = express();

  app.use(function (_, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  app.use(express.json());
  app.use(express.static(path.resolve(process.cwd(), '../webclient/out')));

  app.get('/api/config', (_, res) => {
    log.log('Fetching config');

    res.header('Content-Type', 'application/json');
    res.sendFile(getConfigPath());
  });

  app.post('/api/config', async (req, res) => {
    log.log(`received new config: ${JSON.stringify(req.body)}`);
    try {
      await updateConfig(req.body);
      return res.sendStatus(200);
    } catch (err) {
      log.error(err);
      return res.sendStatus(500);
    }
  });

  app.listen(getServerConfig().port, async () => {
    log.info(`Webserver listening at http://localhost:${getServerConfig().port}`);
    initMqtt();
    await initSchedulerConfig();
    const config = await getConfig();
    scheduleJobs(config);
  });
}

module.exports = {
  initHttp,
};
