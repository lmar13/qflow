const {
  consoleLoggerOn,
  nodeEnv
} = require('./../config/env.config');

module.exports = function log() {
  if (consoleLoggerOn || nodeEnv !== 'production') {
    for (let o in arguments) {
      console.log(arguments[o]);
    }
  }
};