const fs = require('fs/promises');
const path = require('path');
const log = require('./log');

let serverConfig = {};

async function readConfig() {
  serverConfig = JSON.parse(
    await fs.readFile(path.join(process.cwd(), 'serverConfig.json'), 'utf8')
  );
  const hasAllProperties = [
    'port',
    'mqttUrl',
    'presenceTopics',
    'lightTopics',
    'configTopic',
  ].every((key) => serverConfig.hasOwnProperty(key));
  if (!hasAllProperties) {
    throw new Error('Missing properties in serverConfig.json. Check serverConfig.example.json');
  }
  log.info('Config loaded:', JSON.stringify(serverConfig, null, 2));
}

function getServerConfig() {
  return serverConfig;
}

module.exports = {
  readConfig,
  getServerConfig,
};
