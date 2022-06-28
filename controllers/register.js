const handleRegister = (req, res, db, bcrypt) => {
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
};

module.exports = {
  handleRegister: handleRegister
}