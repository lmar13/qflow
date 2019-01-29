var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var cardSchema = mongoose.Schema({
    title: String,
    content: String,
    columnId: String,
    boardId: String,
    order: Number,
    owner: {
      _id: String,
      email: String,
    },
    assignedUsers: [{
      value: String,
      display: String,
      readonly: Boolean,
    }]
});

module.exports = mongoose.model('Card', cardSchema);
