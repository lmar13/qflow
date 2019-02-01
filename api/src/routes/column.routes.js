var _ = require('lodash');
var Column = require('../models/column.js');
var Card = require('../models/card.js');
var log = require('./../dev-logger.js');
var auth = require('./../auth-config/auth');

module.exports = function (app) {
  log('starting column routes');

  /* Read */
  app.get('/column', auth.required, (req, res) => {
    log('GET /column');
    Column.find((err, columns) => err ? res.json({
      info: 'error during find columns',
      error: err
    }) : res.json(columns));
  });

  app.get('/column/:id', auth.required, (req, res) => {
    log('GET /column/:id');
    Column.findById(req.params.id, (err, column) => (
      err ? res.json({
        info: 'error during find column',
        error: err
      }) : column ? res.json(columns) : res.json({
        info: 'column not found'
      })
    ));
  });

  // Read card for specific board and sign it to correct columns
  app.get('/column/:id/cards', auth.required, (req, res) => {
    log('GET /column/:id');
    Column.findById(req.params.id, (err, column) => (
      err ? res.json({
        info: 'error during find column',
        error: err
      }) : column ? Card.find({
        columnId: req.params.id
      }).sort({
        order: 1
      }).exec((err, cards) => {
        res.json({
          info: 'Cards found successfully',
          data: cards
        });
      }) : res.json({
        info: 'column not found'
      })
    ));
  });
};