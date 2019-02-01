const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
mongoose.Promise = global.Promise;


const userSchema = mongoose.Schema({
  name: String,
  surname: String,
  email: String,
  empId: Number,
  role: String,
  hash: String,
  salt: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isVerified: {
    type: Boolean,
    default: false
  },
});

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

userSchema.methods.validatePassword = function (password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJWT = function () {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    _id: this._id,
    name: this.name,
    surname: this.surname,
    email: this.email,
    empId: this.empId,
    role: this.role,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
};

userSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    email: this.email,
    empId: this.empId,
    token: this.generateJWT(),
  };
};

module.exports = mongoose.model('User', userSchema);