const _ = require('lodash');
const Card = require('../models/card.js');
const log = require('./../dev-logger.js');
const auth = require('./../auth-config/auth');

module.exports = function (app) {
  log('starting card routes');
  /* Create */
  app.post('/card', auth.required, (req, res) => {
    log('POST /card');
    const newCard = new Card(req.body);
    newCard.save((err, newCard) => err ? res.json({
      info: 'error during card create',
      error: err
    }) : res.status(200).json(newCard));
  });

  /* Read */
  app.get('/card', auth.required, (req, res) => {
    log('GET /card');
    Card.find((err, cards) => err ? res.json({
      info: 'error during find cards',
      error: err
    }) : res.status.json(cards));
  });

  app.get('/card/:id', auth.required, (req, res) => {
    log('GET /card/:id');
    Card.findById(req.params.id, (err, card) => (
      err ? res.json({
        info: 'error during find card',
        error: err
      }) : card ? res.status(200).json(card) : res.json({
        info: 'card not found'
      })
    ));
  });

  /* Update */
  app.put('/card/:id', auth.required, (req, res) => {
    log('PUT /card/:id');
    Card.replaceOne({
      _id: req.params.id
    }, req.body, (err) => err ? res.status(404).json({
      info: 'error during card update',
      error: err
    }) : res.status(200).json(req.body));
  });

  app.put('/cardAll', auth.required, (req, res) => {
    log('PUT /cardAll');
    // console.log(req.body);
    Card.find({
      boardId: req.body.boardId
    }, (error, cards) => {
      if (error) {
        res.status(404).json({
          info: 'Unable to find cards',
          error
        });
      }
      if (cards) {
        // log(req.body.cards);
        _.merge(cards, req.body.cards);

        Card.bulkWrite(cards.map(card => ({
          replaceOne: {
            filter: {
              _id: card._id
            },
            replacement: card,
          },
        })), (err) => err ? res.json({
          info: 'error during cards movement',
          error: err
        }) : res.status(200).json(cards));
      } else {
        res.status(404).json({
          info: 'Cards not found'
        });
      }
    });
  });

  /* Delete */
  app.delete('/card/:id', auth.required, (req, res) => {
    log('DELETE /card/:id');
    Card.findByIdAndRemove(req.params.id, (err) => err ? res.json({
      info: 'error during remove card',
      error: err
    }) : res.status(200).json(req.body.card));
  });
};