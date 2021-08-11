const mqtt = require('mqtt');
const { lightConfig } = require('./lightConfig');

const presenceTopic = 'zigbee2mqtt/motion';
const lightTopic = 'zigbee2mqtt/0x000b57fffe8a3687/set';
const configTopic = 'scheduler/config';

let client;
let timer;
function initMqtt() {
  client = mqtt.connect('mqtt://192.168.0.182');

  client.on('connect', function () {
    console.log('MQTT connected');
    client.subscribe(presenceTopic, function (error) {
      if (error) {
        console.error(error);
      }
    });
    client.subscribe(configTopic, function (error) {
      if (error) {
        console.error(error);
      }
    });
  });

  client.on('message', function (topic, message) {
    const { occupance } = JSON.parse(message.toString());
    if (occupance) {
      turnOnLight();
    }
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(turnOffLight, lightConfig.duration);
  });
}

function turnOnLight() {
  client.publish(lightTopic, JSON.stringify({ brightness: lightConfig.brightness }));
}

function turnOffLight() {
  client.publish(lightTopic, JSON.stringify({ brightness: 0 }));
}

function broadcastConfig(config) {
  client.publish(configTopic, JSON.stringify(config), { retain: true });
}

module.exports = {
  initMqtt,
  turnOnLight,
  turnOffLight,
  broadcastConfig,
};
