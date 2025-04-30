# NC News Seeding

This is the backend of a database seeding/hosting project that serves news articles and allows registered users to leave comments on the articles.

The hosted app can be found here: `https://nc-news-jc28.onrender.com/api`

To run this project locally, follow these instructions:

NOTE: this project requires Node v23.10.0 or later and PosgreSQL v14.17 or later

1. Clone the repo from `https://github.com/jcampb28/seeding-data.git`

2. Install dependencies using `npm install`

3. .env setup:

   a. In the terminal, run `setup-dbs` to set up the databases:     

   b. Create two .env files:
      
      `.env.test`
      `.env.development`

   c. In the `.env.test` file, insert the following code:

      `PGDATABASE=nc_news_test`

   d. In the `.env.development` file, insert the following code:

      `PGDATABASE=nc_news`

4. Seed the development database with `npm run seed-dev`

5. To run seeding tests, use the terminal command `npm test seed`

5. To run application tests, use the terminal command `npm test app`

