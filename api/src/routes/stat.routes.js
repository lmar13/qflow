const _ = require('lodash');
const Board = require('./../models/board');
const Card = require('./../models/card');
const log = require('./../dev-logger');
const auth = require('./../auth-config/auth');
const {
    getStatsForProjectsAndCards,
    getStatsForUsersProjectsAndCards,
    summaryForAll,
    summaryForUsers
} = require('../utils/mainStat');
const {
    weekMatch,
    weekMatchForUsers,
    weekGroup,
    weekArray,
} = require('../utils/weekStat');
const {
    monthMatch,
    monthMatchForUsers,
    monthGroup,
    monthArray
} = require('../utils/monthStat');
const {
    yearMatch,
    yearMatchForUsers,
    yearGroup,
    yearArray
} = require('../utils/yearStat');


module.exports = (app) => {
    app.get('/stat/week', auth.required, (req, res) => {
        log('GET /stat/week');

        getStatsForProjectsAndCards(res, weekMatch, weekGroup, weekArray);
    });

    app.get('/stat/month', auth.required, (req, res) => {
        log('GET /stat/month');

        getStatsForProjectsAndCards(res, monthMatch, monthGroup, monthArray);
    });

    app.get('/stat/year', auth.required, (req, res) => {
        log('GET /stat/year');

        getStatsForProjectsAndCards(res, yearMatch, yearGroup, yearArray);
    });

    app.get('/stat/summary', auth.required, (req, res) => {
        log('GET /stat/summary');
        summaryForAll(res)
    });

    // For users

    app.post('/stat/week', auth.required, (req, res) => {
        log('GET /stat/week');

        getStatsForUsersProjectsAndCards(res, req.body, weekMatchForUsers, weekGroup, weekArray);
    });

    app.post('/stat/month', auth.required, (req, res) => {
        log('GET /stat/month');

        getStatsForUsersProjectsAndCards(res, req.body, monthMatchForUsers, monthGroup, monthArray);
    });

    app.post('/stat/year', auth.required, (req, res) => {
        log('GET /stat/year');

        getStatsForUsersProjectsAndCards(res, req.body, yearMatchForUsers, yearGroup, yearArray);
    });

    app.post('/stat/summary', auth.required, (req, res) => {
        log('GET /stat/summary');
        summaryForUsers(res, req.body)
    });
};