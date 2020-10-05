const express = require('express'); 
const cors = require('cors');
const bodyParser = require('body-parser'); 
require('dotenv').config()
// mongodb
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q1oby.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express(); 
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


client.connect(err => {
  const eventCollection = client.db(process.env.DB_NAME).collection("events");
  const regEventCollection = client.db(process.env.DB_NAME).collection("eventreg");

    app.post('/addEvent', (reg, res)=>{
        const addEvent = reg.body;
        console.log(reg.body);
        eventCollection.insertOne(addEvent)
        .then(function(result) {
          console.log("insert sucessfull");  
          res.send(result.insertedCount);
        })
    })
    
    app.post('/regEvent', (reg, res)=>{

      const addRegEvent = reg.body; 
      regEventCollection.insertOne(addRegEvent)
      .then(function(result) {
        console.log("insert sucessfull");  
        res.send(result.insertedCount);
      })

    })

    app.get('/allRegEvent', (req, res) => {
      regEventCollection.find({})
      .toArray( (err, documents) => {
          res.send(documents);
      })
    })
    app.get('/userEvent/:email', (req, res) => {
      regEventCollection.find({email: req.params.email})
      .toArray ( (err, documents) =>{
        res.send(documents);
      })
    })
    
  app.delete('/userEventDelete/:id', (req, res) =>{
    regEventCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then( result => {
      res.send(result.deletedCount > 0);
    })
  })

    app.get('/eventList', (req, res) => {
      eventCollection.find({})
      .toArray( (err, documents) => {
          res.send(documents);
      })
  })

    app.get('/', (reg, res) => {

        res.send("products");
    })
});



app.listen('4000', ()=> {
    console.log("app listen");
})