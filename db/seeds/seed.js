const db = require("../connection")
const format = require("pg-format");
const { convertTimestampToDate } = require("./utils");

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
      const formattedDate = convertTimestampToDate(article.created_at)
      return [        
        article.title,
        article.topic,
        article.author,
        article.body,
        formattedDate.created_at,
        article.votes,
        article.article_img_url
      ]
    });
    const articleQuery = format(`INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L`, formattedArticles);
    return db.query(articleQuery);
    }).then(() => {
    const formattedComments = commentData.map((comment) => {
      const formattedDate = convertTimestampToDate(comment.created_at)
      return [        
        comment.body,
        comment.votes,
        comment.author,
        formattedDate.created_at
      ]
    });
    const commentQuery = format(`INSERT INTO comments (body, votes, author, created_at) VALUES %L`, formattedComments);
    return db.query(commentQuery);
  });
};
module.exports = seed;
