var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var columnSchema = mongoose.Schema({
  title: String,
});

module.exports = mongoose.model('Column', columnSchema);
