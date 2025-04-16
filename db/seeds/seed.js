const db = require("../connection")
const format = require("pg-format");
const { convertTimestampToDate, createRefObj } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query(`DROP TABLE IF EXISTS comments`)
  .then(() => {
    return db.query(`DROP TABLE IF EXISTS articles`)
  }).then(() => {
    return db.query(`DROP TABLE IF EXISTS users`);
  }).then(() => {
    return db.query(`DROP TABLE IF EXISTS topics`);
  }).then(() => {
    return db.query(`CREATE TABLE topics (
      slug VARCHAR(50) PRIMARY KEY,
      description VARCHAR(200),
      img_url VARCHAR(1000)
      )`);
  }).then(() => {
    return db.query(`CREATE TABLE users (
      username VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100),
      avatar_url VARCHAR(1000)
      )`);
  }).then(() => {
    return db.query(`CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(500),
      topic VARCHAR(50) REFERENCES topics(slug),
      author VARCHAR(50) REFERENCES users(username),
      body TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000)
      )`);
  }).then(() => {
    return db.query(`CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      article_id INT REFERENCES articles(article_id),
      body TEXT,
      votes INT DEFAULT 0,
      author VARCHAR(50) REFERENCES users(username),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`)
  }).then(() => {
    const formattedTopics = topicData.map((topic) => {
      return [
        topic.slug,
        topic.description,
        topic.img_url
      ]
    });
    const topicQuery = format(`INSERT INTO topics (slug, description, img_url) VALUES %L`, formattedTopics);
    return db.query(topicQuery);
  }).then(() => {    
    const formattedUsers = userData.map((user) => {
      return [
        user.username,
        user.name,
        user.avatar_url
      ]
    });
    const userQuery = format(`INSERT INTO users (username, name, avatar_url) VALUES %L`, formattedUsers);
    return db.query(userQuery);
   }).then(() => {    
      const formattedArticles = articleData.map((article) => {
        const changedArticles = convertTimestampToDate(article)        
        return [        
          changedArticles.title,
          changedArticles.topic,
          changedArticles.author,
          changedArticles.body,
          changedArticles.created_at,
          changedArticles.votes,
          changedArticles.article_img_url
        ]
      });
    const articleQuery = format(`INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`, formattedArticles);    
    return db.query(articleQuery);
    }).then((result) => { 
      console.log(result)
      const articlesRefObj = createRefObj(result.rows);
      const formattedComments = commentData.map((comment) => {
      const changedComments = convertTimestampToDate(comment)
      return [    
        articlesRefObj[changedComments.article_title],       
        changedComments.body,
        changedComments.votes,
        changedComments.author,
        changedComments.created_at
      ]
    });    
    const commentQuery = format(`INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L`, formattedComments);
    return db.query(commentQuery);
  });
};
module.exports = seed;
