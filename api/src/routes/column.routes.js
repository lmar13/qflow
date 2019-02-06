const _ = require('lodash');
const Column = require('../models/column.js');
const Card = require('../models/card.js');
const log = require('./../dev-logger.js');
const auth = require('./../auth-config/auth');

module.exports = function (app) {
  log('starting column routes');

  /* Create */
  app.post('/column', auth.required, (req, res) => {
    log('POST /column');
    const newCard = new Column(req.body);
    newColumn.save((err, newColumn) => err ? res.json({
      info: 'error during column create',
      error: err
    }) : res.status(200).json(newColumn));
  });

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

  /* Update */
  app.put('/column/:id', auth.required, (req, res) => {
    log('PUT /column/:id');
    Column.replaceOne({
      _id: req.params.id
    }, req.body, (err) => err ? res.status(404).json({
      info: 'error during card update',
      error: err
    }) : res.status(200).json(req.body));
  });

  /* Delete */
  app.delete('/column/:id', auth.required, (req, res) => {
    log('DELETE /column/:id');
    Column.findByIdAndRemove(req.params.id, (err) => err ? res.json({
      info: 'error during remove card',
      error: err
    }) : res.status(200).json(req.body.column));
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