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

let items, Item;

// async function getItems() {
//   items = await Item.find();
//   console.log('items are ready!')
// }

function setUpMongo() {
  const itemSchema = new mongoose.Schema({
    description: String,
    due: Date,
    isDone: Boolean,
  }, { collection: 'items' });

  Item = new mongoose.model('Item', itemSchema);
}

async function getItems() {
  await mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log(`Connected to Mongo!`);
    })
    .catch(err => {
      console.log(`Oh no! Mongo connection error!`);
      console.log(err);
    })
  items = await Item.find();
}

router.get('/', async (req, res) => {
  await getItems().catch(err => console.log(err));

  res.send(items);
  console.log('number of uncompleted items: ' + items.length);
});

router.post('/', (req, res) => {
  res.send(req.body.description);
  saveNewItem(req.body)
});

setUpMongo();

module.exports = router;