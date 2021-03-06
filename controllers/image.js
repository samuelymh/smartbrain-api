const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: '19c9234fd2f54ca6b0c9d047d683d9a8'
});

const handleApiCall = (req, res) => {
  app.models
  .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
  .then(data => {
    res.json(data);
  })
  .catch(err => res.status(400).json('Unable to work with API'));
}


const handleImage = (db) => (req, res) => {
  const { id } = req.body;
  db('users')
    .where({ id })
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json("Error when updating entries."));
};

module.exports = {
  handleImage,
  handleApiCall
}