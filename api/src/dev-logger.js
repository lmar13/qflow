module.exports = function log(){
  if (process.env.LOG_ON || process.env.NODE_ENV !== 'production'){
    for (var o in arguments){
      console.log(arguments[o]);  
    }
  }
};