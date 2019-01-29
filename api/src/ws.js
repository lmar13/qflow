var log = require('./dev-logger.js');

module.exports = function(server, origins) {
    log("Running socket.io server");
    var io = require('socket.io').listen(server);

    if (origins) {
        io.set("origins", "*:*");
    }

    io.on('connection', function(socket) {
        log('connected');

        socket.on('joinBoard', function(boardId) {
            log('joined board: ' + boardId);
            socket.join(boardId);
        });

        socket.on('leaveBoard', function(boardId) {
            log('left board: ' + boardId);
            socket.leave(boardId);
        });

        socket.on('addCard', function({ boardId, card }) {
            log('addCard: ', { boardId, card });
            socket.broadcast.to(boardId)
                .emit('addCard', card);
        });

        socket.on('updateCard', function({ boardId, cards }) {
            log('updateCard: ', { boardId, cards });
            socket.broadcast.to(boardId)
              .emit('updateCard', cards);
        });

        socket.on('editCard', function({ boardId, card }) {
            log('editCard: ', { boardId, card });
            socket.broadcast.to(boardId)
              .emit('editCard', card);
        });

        socket.on('deleteCard', function({ boardId, card }) {
          log('deleteCard: ', { boardId, card });
          socket.broadcast.to(boardId)
            .emit('deleteCard', card);
      })

        socket.on('disconnect', function() {
            log('disconnecting');
        });
    });
};
