const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const app = require("../api");
const request = require("supertest");
const jestSorted = require("jest-sorted");


beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("Bad path", () => {
  test("404: Responds with an error message if the endpoint is incorrect", () => {
    return request(app)
      .get("/api/toppics")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found!")
      });
  });
})

describe("GET /api/topics", () => {
  test("200: Responds with an array containing all available topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body.topics;
        expect(topics).toHaveLength(3);
        expect(Array.isArray(topics)).toBe(true);
        topics.forEach((topic) => {
          expect(topic).toEqual({
            slug: expect.any(String),
            description: expect.any(String)
          });
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array containing all articles sorted in descending order by date and with a comment count but no body", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        expect(articles[0].comment_count).toBe(2);
        expect(articles[9].comment_count).toBe(0);
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number)
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with the article that has the specified ID", () => {
    return request(app)
      .get("/api/articles/6")
      .expect(200)
      .then((response) => {
        const body = response.body.article;
        expect(body).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("400: Responds with a bad request error when the article ID provided is not a number", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request")
      });
  });
  test("404: Responds with a not found error when the article ID provided is valid but no article with that ID exists", () => {
    return request(app)
      .get("/api/articles/256")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("No article with specified ID found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of all comments for the specfied article ID, in descending order of creation date", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments).toHaveLength(2)
        comments.forEach((comment) => {
          expect(comment).toEqual({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number)
          });
        });
      });
  });
  test("200: Responds with an empty array when the article exists but has no comments", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toEqual([])
      });
  });
  test("404: Responds with a not found error when the article ID provided is valid, but no article with that ID exists", () => {
    return request(app)
      .get("/api/articles/256/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("No article with specified ID found")
      });
  });
  test("400: Responds with a bad request error when the article ID provided is invalid", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request")
      });
  })
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Adds a comment to the specified article and responds with the posted comment", () => {
    const newComment = { username: "butter_bridge", body: "What a nice article" }
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toEqual({
          comment_id: expect.any(Number),
          votes: 0,
          article_id: 2,
          author: "butter_bridge",
          body: "What a nice article",
          created_at: expect.any(String)
        });
      });
  });
  test("400: Responds with a bad request error if the comment is an empty string", () => {
    const newComment = { username: "butter_bridge", body: "" }
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request")
      });
  });
  test("400: Responds with a bad request error if the comment object has incorrect keys", () => {
    const newComment = {}
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request")
      });
  })
  test("400: Responds with a bad request error when an invalid article ID is provided", () => {
    const newComment = { username: "butter_bridge", body: "What a nice article" }
    return request(app)
      .post("/api/articles/banana/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request")
      });
  })
  test("404: Responds with a not found error if the username is an empty string", () => {
    const newComment = { username: "", body: "What a nice article" }
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Username does not exist")
      });
  });
  test("404: Responds with a not found error if the comment post request is being made to a non-existent article", () => {
    const newComment = { username: "butter_bridge", body: "What a nice article" }
    return request(app)
      .post("/api/articles/256/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("No article with specified ID found")
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Increases vote count for the article with the given ID if the value of inc_votes is positive", () => {
    const newVotes = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/2")
      .send(newVotes)
      .expect(200)
      .then((response) => {
        const updatedArticle = response.body.article;
        expect(updatedArticle).toEqual({
          article_id: 2,
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 5,
          article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("200: Decreases vote count for the article with the given ID if the value of inc_votes is negative", () => {
    const newVotes = { inc_votes: -5 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(200)
      .then((response) => {
        const updatedArticle = response.body.article;
        expect(updatedArticle).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 95,
          article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("400: Responds with a bad request error when an invalid article ID is provided", () => {
    const newVotes = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/banana")
      .send(newVotes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      })
  });
  test("400: Responds with a bad request error if the votes object has incorrect keys", () => {
    const newVotes = { potato: -5 };
    return request(app)
      .patch("/api/articles/2")
      .send(newVotes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("400: Responds with a bad request error if the inc_votes value is not a number", () => {
    const newVotes = { inc_votes: "potato" };
    return request(app)
      .patch("/api/articles/2")
      .send(newVotes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  })
  test("404: Responds with a not found error if the comment post request is being made to a non-existent article", () => {
    const newVotes = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/256")
      .send(newVotes)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("No article with specified ID found")
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Deletes the comment with the specified ID and responds with no content", () => {
    return request(app)
    .delete("/api/comments/1")
    .expect(204)
    .then((response) => {
      expect(response.body.response).toBe(undefined);
      return db.query(`SELECT * FROM comments WHERE comment_id = 1`)
      .then((result) => {
        expect(result.rows.length).toBe(0);
      });
    });
  });
  test("400: Responds with a bad request error when the comment ID is not a number", () => {
    return request(app)
    .delete("/api/comments/banana")
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("Bad Request");
    });
  });
  test("404: Responds with a bat request error when the comment ID is valid but no comment with that ID exists", () => {
    return request(app)
    .delete("/api/comments/256")
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe("No comment with specified ID found");
    });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of all users", () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then((response) => {
      const {users} = response.body;
      expect(users).toHaveLength(4);
      users.forEach((user) => {
        expect(user).toEqual({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String)
        });
      });
    });
  });  
});

describe("GET /api/articles (sort queries)", () => {
  test("200: Responds with an array of articles sorted by any valid column, defaulting to descending order of creation", () => {
    return request(app)
    .get("/api/articles?sort_by=author")
    .expect(200)
    .then((response) => {
      const {articles} = response.body;
      expect(articles).toHaveLength(13);
      expect(articles).toBeSortedBy("author", {descending: true});
      expect(Array.isArray(articles)).toBe(true)
    });
  });
  test("200: Articles can be sorted in either descending (default) or ascending order", () => {
    return request(app)
    .get("/api/articles?order=asc")
    .expect(200)
    .then((response) => {
      const {articles} = response.body;
      expect(articles).toHaveLength(13);
      expect(articles).toBeSortedBy("created_at");
    });
  });
  test("200: Articles can be sorted with both the order and sort_by queries", () => {
    return request(app)
    .get("/api/articles?sort_by=comment_count&order=asc")
    .expect(200)
    .then((response) => {
      const {articles} = response.body;
      expect(articles).toHaveLength(13);
      expect(articles).toBeSortedBy("comment_count");
    });
  });
  test("400: Responds with a bad request error if query is invalid", () => {
    return request(app)
    .get("/api/articles?banana=desc")
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("Bad Request");
    });
  });
  test("400: Responds with a bad request error if the sort_by query value is invalid", () => {
    return request(app)
    .get("/api/articles?sort_by=banana")
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("Bad Request");
    });
  });
  test("400: Responds with a bad request error if the order query value is invalid", () => {
    return request(app)
    .get("/api/articles?order=banana")
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("Bad Request");
    });
  });
});

describe("GET /api/articles (topic query)", () => {
  test("200: Responds with an array of articles filtered by the specified topic", () => {
    return request(app)
    .get("/api/articles?topic=cats")
    .expect(200)
    .then((response) => {
      const {articles} = response.body;
      expect(articles).toHaveLength(1);
      expect(articles).toEqual([{
        author: "rogersop",
        title: "UNCOVERED: catspiracy to bring down democracy",
        article_id: 5,
        comment_count: 2,
        topic: "cats",
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String)
      }]);
    });
  });
  test("200: Responds with an empty array when the applied filter is valid but no articles with that topic exist", () => {
    return request(app)
    .get("/api/articles?topic=paper")
    .expect(200)
    .then((response) => {
      const {articles} = response.body;
      expect(articles).toHaveLength(0);      
    });
  });
  test("404: Responds with a not found error when the filter value is invalid", () => {
    return request(app)
    .get("/api/articles?topic=picnics")
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe("No articles with this topic found")
    });
  });
});

describe("GET /api/articles/:article_id (comment_count)", () => {
  test("200: Responds with the article at the specified ID, adding a comment_count property", () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then((response) => {
      const {article} = response.body;
      expect(article).toMatchObject({
        author: "butter_bridge",
        title: "Living in the shadow of a great man",
        article_id: 1,
        body: "I find this existence challenging",
        topic: "mitch",
        created_at: expect.any(String),
        votes: 100,
        article_img_url: expect.any(String),
        comment_count: 11
      });
    });
  });
  test("400: Responds with a bad request error when the article ID provided is not a number", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request")
      });
  });
  test("404: Responds with a not found error when the article ID provided is valid but no article with that ID exists", () => {
    return request(app)
      .get("/api/articles/256")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("No article with specified ID found");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: Responds with an object containing information on the specified user", () => {
    return request(app)
    .get("/api/users/rogersop")
    .expect(200)
    .then((response) => {
      const {user} = response.body
      expect(user).toEqual({
        username: "rogersop",
        name: "paul",
        avatar_url: "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",  
      });
    });
  });
  test("404: Responds with a not found error when no user with that username exists", () => {
    return request(app)
    .get("/api/users/iluvpicnics")
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe("No users with that username found")
    });
  });
  test("400: Responds with a bad request error when the username provided is not in a valid format", () => {
    return request(app)
      .get("/api/users/cka")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request")
      });
  });
});