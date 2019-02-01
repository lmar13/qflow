const { loggerconsoleLoggerOn, nodeEnv } = require('./config');

module.exports = function log(){
  if ( loggerconsoleLoggerOn || nodeEnv !== 'production'){
    for (var o in arguments){
      console.log(arguments[o]);  
    }
  }
};