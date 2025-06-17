const paginator = (array, limit, p) => {
    let lowerLimit = 0;
    let upperLimit = 10;    
    let resultsArr = array.slice(lowerLimit, upperLimit)
    if (limit) {
        if (p) {
            upperLimit = limit * p;
            lowerLimit = upperLimit - limit;
            resultsArr = array.slice(lowerLimit, upperLimit);
            return resultsArr;
        } else {
            resultsArr = array.slice(0, limit);
            return resultsArr;
        };
    };
    if (p) {
        upperLimit = upperLimit * p
        lowerLimit = upperLimit - 10
        resultsArr = array.slice(lowerLimit, upperLimit)
        return resultsArr          
    };
    return resultsArr;
};

const isQueryBad = (queries) => {
    let notValid = true
    for (const key in queries) {
        if (key === "limit" || key === "p") {
            if (queries[key] && Number(queries[key]) / 1 !== Number(queries[key])) {
                return notValid
            } else {
                notValid = false
                return notValid
            }
        }
    }
}



module.exports = {paginator, isQueryBad}