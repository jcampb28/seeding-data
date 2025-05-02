# NC News Seeding

This is the backend of a database seeding/hosting project that serves news articles.
The hosted app can be found here: `https://nc-news-jc28.onrender.com/api`.

There are several core functionalities:
   1. Articles, users, article topics and comments can be retrieved,

   2. Posting and deletion of comments and articles,

   3. An adjustable vote property on articles and comments,
   
   4. Sorting, filtering and pagination for articles; pagination for comments.

More information on functionality, including accepted inputs and expected responses can be found at the `/api` endpoint in the hosted app, or in the `endpoints.json` file if running this project locally.

To run this project locally, follow these instructions:

NOTE: this project requires Node v23.10.0 or later and PosgreSQL v14.17 or later

1. Clone the repo from `https://github.com/jcampb28/seeding-data.git`

2. Install dependencies using `npm install`

3. Set up .env files:

   a. In the terminal, run `setup-dbs` to set up the databases:     

   b. Create two .env files:
      
      `.env.test`
      `.env.development`

   c. In the `.env.test` file, insert the following code:

      `PGDATABASE=nc_news_test`

   d. In the `.env.development` file, insert the following code:

      `PGDATABASE=nc_news`

4. Seed the development database with `npm run seed-dev`

To run seeding tests, use the terminal command `npm test seed`

To run application tests, use the terminal command `npm test app`

