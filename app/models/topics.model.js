const db = require("../../db/connection");

const selectTopics = () => {
    return db.query(`SELECT slug, description FROM topics`)
    .then((result) => {
        console.log(result.rows)
        return result.rows;
    });
    //.catch()
};

module.exports = {selectTopics}