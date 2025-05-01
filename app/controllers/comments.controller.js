const { removeCommentById, updateCommentVotes } = require("../models/comments.model");

// DELETE

const deleteCommentById = (req, res, next) => {
    const {comment_id} = req.params;    
    removeCommentById(comment_id)
    .then((response) => {
        res.status(204).send({response})
    }).catch(next);
};

const patchCommentVotes = (req, res, next) => {
    const {inc_votes} = req.body;
    const {comment_id} = req.params;
    updateCommentVotes(inc_votes, comment_id)
    .then((comment) => {
        res.status(200).send({comment})
    }).catch(next); 
};

module.exports = {deleteCommentById, patchCommentVotes};