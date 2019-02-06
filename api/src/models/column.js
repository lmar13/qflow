const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const columnSchema = mongoose.Schema({
  title: String,
  boardId: String,
});

module.exports = mongoose.model('Column', columnSchema);