const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const  ObjectID  = require('mongodb').ObjectId;
require('dotenv').config()

console.log(process.env.DB_NAME);
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.38p2l.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello World!')
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const gemsCollection = client.db("gems").collection("addGems");

  app.post('/addProduct', (req, res) => {
      const newProduct = req.body;
      gemsCollection.insertOne(newProduct)
      .then(result =>{
          console.log('product added', result);
      })
  })


  app.get('/products', (req, res) => {
      gemsCollection.find()
      .toArray((err, items) =>{
          res.send(items);
      })
  })


  app.delete('/delete/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    gemsCollection.deleteOne({_id: id})
    .then(result =>{
      console.log("delete");
    })
  })


  app.get('/product/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    gemsCollection.find({_id: id})
    .toArray((err, document) =>{
        res.send(document);
    })
  })








  console.log('connected successfully');
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})