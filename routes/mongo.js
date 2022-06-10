const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

async function saveNewItem(item) {
  const newItem = new Item({ 
    'description': item.description,
    'due': item.due,
    'isDone': item.isDone 
  });
  await newItem.save();
  console.log('(' + newItem.description + ') is saved!');
}

async function getItems() {
  return Item.find();
}

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`Connected to Mongo!`);
  })
  .catch(err => {
    console.log(`Oh no! Mongo connection error!`);
    console.log(err);
  })

const itemSchema = new mongoose.Schema({
  description: String,
  due: Date,
  isDone: Boolean,
}, { collection: 'items' });

const Item = new mongoose.model('Item', itemSchema);

router.get('/', (req, res) => {
  res.send(getItems());
});

router.post('/', (req, res) => {
  res.send(req.body.description);
  saveNewItem(req.body)
});

module.exports = router;