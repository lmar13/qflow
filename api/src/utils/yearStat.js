const getYear = () => ([
    '2010', '2011', '2012',
    '2013', '2014', '2015',
    '2016', '2017', '2018',
    '2019',
]);

const yearGroup = date => ({
    _id: {
        year: {
            $year: date
        }
    },
    count: {
        $sum: 1
    }
});

const createYearArrayFromResult = (result = [], result2 = []) => {
    let year = getYear();
    let sumStart = 0;
    let sumEnd = 0;

    const startArray = Array.from({
            length: year.length
        },
        (v, i) => {
            const val = result.filter(res =>
                res._id.year === parseInt(year[i]) ? res : null
            )[0];
            sumStart = sumStart + (val ? val.count : 0);
            return sumStart;
        }
    );

    const endArray = Array.from({
            length: year.length
        },
        (v, i) => {
            const val = result2.filter(res =>
                res._id.year === parseInt(year[i]) ? res : null
            )[0];
            sumEnd = sumEnd + (val ? val.count : 0);
            return sumEnd;
        }
    );

    return startArray.map((res, index) => (endArray[index - 1] ? res - endArray[index - 1] : res));
};

module.exports = {
    yearGroup: yearGroup,
    yearArray: createYearArrayFromResult,
    year: getYear()
}