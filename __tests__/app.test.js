const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const app = require("../api");
const request = require("supertest");


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
        expect(response.body.msg).toBe("Not Found")
      });
  });
})

describe("GET /api/topics", () => {
  test("200: Responds with an array containing all available topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const body = response.body;
        expect(body).toHaveLength(3);
        expect(Array.isArray(body)).toBe(true);
        body.forEach((topic) => {
          expect(topic).toEqual({
            slug: expect.any(String),
            description: expect.any(String)
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
        const body = response.body;
        expect(Object.keys(body)).toHaveLength(8);
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