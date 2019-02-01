'use strict';

const mongoose = require('mongoose');
const crypto = require('crypto');
mongoose.Promise = global.Promise;

const tokenSchema = mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 43200
  },
});

tokenSchema.methods.generateToken = function () {
  this.token = crypto.randomBytes(16).toString('hex');
};

module.exports = mongoose.model('Token', tokenSchema);