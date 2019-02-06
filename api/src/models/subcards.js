const mongoose = require('mongoose');
const Card = require('./card');
mongoose.Promise = global.Promise;

const Subcard = Card.discriminator('Subcard',
    mongoose.Schema({
        cardId: String
    }), 'subcard');

module.exports = Subcard;