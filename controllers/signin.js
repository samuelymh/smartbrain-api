const handleSignin = (req, response, db, bcrypt) => {
  const { email, password } = req.body;
  
  // We want to validate the user inputs on both frontend and backend separately.
  // We don't want to trust the frontend to make correct validations.
  // This way it's more robust.
  if(!email || !password){
    return response.status(400).json('Incorrect submission format');
  }

  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const { hash } = data[0];
      bcrypt.compare(password, hash, (err, res) => {
        if(res){
          db.select('*').from('users')
            .where('email', '=', email)
            .then(user => {
              response.json(user[0]);
            })
            .catch(err => response.status(400).json('Unable to get user.'));
        } else {
            response.status(400).json('Wrong password');
        }
      })
    })
    .catch(err => response.status(400).json('Wrong credentials.'));
};

module.exports = {
  handleSignin: handleSignin
}