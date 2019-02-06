const _ = require('lodash');
const Subcard = require('../models/subcards');
const log = require('./../dev-logger.js');
const auth = require('./../auth-config/auth');

module.exports = function (app) {
    log('starting card routes');
    /* Create */
    app.post('/subcard', auth.required, (req, res) => {
        log('POST /subcard');
        const newCard = new Subcard(req.body);
        newCard.save((err, newCard) => err ? res.json({
            info: 'error during card create',
            error: err
        }) : res.status(200).json(newCard));
    });

    /* Read */
    app.get('/subcard', auth.required, (req, res) => {
        log('GET /subcard');
        Subcard.find((err, subcards) => err ? res.json({
            info: 'error during find cards',
            error: err
        }) : res.status(200).json(subcards));
    });

    app.get('/subcard/:id', auth.required, (req, res) => {
        log('GET /subcard/:id');
        Subcard.findById(req.params.id, (err, subcard) => (
            err ? res.json({
                info: 'error during find card',
                error: err
            }) : subcard ? res.status(200).json(subcard) : res.json({
                info: 'card not found'
            })
        ));
    });

    /* Update */
    app.put('/subcard/:id', auth.required, (req, res) => {
        log('PUT /subcard/:id');
        Subcard.replaceOne({
            _id: req.params.id
        }, req.body, (err) => err ? res.status(404).json({
            info: 'error during card update',
            error: err
        }) : res.status(200).json(req.body));
    });

    app.put('/subcardAll', auth.required, (req, res) => {
        log('PUT /subcardAll');
        // console.log(req.body);
        Subcard.find({
            boardId: req.body.boardId
        }, (error, subcards) => {
            if (error) {
                res.status(404).json({
                    info: 'Unable to find subcards',
                    error
                });
            }
            if (subcards) {
                // log(req.body.cards);
                _.merge(cards, req.body.subcards);

                Subcard.bulkWrite(subcards.map(subcard => ({
                    replaceOne: {
                        filter: {
                            _id: subcard._id
                        },
                        replacement: subcard,
                    },
                })), (err) => err ? res.json({
                    info: 'error during subcards movement',
                    error: err
                }) : res.status(200).json(subcards));
            } else {
                res.status(404).json({
                    info: 'Subcards not found'
                });
            }
        });
    });

    /* Delete */
    app.delete('/subcard/:id', auth.required, (req, res) => {
        log('DELETE /subcard/:id');
        Subcard.findByIdAndRemove(req.params.id, (err) => err ? res.json({
            info: 'error during remove card',
            error: err
        }) : res.status(200).json(req.body.subcard));
    });
};