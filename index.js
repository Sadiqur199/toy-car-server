const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())


//mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ab4114m.mongodb.net/?retryWrites=true&w=majority`;

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
     client.connect();

    const productCollection = client.db('ToyCars').collection('AllProducts')
    const AddToyCollection = client.db('ToyCars').collection('AddToy')
    // Send a ping to confirm a successful connection
    app.get('/products', async (req, res) => {
      let query = {};
      if (req.query?.CategoryName) {
        query = { CategoryName: req.query.CategoryName }
      }
      const result = await productCollection.find(query).toArray()
      res.send(result)
    })

    app.get('/products', async (req, res) => {
      const cursor = productCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const result = await productCollection.findOne(filter)
      res.send(result)
    })




    //addToy 
    app.get('/addToy', async (req, res) => {
      console.log(req.query.email)
      let query = {}
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const sort = req?.query?.sort === 'true' ? 1 : -1
      const result = await AddToyCollection.find(query).sort({price: sort}).toArray()
      res.send(result)
    })


    app.get('/addToy/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const result = await AddToyCollection.findOne(filter)
      res.send(result)
    })


    app.post('/addToy', async (req, res) => {
      const newToy = req.body
      // console.log(newToy)
      const result = await AddToyCollection.insertOne(newToy)
      res.send(result)

    })

    //update data
    app.put('/addToy/:id',async(req,res)=>{
      const id = req.params.id
      const filter = {_id:new ObjectId(id)}
      const options = {upsert: true}
      const updatedMyToy = req.body
      const MyToy = {
        $set:{
          name:updatedMyToy.name,
          price:updatedMyToy.price,
          quantity:updatedMyToy.quantity,
          details:updatedMyToy.details,
        }
      }

      const result = await AddToyCollection.updateOne(filter,MyToy,options)
      res.send(result)
    })

    //delete
    app.delete('/addToy/:id',async(req,res)=>{
      const id = req.params.id
      const query = {_id:new ObjectId(id)}
      const result = await AddToyCollection.deleteOne(query)
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


//running the server
app.get('/', (req, res) => {
  res.send('TOY-CARS SERVER IS RUNNING');
})

app.listen(port, () => {
  console.log(`TOY-CARS Running The SERVER ${port}`)
})