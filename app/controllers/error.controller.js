const handlePSQLErrors = (err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({msg: "Bad Request"});
    } else if (err.code === "23505") {
        res.status(400).send({msg: "Duplicate primary key"});
    } else {
        next(err);
    };
};

const handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg});
    } else {
        next(err);
    };
};

const catchAllErrors = (err, req, res, next) => {
    res.status(500).send({msg: "Internal Server Error"});
};

module.exports = {handlePSQLErrors, handleCustomErrors, catchAllErrors}