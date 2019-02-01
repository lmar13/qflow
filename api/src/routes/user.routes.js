var _ = require('lodash');
var User = require('../models/user.js');
const auth = require('./../auth-config/auth');

module.exports = function (app) {
  app.get('/users', auth.required, (req, res) => {
    User.find((err, users) => (
      err ? res.status(404).json({
        error: 'Cannot get users'
      }) : users ? res.status(200).json(users) : res.status(404).json({
        info: 'Cannot find any users'
      })
    ));
  });

  app.put('/users/:id', auth.required, (req, res) => {
    User.findById(req.params.id, (err, user) => {
      if (err) {
        return res.status(404).json({
          error: 'Cannot perform user update'
        });
      }
      if (user) {
        _.merge(user, req.body);

        user.save().then((err, user) => err ? res.status(404).json({
          errors: 'Error when saving user'
        }) : res.status(200).json(user));
      }
    });
  });
};