const db = require("../../db/connection");

const selectTopics = () => {
    return db.query(`SELECT slug, description FROM topics`)
        .then((result) => {
            return result.rows;
        });
};

const addTopic = (newTopic) => {
    return db.query(`INSERT INTO topics (slug, description) VALUES($1, $2) RETURNING *`, [newTopic.slug, newTopic.description])
    .then((result) => {
        return result.rows[0]
    });
};


module.exports = { selectTopics, addTopic }