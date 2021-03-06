'use strict';

const Board = require('../models/board.js');
const Column = require('../models/column.js')
const Card = require('../models/card.js');
const Subcard = require('../models/subcards.js');
const log = require('./../dev-logger.js');
const auth = require('./../auth-config/auth');

module.exports = function (app) {
  log('starting board routes');
  /* Create */
  app.post('/board', auth.required, (req, res) => {
    log('POST /board', req.body);
    const newBoard = new Board(req.body);
    newBoard.save((err, newBoard) => err ? res.json({
      info: 'error during board create',
      error: err
    }) : res.json(newBoard));
  });

  /* Read */
  app.get('/boards', auth.required, (req, res) => {
    log('GET /board');
    Board.find((err, boards) => err ? res.json({
      info: 'error during find boards',
      error: err
    }) : res.json(boards));
  });

  app.get('/boardsForUser/:id', auth.required, (req, res) => {
    log('GET /boardsForUser/:id', req.params.id);
    Board.find({
      'assignedUsers.value': req.params.id
    }, (err, boards) => (
      err ? res.status(404).json({
        info: 'error during find boards',
        error: err
      }) : boards ? res.json(boards) : res.json({
        info: 'boards not found'
      })
    ));
  });

  app.get('/board/:id', auth.required, (req, res) => {
    log('GET /board/:id', req.params.id);
    Board.findById(req.params.id, (err, board) => (
      err ? res.json({
        info: 'error during find board',
        error: err
      }) : board ? res.json(board) : res.json({
        info: 'board not found'
      })
    ));
  });

  app.get('/board/:id/cards', auth.required, (req, res) => {
    log('GET /board/:id/cards');
    Board.findById(req.params.id, (err, board) => (
      err ? res.json({
        info: 'error during find board',
        error: err
      }) : board ? Card
      .find({
        boardId: req.params.id,
        __t: {
          $ne: "subcard"
        }
      })
      .sort({
        order: 1
      })
      .exec((err, cards) => err ? res.status(400).json({
        info: 'error during find cards',
      }) : res.json(cards)) :
      res.json({
        info: 'board not found'
      })
    ));
  });

  app.get('/board/:boardId/card/:cardId/subcards', auth.required, (req, res) => {
    log('GET /board/:boardId/card/:cardId/subcards');
    log('boardId: ', req.params.boardId);
    log('cardId: ', req.params.cardId);
    Board.findById(req.params.boardId, (err, board) => (
      err ? res.json({
        info: 'error during find board',
        error: err
      }) : board ? Subcard
      .find({
        boardId: req.params.boardId,
        cardId: req.params.cardId
      })
      .sort({
        order: 1
      })
      .exec((err, cards) => err ? res.status(400).json({
        info: 'error during find cards',
      }) : res.json(cards)) :
      res.json({
        info: 'board not found'
      })
    ));
  });

  /* Update */
  app.put('/board/:id', auth.required, (req, res) => {
    log('PUT /board/:id', req.body);
    Board.replaceOne({
      _id: req.params.id
    }, req.body, (err) => err ? res.status(404).json({
      info: 'error during updating board',
      error: err
    }) : res.status(200).json(req.body));
  });

  /* Delete */
  app.delete('/board/:id', auth.required, (req, res) => {
    log('DELETE /board/:id');
    Board.findByIdAndRemove(req.params.id, (err) => err ? res.json({
      info: 'error during remove board',
      error: err
    }) : Column.deleteMany({
      boardId: req.params.id
    }, (err) => err ? res.json({
      info: 'error during remove columns',
      error: err
    }) : Card.deleteMany({
      boardId: req.params.id
    }, (err) => err ? res.json({
      info: 'error during remove cards',
      error: err
    }) : res.status(200).json({
      info: 'board removed successfully'
    }))))
  });
};