const { selectTopics, addTopic } = require("../models/topics.model");

const getTopics = (req, res, next) => {
    selectTopics()
        .then((topics) => {
            res.status(200).send({topics})
        })
        .catch(next)
};

const postTopic = (req, res, next) => {
    const {slug, description} = req.body
    if (slug === undefined || description === undefined) {
        return Promise.reject({status: 400, msg: "Bad Request"})
    } else {
        addTopic({slug, description})
        .then((topic) => {
            res.status(201).send({topic})
        }).catch(next);
    };
};

module.exports = { getTopics, postTopic }