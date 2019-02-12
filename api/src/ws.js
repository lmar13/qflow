'use strict';

const log = require('./dev-logger.js');

module.exports = function (server, origins) {
  log('Running socket.io server');
  const io = require('socket.io').listen(server);

  if (origins) {
    io.set('origins', '*:*');
  }

  io.on('connection', (socket) => {
    log('connected');

    socket.on('joinBoard', (boardId) => {
      log('joined board: ' + boardId);
      socket.join(boardId);
    });

    socket.on('leaveBoard', (boardId) => {
      log('left board: ' + boardId);
      socket.leave(boardId);
    });

    socket.on('addCard', ({
      boardId,
      card
    }) => {
      log('addCard: ', {
        boardId,
        card
      });
      socket.broadcast.to(boardId)
        .emit('addCard', card);
    });

    socket.on('updateCard', ({
      boardId,
      cards
    }) => {
      log('updateCard: ', {
        boardId,
        cards
      });
      socket.broadcast.to(boardId)
        .emit('updateCard', cards);
    });

    socket.on('updateSubcard', ({
      boardId,
      cards
    }) => {
      log('updateSubcard: ', {
        boardId,
        cards
      });
      socket.broadcast.to(boardId)
        .emit('updateSubcard', cards);
    });

    socket.on('editCard', ({
      boardId,
      card
    }) => {
      log('editCard: ', {
        boardId,
        card
      });
      socket.broadcast.to(boardId)
        .emit('editCard', card);
    });

    socket.on('deleteCard', ({
      boardId,
      card
    }) => {
      log('deleteCard: ', {
        boardId,
        card
      });
      socket.broadcast.to(boardId)
        .emit('deleteCard', card);
    });

    socket.on('disconnect', () => log('disconnecting'));
  });
};