const Board = require('./../models/board');
const Card = require('./../models/card');

const getStatsForProjectsAndCards = (res, match, group, array) => {
    Board.aggregate(match)
        .group(group('$startDate'))
        .exec((err, bResultStart) => {
            Board.aggregate(match)
                .group(group('$endDate'))
                .exec((err, bResultEnd) => {
                    Card.aggregate(match)
                        .group(group('$startDate'))
                        .exec((err, cResultStart) => {
                            Card.aggregate(match)
                                .group(group('$endDate'))
                                .exec((err, cResultEnd) => {
                                    return res.status(200).json([
                                        array(bResultStart, bResultEnd),
                                        array(cResultStart, cResultEnd),
                                        array()
                                    ]);
                                });
                        });
                });
        });
};

module.exports = {
    getStatsForProjectsAndCards: getStatsForProjectsAndCards
}