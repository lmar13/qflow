const Token = require('../models/token.js');
const log = require('./../dev-logger.js');
const passport = require('passport');
const auth = require('./../auth-config/auth');
const crypto = require('crypto');
const User = require('../models/user.js');


const sendEmail = (data) => {
  const sendEmail = require('./../emails/sendEmail')(data);
};


module.exports = function (app) {
  app.post('/signup', auth.optional, (req, res, next) => {
    const {
      email,
      empId,
      name,
      surname
    } = req.body;
    const password = req.body.passwords.pass;

    newUser = {
      email,
      empId,
      name,
      surname,
      password,
      role: 'user',
    };

    log(newUser.email);
    if (!newUser.email) {
      return res.status(422).json({
        errors: {
          email: 'is required',
        },
      });
    }

    if (!newUser.password) {
      return res.status(422).json({
        errors: {
          password: 'is required',
        },
      });
    }

    if (!newUser.empId) {
      return res.status(422).json({
        errors: {
          empId: 'is required',
        },
      });
    }


    User.find({
      email: newUser.email
    }, (err, user) => {
      if (err) {
        return res.status(400).json({
          info: 'Cannot check if user exists'
        });
      }
      if (user.length <= 0) {
        const finalUser = new User(newUser);
        finalUser.setPassword(newUser.password);
        finalUser.save().then(() => {
          res.status(200).json(finalUser.toAuthJSON());

          const token = new Token({
            _userId: finalUser._id
          });
          token.generateToken();

          token.save((err) => err ? res.status(500).send({
            msg: err.message
          }) : sendEmail({
            req,
            res,
            token,
            user: finalUser,
            confirm: true,
          }));
        });
      } else {
        return res.status(400).json({
          info: 'The email address you have entered is already associated with another account.'
        });
      }
    });
  });

  app.post('/confirmation/:token', auth.optional, (req, res) => {
    Token.findOne({
      token: req.params.token
    }, (err, token) => {
      if (err || !token) {
        return res.status(404).json({
          info: 'We were unable to find a valid token. Your token my have expired.',
          errors: err
        });
      }
      if (token) {
        User.findOne({
          _id: token._userId
        }, (err, user) => {
          if (!user) return res.status(400).json({
            info: 'We were unable to find a user for this token.'
          });
          if (user.isVerified) return res.status(400).json({
            info: 'This user has already been verified.'
          });

          user.isVerified = true;
          user.save((err) => err ? res.status(500).json({
            info: 'Unable to activate user',
            errors: err
          }) : res.status(200).json({
            info: 'Account succesfully activated'
          }));
        });
      }
    });
  });

  app.post('/resend', auth.optional, (req, res) => {
    User.findOne({
      email: req.body.email
    }, (err, user) => {
      if (!user) return res.status(400).json({
        info: 'We were unable to find a user with that email.'
      });
      if (user.isVerified) return res.status(400).json({
        info: 'This account has already been verified. Please log in.'
      });

      // Create a verification token, save it, and send email
      const token = new Token({
        _userId: user._id
      });
      token.generateToken();

      // Save the token
      token.save((err) => err ? res.status(500).json({
        msg: err.message
      }) : sendEmail({
        req,
        res,
        user,
        token,
        confirm: true,
      }));
    });
  });

  app.post('/forgot', auth.optional, (req, res) => {
    User.findOne({
      email: req.body.email
    }, (err, user) => {
      if (!user) return res.status(400).json({
        info: 'We were unable to find a user with that email.'
      });
      const token = crypto.randomBytes(16).toString('hex');
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000;

      user.save((err, user) => err ? res.status(400).json({
        errors: 'Unable to save user',
        err
      }) : sendEmail({
        req,
        res,
        user,
        token: {
          token
        },
        confirm: false,
      }));
    });
  });

  app.post('/reset/:token', auth.optional, (req, res) => {
    User.findOne({
      resetPasswordToken: req.params.token
    }, (err, user) => {
      if (!user) {
        return res.status(400).json({
          error: 'Password reset token is invalid or has expired.'
        });
      }

      user.setPassword(req.body.pass);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      user.save((err) => err ? res.status(500).json({
        errors: 'Unable to change password'
      }) : res.status(200).json({
        info: 'Password changed successfully'
      }));
    });
  });

  app.post('/login', auth.optional, (req, res, next) => {
    const {
      user
    } = req.body;

    if (!user.email) {
      return res.status(422).json({
        errors: {
          email: 'is required',
        },
      });
    }

    if (!user.password) {
      return res.status(422).json({
        errors: {
          password: 'is required',
        },
      });
    }

    return passport.authenticate('local', {
      session: false
    }, (err, passportUser, info) => {
      if (err) {
        return next(err);
      }

      if (passportUser) {
        const user = passportUser;

        if (!user.isVerified) {
          return res.status(400).json({
            info: 'You need to activate account to LogIn'
          });
        }

        user.token = passportUser.generateJWT();
        return res.json(user.toAuthJSON());
      }

      return res.status(400).json(info);

    })(req, res, next);
  });

  app.post('/logout', auth.optional, (req, res) => {
    req.session.destroy((err) => err ? log(err) : res.end());
  });
}