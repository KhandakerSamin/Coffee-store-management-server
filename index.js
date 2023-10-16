const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// midleware
app.use(express.json())
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vheow1k.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // collection for coffee data : 
    const coffeeCollection = client.db('coffeedb').collection('coffee')
    // collection for user data : 
    const userCollection = client.db('coffeedb').collection('user')


    // All api for the Coffee data CRUD operation :
    
    app.get('/coffee', async(req, res) => {
      const coffee = await coffeeCollection.find().toArray()
      res.send(coffee)
    })

    app.get('/coffee/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })

    app.post('/coffee', async(req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      console.log(result);
      res.send(result)
    })

    app.put('/coffee/:id', async(req,res) => {
      const id = req.params.id;
      console.log(id);
      const filter = {_id : new ObjectId(id)}
      const options = { upsert : true};
      const updatedCoffee = req.body;
      const coffee = {
        $set:{
          name: updatedCoffee.name,
          quantity : updatedCoffee.quantity,
          supplier: updatedCoffee.supplier,
          price : updatedCoffee.price,
          category: updatedCoffee.category,
          details : updatedCoffee.details,
          photo: updatedCoffee.photo
        }
      }
      const result = await coffeeCollection.updateOne(filter,coffee, options);
      res.send(result);
    })

    app.delete('/coffee/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    })


    // All api for user data CRUD oparation : 


    app.get('/user', async(req, res) => {
      const users = await userCollection.find().toArray()
      res.send(users)
    })

    app.post('/user', async(req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    })

    app.patch( '/user', async(req, res) => {
      const user = req.body;
      const filter = {email : user.email}
      const updateDoc = {
        $set:{
          laslLoggedAt : user.laslLoggedAT
        }
      }
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result)
    })

    app.delete('/user/:id', async(req, res) => {
      const id = req.params.id ;
      const query = { _id : new ObjectId(id)}
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
 finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req, res) => {
    res.send('Wellcome to coffee server')
})

app.listen(port, () => {
    console.log(`coffee server is running : ${port}`);
})