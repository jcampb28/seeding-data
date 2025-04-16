const {
  convertTimestampToDate,
  createRefObj
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("createRefObj", () => {
  test("Returns an empty object when passed an empty array", () => {
    const input = [];
    const result = createRefObj(input);
    expect(result).toEqual({})
  });
  test("Returns a single key-value pair of article_title-article_id, when passed an array containing information from one article", () => {
    const input = [{
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: 1594329060000,
      votes: 100,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    }];
    const result = createRefObj(input);
    expect(result).toEqual({"Living in the shadow of a great man": 1})
  });
  test("Returns a key-value pair of article_title-article_id for each item in the array, when passed an array containing information from multiple articles", () => {
    const input = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1594329060000,
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
      {
        article_id: 2,
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "Bastet walks amongst us, and the cats are taking arms!",
        created_at: 1596464040000,
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      }
    ]
    const result = createRefObj(input);
    expect(result).toEqual({"Living in the shadow of a great man": 1, "UNCOVERED: catspiracy to bring down democracy": 2})
  });
  test("Does not mutate the input", () => {
    const input = [{
      article_id: 1,
      title: "Living in the shadow of a great man",      
    },
    {
      article_id: 2,
      title: "UNCOVERED: catspiracy to bring down democracy",      
    }];
    const result = createRefObj(input);
    const control = [{
      article_id: 1,
      title: "Living in the shadow of a great man",      
    },
    {
      article_id: 2,
      title: "UNCOVERED: catspiracy to bring down democracy",      
    }]
    expect(input).toEqual(control)
  });
});
