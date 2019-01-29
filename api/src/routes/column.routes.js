var _ = require('lodash');
var Column = require('../models/column.js');
var Card = require('../models/card.js');
var log = require('./../dev-logger.js');
var auth = require('../routes/auth.routes.js');

module.exports = function(app) {
    log('starting column routes');

    /* Read */
    app.get('/column', auth.required, function (req, res) {
        log('GET /column');
        Column.find(function(err, columns) {
            if (err) {
                res.json({info: 'error during find columns', error: err});
            };
            // res.json({info: 'columns found successfully', data: columns});
            res.json(columns);
        });
    });

    app.get('/column/:id', auth.required, function (req, res) {
        log('GET /column/:id');
        Column.findById(req.params.id, function(err, column) {
            if (err) {
                res.json({info: 'error during find column', error: err});
            };
            if (column) {
                // res.json({info: 'column found successfully', data: column});
                res.json(columns);
            } else {
                res.json({info: 'column not found'});
            }
        });
    });

    // Read card for specific board and sign it to correct columns
    app.get('/column/:id/cards', auth.required, function (req, res) {
        log('GET /column/:id');
        Column.findById(req.params.id, function(err, column) {
            if (err) {
                res.json({info: 'error during find column', error: err});
            };
            if (column) {
                Card.find({ columnId: req.params.id }).sort({order: 1}).exec(function (err, cards){
                    res.json({info: 'Cards found successfully', data: cards});
                });
            } else {
                res.json({info: 'column not found'});
            }
        });
    });
};
