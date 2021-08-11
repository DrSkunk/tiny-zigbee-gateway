let lightConfig = {
  brightness: 255,
  duration: 120,
};

function setBrightness(brightness) {
  lightConfig.brightness = brightness;
}

function setDuration(duration) {
  lightConfig.duration = duration;
}

module.exports = {
  lightConfig,
  setBrightness,
  setDuration,
};
