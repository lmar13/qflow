const Board = require('./../models/board');
const Card = require('./../models/card');

const getStatsForProjectsAndCards = (res, match, group, array) => {
    Board.aggregate(match())
        .group(group('$startDate'))
        .exec((err, bResultStart) => {
            Board.aggregate(match())
                .group(group('$endDate'))
                .exec((err, bResultEnd) => {
                    Card.aggregate(match())
                        .group(group('$startDate'))
                        .exec((err, cResultStart) => {
                            Card.aggregate(match())
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

const getStatsForUsersProjectsAndCards = (res, users, match, group, array) => {
    Board.aggregate(match(users))
        .group(group('$startDate'))
        .exec((err, bResultStart) => {
            Board.aggregate(match(users))
                .group(group('$endDate'))
                .exec((err, bResultEnd) => {
                    Card.aggregate(match(users))
                        .group(group('$startDate'))
                        .exec((err, cResultStart) => {
                            Card.aggregate(match(users))
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
}

const summaryForAll = (res) => {
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());

    Board.find().exec((err, boards) => {
        Card.find().exec((err, cards) => {
            return res.status(200).json([{
                    title: 'Projects',
                    value: boards.length,
                },
                {
                    title: 'Projects Last Month',
                    value: boards.filter(board => board.startDate <= today && board.endDate >= firstDayOfMonth).length,
                },
                {
                    title: 'Tasks Last Month',
                    value: cards.filter(card => card.startDate <= today && card.endDate > firstDayOfMonth).length,
                },
                {
                    title: 'Tasks Last Week',
                    value: cards.filter(card => card.startDate <= today && card.endDate >= firstDayOfWeek).length,
                },
                {
                    title: 'Tasks Today',
                    value: cards.filter(card => card.startDate <= today && card.endDate >= today).length,
                },
            ]);
        });
    });
}

const summaryForUsers = (res, users) => {
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());

    Board.find({
        'assignedUsers.value': {
            $in: users.map(user => user._id)
        }
    }).exec((err, boards) => {
        Card.find({
            'assignedUsers.value': {
                $in: users.map(user => user._id)
            }
        }).exec((err, cards) => {
            return res.status(200).json([{
                    title: 'Projects',
                    value: boards.length,
                },
                {
                    title: 'Projects Last Month',
                    value: boards.filter(board => board.startDate <= today && board.endDate >= firstDayOfMonth).length,
                },
                {
                    title: 'Tasks Last Month',
                    value: cards.filter(card => card.startDate <= today && card.endDate > firstDayOfMonth).length,
                },
                {
                    title: 'Tasks Last Week',
                    value: cards.filter(card => card.startDate <= today && card.endDate >= firstDayOfWeek).length,
                },
                {
                    title: 'Tasks Today',
                    value: cards.filter(card => card.startDate <= today && card.endDate >= today).length,
                },
            ]);
        });
    });
}



module.exports = {
    getStatsForProjectsAndCards: getStatsForProjectsAndCards,
    getStatsForUsersProjectsAndCards: getStatsForUsersProjectsAndCards,
    summaryForAll: summaryForAll,
    summaryForUsers: summaryForUsers
}