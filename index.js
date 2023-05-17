const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())






//running the server
app.get('/',(req,res)=>{
  res.send('TOY-CARS SERVER IS RUNNING');
})

app.listen(port,()=>{
    console.log(`TOY-CARS SERVER ${port}`)
})