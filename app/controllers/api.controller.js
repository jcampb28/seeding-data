const endpoints = require("../../endpoints.json");

const getApi = (req, res) => {    
    res.status(200).send({endpoints});
}

module.exports = {getApi};