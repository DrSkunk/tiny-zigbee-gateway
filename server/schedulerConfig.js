const fs = require('fs/promises');
const constants = require('fs');
const path = require('path');
const { scheduleJobs } = require('./scheduler');
const { broadcastConfig } = require('./mqtt');

const defaultConfig = {
  defaultDuration: 120,
  weekConfigs: [
    {
      days: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true,
      },
      triggers: [
        {
          time: '07:00',
          brightness: 255,
          duration: 0,
        },
        {
          time: '22:00',
          brightness: 1,
          duration: 0,
        },
      ],
    },
  ],
};

async function initConfig() {
  try {
    const x = await fs.access(getConfigPath(), constants.R_OK);
    await getConfig();
  } catch (error) {
    await fs.writeFile(getConfigPath(), JSON.stringify(defaultConfig, null, 2));
  }
}

function getConfigPath() {
  return path.join(__dirname, 'schedulerConfig.json');
}

async function getConfig() {
  return JSON.parse(await fs.readFile(getConfigPath(), 'utf8'));
}

async function updateConfig(config) {
  // TODO validate config
  fs.writeFile(getConfigPath(), JSON.stringify(config, null, 2), 'utf8');
  broadcastConfig(config);
  scheduleJobs(config);
}

module.exports = {
  initConfig,
  getConfigPath,
  getConfig,
  updateConfig,
};
