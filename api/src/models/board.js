var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

console.log('inializing Schema');
var boardSchema = mongoose.Schema({
    title: String,
    owner: {
      _id: String,
      email: String,
    },
    startDate: Date,
    endDate: Date,
    assignedUsers: [{
      value: String,
      display: String,
      readonly: Boolean,
    }]
});

console.log('exporting Schema');
module.exports = mongoose.model('Board', boardSchema);
console.log('exported Schema');
