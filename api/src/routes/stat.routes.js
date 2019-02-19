const _ = require('lodash');
const Board = require('./../models/board');
const Card = require('./../models/card');
const log = require('./../dev-logger');
const auth = require('./../auth-config/auth');
const {
    getStatsForProjectsAndCards
} = require('../utils/mainStat');
const {
    weekMatch,
    weekGroup,
    weekArray,
} = require('../utils/weekStat');
const {
    monthMatch,
    monthGroup,
    monthArray
} = require('../utils/monthStat');
const {
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

        getStatsForProjectsAndCards(res, null, yearGroup, yearArray);
    });

    app.get('/stat/summary', auth.required, (req, res) => {
        log('GET /stat/summary');
        const today = new Date()
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() - 1, 31)

        Board.countDocuments().exec((err, pAll) => {
            Board.countDocuments({
                startDate: {
                    $lte: lastDayOfMonth
                },
                endDate: {
                    $gte: firstDayOfMonth
                }
            }).exec((err, pLastMonth) => {
                Card.countDocuments({
                    startDate: {
                        $lte: lastDayOfMonth
                    },
                    endDate: {
                        $gte: firstDayOfMonth
                    }
                }).exec((err, cLastMonth) => {
                    Card.countDocuments({
                        startDate: {
                            $lte: lastDayOfMonth
                        },
                        endDate: {
                            $gte: firstDayOfMonth
                        }
                    }).exec((err, cLastWeek) => {
                        Card.countDocuments({
                            startDate: {
                                $lte: lastDayOfMonth
                            },
                            endDate: {
                                $gte: firstDayOfMonth
                            }
                        }).exec((err, cToday) => {
                            return res.status(200).json([{
                                    title: 'Projects',
                                    value: pAll,
                                },
                                {
                                    title: 'Projects Last Month',
                                    value: pLastMonth,
                                },
                                {
                                    title: 'Tasks Last Month',
                                    value: cLastMonth,
                                },
                                {
                                    title: 'Tasks Last Week',
                                    value: cLastWeek,
                                },
                                {
                                    title: 'Tasks Today',
                                    value: cToday,
                                },
                            ]);
                        });
                    });
                });
            });
        });
    });
};