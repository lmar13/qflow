'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

console.log('initializing Schema');
const boardSchema = mongoose.Schema({
  title: String,
  owner: {
    _id: String,
    email: String,
  },
  startDate: Date,
  endDate: Date,
  planDate: Date,
  dueDate: Date,
  assignedUsers: [{
    value: String,
    display: String,
    readonly: Boolean,
  }],
});

console.log('exporting Schema');
module.exports = mongoose.model('Board', boardSchema);
console.log('exported Schema');