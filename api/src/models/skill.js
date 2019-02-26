'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const skillSchema = mongoose.Schema({
  name: String,
  type: String,
  category: String,
});

module.exports = mongoose.model('Skill', skillSchema);