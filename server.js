const express = require('express');

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

app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/signin', (req, res) => {
  if (req.body.email === database.users[0].email &&
      req.body.password === database.users[0].password) {
    res.json('success');
  } else {
    res.status(400).json('error logging in');
  }
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  const user = {
    id: '125',
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  }

  database.users.push(user);

  res.json(user);
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id){
      found = true;
      return res.json(user);
    }
  });
  if(!found){
    res.status(400).json('user not found in database');
  }
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if(user.id === id) {
      found = true;
      return res.json(++user.entries);
    }
  });
  if(!found){
    res.status(400).json('user not found in database');
  }
})

app.listen(3000, () => {
  console.log('app is running on port 3000');
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