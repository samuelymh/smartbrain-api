const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

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

// query builder returns a promise
// db.select('*').from('users')
//   .then(data => {
//     console.log(data);
//   });

const app = express();

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date()
    }
  ]
}

// express middleware to allow us to read json from req.body
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  db
  // if (req.body.email && email === database.users[0].email &&
  //     req.body.password === database.users[0].password) {
  //   res.json(database.users[0]);
  // } else {
  //   res.status(400).json('error logging in');
  // }  
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, null, null, function(err, hash) {
    // Store hash in your password DB.
    // We use a transaction when we have to manipulate >= 2 things
    db.transaction(trx => {
      // Then we use the transaction trx instead of db.
      trx.insert({
        hash: hash,
        email, email
      })
      .into('login')
      .returning('email') // return's the amil
      .then(loginEmail => {
        return trx('users') // then we return another transaction
          .returning('*')
          .insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);  
          })
      })
      .then(trx.commit)     // to save changes
      .catch(trx.rollback)  // to undo changes in case of errors
    })
    .catch(err => res.status(400).json('Unable to register.'));
  });
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({ id })
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json('User not found.');
      }
    })
    .catch(err => res.status(400).json('Error getting user.'));
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users')
    .where({ id })
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json("Error when updating entries."));
});

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