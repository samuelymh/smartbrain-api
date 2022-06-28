const handleSignin = (req, response, db, bcrypt) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const { hash } = data[0];
      bcrypt.compare(req.body.password, hash, (err, res) => {
        if(res){
          db.select('*').from('users')
            .where('email', '=', req.body.email)
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