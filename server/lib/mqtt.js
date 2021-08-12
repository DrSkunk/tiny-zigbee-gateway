const mqtt = require('mqtt');
const log = require('./log');
const { lightConfig } = require('./lightConfig');
const { getServerConfig } = require('./serverConfig');

let client;
let timer;

function initMqtt() {
  client = mqtt.connect(getServerConfig().mqttUrl);

  client.on('connect', function () {
    log.info('MQTT connected');
    getServerConfig().presenceTopics.forEach((presenceTopic) => {
      client.subscribe(presenceTopic, function (error) {
        if (error) {
          log.error(error);
        }
      });
    });
  });

  client.on('disconnect', log.warn);

  client.on('error', log.error);

  client.on('message', function (topic, message) {
    log.log('Received message', topic, message.toString());
    const { occupancy } = JSON.parse(message.toString());
    log.info('occupancy', occupancy);
    if (occupancy) {
      if (lightConfig.brightness === 0) {
        log.info(`Brightness is set to 0, not turning on.`);
        return;
      }
      turnOnLight();
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(turnOffLight, lightConfig.duration * 1000);
    }
  });
}

function turnOnLight() {
  log.info(
    `Turning on light with brightess ${lightConfig.brightness} for ${lightConfig.duration} seconds`
  );
  getServerConfig().lightTopics.forEach((lightTopic) => {
    client.publish(lightTopic, JSON.stringify({ brightness: lightConfig.brightness }));
  });
}

function turnOffLight() {
  log.info('Turning off light');
  getServerConfig().lightTopics.forEach((lightTopic) => {
    client.publish(lightTopic, JSON.stringify({ brightness: 0 }));
  });
}

function broadcastConfig(config) {
  client.publish(getServerConfig().configTopic, JSON.stringify(config), { retain: true });
}

module.exports = {
  initMqtt,
  turnOnLight,
  turnOffLight,
  broadcastConfig,
};
