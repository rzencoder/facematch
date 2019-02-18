const Clarifai = require("clarifai");

const ClarifaiAPIKey = process.env.CLARIFAI_API_KEY;
const app = new Clarifai.App({
  apiKey: ClarifaiAPIKey
});

// Call to Clarifai API to get face detection data
const handleImageApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(response => {
      res
        .json(response)
        .catch(err => res.status(400).json("Error loading API"));
    });
};

// Increase serach count on image search
const handleImage = (req, res, knex) => {
  const {
    id
  } = req.body;
  knex("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json("Error loading data"));
};

module.exports = {
  handleImage: handleImage,
  handleImageApiCall: handleImageApiCall
};