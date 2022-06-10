const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

let dogs;

async function saveNewItem(item) {
  const newDog = new Dog({ "name": item.name });
  await newDog.save();
  console.log(newDog.name + " is saved! huff huff!");
}

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })
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
dogs = Dog.aggregate([
  { $project: { name: 1 } }
]);

router.get('/', (req, res) => {
  res.send(dogs);
});

router.post('/', (req, res) => {
  res.send(req.body.name);
  saveNewItem(req.body)
});

module.exports = router;