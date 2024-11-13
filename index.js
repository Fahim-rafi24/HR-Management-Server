const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express()

// use middleware
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;

const uri = `mongodb+srv://${process.env.MONGODB_User}:${process.env.MONGODB_Pass}@cluster0.mltki.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    // call home Root
    app.get('/', (req, res) => {
      res.send('HR Management System!')
    })

    // HR_Service dataBase Block
    const users = client.db("HR_Service").collection("users");
    // get all users
    app.get('/users', async(req, res)=>{
      const result = await users.find({}).toArray();
      res.send(result);
    })
    // add a user
    app.post('/user', async (req, res)=>{
      const data = req.body;
      const result = await users.insertOne(data);
      res.send({massage: 'successfull'});
    })
    // find a user data
    app.get('/userData', async(req, res)=>{
      const {email} = req.query;
      const result = await users.findOne({email});
      res.send(result);
    })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.listen(port, () => {
  console.log(`Server is running ${port}`)
})