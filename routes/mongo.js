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

async function updateItem(item) {
  let oldItem = await Item.findOne( {_id: item._id} );
  if (oldItem) {
    oldItem.description = item.description;
    oldItem.due = item.due;
    oldItem.isDone = item.isDone;

    await oldItem.save();
    console.log('(' + item.description + ') is updated!');
  } else {
    console.log('the task is not found');
  }
}

async function deleteItem(item) {
  const result = await Item.deleteOne( {_id: item._id });
  if (result.ok && result.deletedCount) {
    console.log('(' + item.description + ') is deleted');
  } else {
    console.log('the task is not found, or an error occured');
  }
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

router.post('/', async (req, res) => {
  await saveNewItem(req.body)
  res.send('saved new item: ' + req.body.description);
});

router.put('/', async (req, res) => {
  await updateItem(req.body);
  res.send('updated: ' + req.body.description);
})

router.delete('/', async (req, res) => {
  await deleteItem(req.body);
  res.send('deleted: ' + req.body.description);
})

setUpMongo();

module.exports = router;