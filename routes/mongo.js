const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

main().catch(err => err);

let dogs;

async function main() {
  await mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log(`Connected to Mongo!`);
    })
    .catch(err => {
      console.log(`Oh no! Mongo connection error!`);
      console.log(err);
    })

  const dogSchema = new mongoose.Schema({
    name: String,
  }, { collection: 'dogs' });

  const Dog = new mongoose.model('Dog', dogSchema);
  dogs = await Dog.aggregate([
    { $project: { name: 1 } }
  ]);
}

router.get('/', (req, res) => {
  res.send(dogs);
});

module.exports = router;