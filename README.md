# NC News Seeding

.env setup:

1. In the terminal, run the following command to set up the databases:

   `npm run setup-dbs`

2. Create two .env files:
   
   `.env.test`
   `.env.development`

3. In the `.env.test` file, insert the following code:

   `PGDATABASE=nc_news_test`

4. In the `.env.development` file, insert the following code:

   `PGDATABASE=nc_news`
