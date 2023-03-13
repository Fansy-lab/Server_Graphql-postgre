# Instructions:

0. run 'npm i'
1. If you do not have a .env file create one with the following variable:
   DATABASE_URL="postgresql://postgres:passwordhere@localhost:5432/postgres?schema=public"
   change the url with correct values for your Postgres Database
2. run 'npm run migrate'
3. run 'npm run seed'
4. run 'npm run server' to start the serer
