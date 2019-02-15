const _ = require('lodash');
const Board = require('./../models/board');
const Card = require('./../models/card');
const log = require('./../dev-logger');
const auth = require('./../auth-config/auth');
const {
    week,
    month,
    year
} = require('./../utils/periods');



const weekMatch = (dateNow, dateBefore) => ([{
    "$match": {
        "startDate": {
            "$lte": dateNow
        },
        "endDate": {
            "$gte": dateBefore
        }
    }
}]);

const weekGroup = {
    "_id": {
        dayOfWeek: {
            $dayOfWeek: "$startDate",
        },
        week: {
            $week: "$startDate"
        },
    },
    "count": {
        "$sum": 1
    }
}

const createWeekArrayFromResult = (result = []) => {
    return Array.from({
        length: week.length
    }, (v, i) => {
        const val = result.filter(res => res._id.dayOfWeek === i)[0];
        return val ? val.count : 0;
    })
}

module.exports = function (app) {
    app.get('/stat/week', auth.required, (req, res) => {
        log('GET /stat/week');
        const dateNow = new Date(Date.now());
        const dateBefore = new Date(dateNow);
        dateBefore.setDate(dateBefore.getDate() - 7);
        // dateBefore.setDate(dateBefore.getFullYear - 1);
        console.log(month[dateNow.getMonth()]);

        Board.aggregate(weekMatch(dateNow, dateBefore)).group(weekGroup).exec((err, bResult) => {
            Card.aggregate(weekMatch(dateNow, dateBefore)).group(weekGroup).exec((err, cResult) => {
                console.log(cResult);
                console.log(bResult);

                return res.status(200).json([
                    createWeekArrayFromResult(bResult),
                    createWeekArrayFromResult(cResult),
                    createWeekArrayFromResult(),
                ])
            })
        });
    });

    app.get('/stat/month', auth.required, (req, res) => {
        log('GET /stat/month')
        res.status(200).json({
            info: 'test'
        })
    });

    app.get('/stat/year', auth.required, (req, res) => {
        log('GET /stat/year')
        res.status(200).json({
            info: 'test'
        })
    });
}