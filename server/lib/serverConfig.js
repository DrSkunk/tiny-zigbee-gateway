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
  ].every((key) => Object.prototype.hasOwnProperty.call(serverConfig, key));
  if (!hasAllProperties) {
    throw new Error('Missing properties in serverConfig.json. Check serverConfig.example.json.');
  }
  if (serverConfig.presenceTopics.length === 0) {
    throw new Error('There must be at least one presence topic configured, value is an array.');
  }
  if (serverConfig.lightTopics.length === 0) {
    throw new Error('There must be at least one light topic configured, value is an array.');
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
