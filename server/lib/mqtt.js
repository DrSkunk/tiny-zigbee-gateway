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

  client.on('message', function (topic, message) {
    log.log('Received message', topic, message.toString());
    const { occupance } = JSON.parse(message.toString());
    if (occupance) {
      turnOnLight();
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(turnOffLight, lightConfig.duration);
    }
  });
}

function turnOnLight() {
  getServerConfig().lightTopics.forEach((lightTopic) => {
    client.publish(lightTopic, JSON.stringify({ brightness: lightConfig.brightness }));
  });
}

function turnOffLight() {
  client.publish(lightTopic, JSON.stringify({ brightness: 0 }));
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
