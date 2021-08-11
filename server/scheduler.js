const schedule = require('node-schedule');
const { setBrightness, setDuration } = require('./lightConfig');
let jobs = [];

function scheduleJobs(config) {
  for (const job of jobs) {
    job.cancel();
  }
  jobs = [];

  config.weekConfigs.map((weekConfig) => {
    const weekdays = Object.values(weekConfig.days).reduce((acc, isActive, i) => {
      if (isActive) {
        // dayOfWeek (0-6) Starting with Sunday
        if (i === 0) {
          acc.push(6);
        }
        acc.push(i - 1);
      }
      return acc;
    }, []);
    for (const trigger of Object.values(weekConfig.triggers)) {
      const rule = new schedule.RecurrenceRule();
      const [hour, minute] = trigger.time.split(':');
      rule.minute = minute;
      rule.hour = hour;
      rule.dayOfWeek = weekdays;
      const job = schedule.scheduleJob(rule, function () {
        setBrightness(trigger.brightness);
        if (trigger.duration > 0) {
          setDuration(trigger.duration);
        } else {
          setDuration(config.defaultDuration);
        }
      });
      jobs.push(job);
    }
  });
}

module.exports = { scheduleJobs };
