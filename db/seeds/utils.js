const db = require("../../db/connection");


exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRefObj = (articleData) => {
  if (articleData.length === 0){
    return {};
  };
  const result = {};
  articleData.forEach((article) => {
    result[article.title] = article.article_id;
  })
  return result;
}

