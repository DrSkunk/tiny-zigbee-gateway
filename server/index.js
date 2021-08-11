const express = require('express');
const path = require('path');
const { getConfigPath, updateConfig, initConfig, getConfig } = require('./schedulerConfig');
const { scheduleJobs } = require('./scheduler');
const { initMqtt } = require('./mqtt');
const app = express();
const port = 8080;

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(express.json());
app.use(express.static(path.resolve(process.cwd(), '../next-webclient/out')));

app.get('/api/config', (req, res) => {
  res.header('Content-Type', 'application/json');
  res.sendFile(getConfigPath());
});

app.post('/api/config', async (req, res) => {
  try {
    await updateConfig(req.body);
    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

app.listen(port, async () => {
  console.log(`Example app listening at http://localhost:${port}`);
  initMqtt();
  await initConfig();
  const config = await getConfig();
  scheduleJobs(config);
});
