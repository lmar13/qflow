const getMonth = () => ([
    'Jan', 'Feb', 'Mar',
    'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep',
    'Oct', 'Nov', 'Dec',
]);

const monthMatch = () => {
    const dateNow = new Date();
    const dateBefore = new Date(new Date().getFullYear(), 0, 1);

    return [{
        $match: {
            startDate: {
                $lte: dateNow
            },
            endDate: {
                $gt: dateBefore
            }
        }
    }]
};

const monthGroup = date => ({
    _id: {
        month: {
            $month: date
        },
        year: {
            $year: date
        }
    },
    count: {
        $sum: 1
    }
});

const createMonthArrayFromResult = (result = [], result2 = []) => {
    let yearNow = getNumberOfYear();
    let month = getMonth();
    let sumStart = result.filter(res => yearNow > res._id.year).length;
    let sumEnd = 0;

    const startArray = Array.from({
            length: month.length
        },
        (v, i) => {
            const val = result.filter(res =>
                yearNow === res._id.year ? (res._id.month - 1 === i ? res : null) : null
            )[0];
            sumStart = sumStart + (val ? val.count : 0);
            return sumStart;
        }
    );

    const endArray = Array.from({
            length: month.length
        },
        (v, i) => {
            const val = result2.filter(res =>
                yearNow === res._id.year ? (res._id.month - 1 === i ? res : null) : null
            )[0];
            sumEnd = sumEnd + (val ? val.count : 0);
            return sumEnd;
        }
    );

    return startArray.map((res, index) => (endArray[index - 1] ? res - endArray[index - 1] : res));
};


const getNumberOfYear = () => {
    const today = new Date()
    return today.getFullYear();
}

module.exports = {
    monthMatch: monthMatch(),
    monthGroup: monthGroup,
    monthArray: createMonthArrayFromResult,
    month: getMonth(),
}