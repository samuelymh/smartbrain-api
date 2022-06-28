// Required modules
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

// Controller modules
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// Setup of database connection
const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1', // 127.0.0.1 is localhost
    port : 5432,
    user : 'postgres',
    password : 'test',
    database : 'smartbrain-db'
  }
});
// Express object used to do HTTP requests
const app = express();

// express middleware to allow us to read json from req.body
app.use(express.json());
app.use(cors());

// Passing the required parameters(db, bcrypt) into the function is also called
// dependency injection.
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) });

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });

// We can also do the following to pass in req and res
// it calls image.handleImage(db)(req, res).
// It's the same as (req, res) => { image.handleImage(req, res, db) }
// Though with this implementation we'd need a second arrow function in handleImage.
// Refer to the image.js module. (My personal preference is still the above versions.)
app.put('/image', image.handleImage(db));

app.post('./imageurl', (req, res) => { image.handleApiCall(req, res) });

app.listen(3001, () => {
  console.log('app is running on port 3001');
});

/*
We will use Postman to test our API.

API Design
routes(Endpoints) --> what happens

/                 --> res = this is working
/signin           --> POST = success/fail
/register         --> POST = new user object
/profile/:userId  --> GET = user object
/image            --> PUT = user's entries
*/

/*
Now we change implementation of database from js to postgresql
npm install knex (helpful module for sqlquerybuilder)
npm install pg (for our db type, postgresql)

*/