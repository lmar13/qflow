const {
  consoleLoggerOn,
  nodeEnv
} = require('./config');

module.exports = function log() {
  if (consoleLoggerOn || nodeEnv !== 'production') {
    for (let o in arguments) {
      console.log(arguments[o]);
    }
  }
};