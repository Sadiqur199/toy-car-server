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
    await client.connect();

    const productCollection = client.db('ToyCars').collection('AllProducts')
    const AddToy = client.db('ToyCars').collection('AddToy')
    // Send a ping to confirm a successful connection

    app.get('/products',async(req,res)=>{
      let query = {};
      if(req.query?.CategoryName){
        query = {CategoryName:req.query.CategoryName}
      }
      const result = await productCollection.find(query).toArray()
      res.send(result)
    })
  app.get('/products',async(req,res)=>{
     const cursor = productCollection.find()
     const result = await cursor.toArray()
     res.send(result)
  })

  app.get('/products/:id',(req,res)=>{
    const id = req.params.id
 
    const selectedProduct = productCollection.find(product=>product._id == id)
    res.send(selectedProduct)
  
  })

  //addToy 
  app.get('/addToy',async(req,res)=>{
    
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
app.get('/',(req,res)=>{
  res.send('TOY-CARS SERVER IS RUNNING');
})

app.listen(port,()=>{
    console.log(`TOY-CARS Running The SERVER ${port}`)
})