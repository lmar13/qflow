const getWeek = () => ([
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
]);

const getMonth = () => ([
    'Jan', 'Feb', 'Mar',
    'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep',
    'Oct', 'Nov', 'Dec',
]);

const getYear = () => ([
    '2010', '2011', '2012',
    '2013', '2014', '2015',
    '2016', '2017', '2018',
    '2019',
]);

module.exports = {
    week: getWeek(),
    month: getMonth(),
    year: getYear()
}