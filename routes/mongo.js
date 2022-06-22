const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

async function saveNewItem(item) {
  const newItem = new Item({
    'title': item.title,
    'description': item.description,
    'due': item.due,
    'isDone': item.isDone
  });
  await newItem.save();
  console.log('(' + newItem.title + ') is saved!');
}

async function updateItem(item) {
  let oldItem = await Item.findOne({ _id: item._id });
  if (oldItem) {
    oldItem.title = item.title;
    oldItem.description = item.description;
    oldItem.due = item.due;
    oldItem.isDone = item.isDone;

    await oldItem.save();
    console.log('(' + item.title + ') is updated!');
  } else {
    console.log('the task is not found');
  }
}

async function deleteItem(item) {
  const result = await Item.deleteOne({ _id: item._id });
  if (result) {
    if (result.deletedCount) {
      console.log('(' + item.title + ') is deleted');
    } else {
      console.log('the task is not found, or an error occured');
    }
  }
}

let Item;

// async function getItems() {
//   items = await Item.find();
//   console.log('items are ready!')
// }

async function setUpMongo() {
  await mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log(`Connected to Mongo!`);
    })
    .catch(err => {
      console.log(`Oh no! Mongo connection error!`);
      console.log(err);
    })

  const itemSchema = new mongoose.Schema({
    title: String,
    description: String,
    due: Date,
    isDone: Boolean,
  }, { collection: 'items' });

  itemSchema.index({ isDone: 1, due: 1 })

  Item = new mongoose.model('Item', itemSchema);
}

router.get('/', async (req, res) => {
  const allItems = await Item.find();
  res.send(allItems);
  console.log('number of all items: ' + allItems.length);
})

router.get('/uncompleted/', async (req, res) => {
  const uncompletedItems = await Item.find({ isDone: false }).sort('due');
  res.send(uncompletedItems);
  console.log('number of uncompleted items: ' + uncompletedItems.length);
});

router.get('/completed/', async (req, res) => {
  const completedItems = await Item.find( {isDone: true} );
  res.send(completedItems);
  console.log('number of completed items: ' + completedItems.length);
});

router.post('/', async (req, res) => {
  await saveNewItem(req.body);
  res.send('saved new item: ' + req.body.title);
});

router.put('/', async (req, res) => {
  await updateItem(req.body);
  res.send('updated: ' + req.body.title);
})

router.delete('/', async (req, res) => {
  await deleteItem(req.body);
  res.send('deleted: ' + req.body.title);
})

setUpMongo();

module.exports = router;