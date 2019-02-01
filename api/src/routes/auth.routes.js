const Token = require('../models/token.js');
const log = require('./../dev-logger.js');
const passport = require('passport');
const auth = require('./../auth-config/auth');
const nodemailer = require('nodemailer');
const fs = require('fs');
const handlebars = require('handlebars');
const crypto = require('crypto');


const sendEmail = (data) => {

  const {
    req,
    res,
    token,
    user,
    confirm
  } = data;

  var transporter = nodemailer.createTransport({
    host: 'mailhub.tfn.com',
    port: 25,
    secure: false,
    tls: {
      rejectUnauthorized: false,
    },
  });

  var readHTMLFile = (path, callback) => {
    fs.readFile(path, {
      encoding: 'utf-8'
    }, (err, html) => {
      if (err) {
        throw err;
        callback(err);
      } else {
        callback(null, html);
      }
    });
  };

  readHTMLFile('./src/emails/email-template.html', (err, html) => {
    var template = handlebars.compile(html);
    var link = `${req.get('origin')}/auth/${confirm ? 'activation' : 'reset'}/${token.token}`;
    var replacements = {
      // title: confirm ? '<span style="margin-right: 30px;">WELCOME TO</span>' : '',
      logo: '<img src="cid:logo" width="70"/>',
      subtitle: confirm ? 'WELCOME! We hope you will have<br> an Awesome time!' : `Hello ${user.name} ${user.surname}!<br><br> We are sorry that You forgot Your password. We are here to help You!`,
      info: confirm ? 'We are very excited that you have joined us. Just one click away from activating your account.' : 'Please click button below to reset password. In the next step You will be asked to provide new one.',
      link,
    };
    var htmlToSend = template(replacements);

    var mailOptions = {
      from: 'TLA-no-replay@thomsonreuters.com',
      to: 'lukasz.marciniak@thomsonreuters.com',
      // to: req.body.email,
      subject: confirm ? 'Account activation' : 'Password reset', // Subject line
      text: confirm ? `Hello,\n\n' + 'Please verify your account by clicking the link: \n${link}.\n` : `Please click link below below to reset password. In the next step You will be asked to provide new one \n\n${link}`, // plain text body
      html: htmlToSend, // html body
      attachments: [{
          filename: 'qflow_blue.png',
          path: './src/assets/logo/qflow_blue.png',
          cid: 'logo',
        },
        {
          filename: 'bg_email_min.png',
          path: './src/assets/bg_email_min.png',
          cid: 'bg_email',
        }
      ],
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        // htmlstream.close();
        return res.status(500).json({
          info: 'Something went wrong',
          err
        });
      }
      res.status(200).json({
        info: 'An email has been sent to ' + user.email,
        token
      });
    });
  });
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
    }, function (err, user) {
      if (err) {
        return res.status(404).json({
          info: 'Cannot check if user exists'
        });
      }
      if (user.length <= 0) {
        const finalUser = new User(newUser);
        finalUser.setPassword(newUser.password);
        finalUser.save().then(() => {
          res.status(200).json(finalUser.toAuthJSON());

          var token = new Token({
            _userId: finalUser._id
          });
          token.generateToken();

          token.save().then((err) => {
            if (err) {
              return res.status(500).send({
                msg: err.message
              });
            }
            sendEmail({
              req,
              res,
              token,
              user: finalUser,
              confirm: true,
            });
          });
        });
      } else {
        return res.status(404).json({
          info: 'The email address you have entered is already associated with another account.'
        });
      }
    });
  });

  app.post('/confirmation/:token', auth.optional, (req, res) => {
    Token.findOne({
      token: req.params.token
    }, function (err, token) {
      if (err || !token) {
        res.status(400).json({
          info: 'We were unable to find a valid token. Your token my have expired.',
          errors: err
        });
      }
      if (token) {
        User.findOne({
          _id: token._userId
        }, function (err, user) {
          if (!user) return res.status(400).json({
            info: 'We were unable to find a user for this token.'
          });
          if (user.isVerified) return res.status(400).json({
            info: 'This user has already been verified.'
          });

          user.isVerified = true;
          user.save(function (err) {
            if (err) {
              return res.status(500).json({
                info: 'Unable to activate user',
                errors: err
              });
            }
            return res.status(200).json({
              info: 'Account succesfully activated'
            });
          });
        });
      }
    });
  });

  app.post('/resend', auth.optional, (req, res) => {
    User.findOne({
      email: req.body.email
    }, function (err, user) {
      if (!user) return res.status(400).json({
        msg: 'We were unable to find a user with that email.'
      });
      if (user.isVerified) return res.status(400).json({
        msg: 'This account has already been verified. Please log in.'
      });

      // Create a verification token, save it, and send email
      var token = new Token({
        _userId: user._id
      });
      token.generateToken();

      // Save the token
      token.save(function (err) {
        if (err) {
          return res.status(500).json({
            msg: err.message
          });
        }
        sendEmail({
          req,
          res,
          user,
          token,
          confirm: true,
        });
      });

    });
  });

  app.post('/forgot', auth.optional, (req, res) => {
    User.findOne({
      email: req.body.email
    }, function (err, user) {
      if (!user) return res.status(400).json({
        msg: 'We were unable to find a user with that email.'
      });
      const token = crypto.randomBytes(16).toString('hex');
      // user.resetPasswordToken = token;
      // user.resetPasswordExpires = Date.now() + 3600000;

      user.save(function (err, user) {
        if (err) return res.status(500).json({
          errors: 'Unable to save user'
        });
        sendEmail({
          req,
          res,
          user,
          token: {
            token
          },
          confirm: false,
        });
      });

    });
  });

  app.post('/reset/:token', auth.optional, (req, res) => {
    User.findOne({
      resetPasswordToken: req.params.token
    }, function (err, user) {
      if (!user) {
        return res.status(400).json({
          error: 'Password reset token is invalid or has expired.'
        });
      }

      user.setPassword(req.body.pass);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      user.save(function (err) {
        if (err) return res.status(500).json({
          errors: 'Unable to change password'
        });
        return res.status(200).json({
          info: 'Password changed successfully'
        });
      });
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
    req.session.destroy(function (err) {
      if (err) {
        log(err);
      }
      res.end();
    });
  });
}