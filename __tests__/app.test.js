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