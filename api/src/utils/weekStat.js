const getWeek = () => ([
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
]);

const weekMatch = () => {
    const dateNow = new Date();
    const dateBefore = new Date(dateNow);
    dateBefore.setDate(dateBefore.getDate() - dateBefore.getDay());

    return [{
        $match: {
            startDate: {
                $lte: dateNow
            },
            endDate: {
                $gte: dateBefore
            }
        }
    }]
};

const weekGroup = date => ({
    _id: {
        dayOfWeek: {
            $dayOfWeek: date
        },
        week: {
            $week: date
        },
        month: {
            $month: date
        }
    },
    count: {
        $sum: 1
    }
});

const createWeekArrayFromResult = (result = [], result2 = []) => {
    let weekNow = getNumberOfWeek() - 1;
    let week = getWeek();

    let sumStart = result.filter(res => weekNow > res._id.week).length;
    let sumEnd = 0;

    const startArray = Array.from({
            length: week.length
        },
        (v, i) => {
            const val = result.filter(res =>
                weekNow === res._id.week ? (res._id.dayOfWeek === i ? res : null) : null
            )[0];
            sumStart = sumStart + (val ? val.count : 0);
            return sumStart;
        }
    );

    const endArray = Array.from({
            length: week.length
        },
        (v, i) => {
            const val = result2.filter(res =>
                weekNow == res._id.week ? (res._id.dayOfWeek === i ? res : null) : null
            )[0];
            sumEnd = sumEnd + (val ? val.count : 0);
            return sumEnd;
        }
    );

    return startArray.map((res, index) => (endArray[index - 1] ? res - endArray[index - 1] : res));
};


const getNumberOfWeek = () => {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

module.exports = {
    week: getWeek(),
    weekMatch: weekMatch(),
    weekGroup: weekGroup,
    weekArray: createWeekArrayFromResult,
    nrWeek: getNumberOfWeek(),
}