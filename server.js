// const express = require('express');

// const app = express();
// const PORT = 3000;

// app.listen(PORT, (error) =>{
//     if(!error)
//         console.log("Server is Successfully Running , and App is listening on port "+ PORT);
//     else 
//         console.log("Error occurred, server can't start", error);
//     }
// );

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());


// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

// Monogo code
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://ksayyed2098:17XAKIwMnzQnw0wG@capstoneproject.euikujp.mongodb.net/?retryWrites=true&w=majority&appName=CapstoneProject";
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
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
}

async function writeToDb(user) {
    try {
      const database = client.db('crop_delight_db');
      const collection = database.collection('users');
      const result = await collection.insertOne(user);
      console.log(`New user inserted with the following id: ${result.insertedId}`);
    } catch (error) {
      console.error("Error writing to the database", error);
    }
  }
  
  // Register endpoint
  app.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
  
    try {
      // Log received data (you would typically store this in a database)
      console.log('Received registration data:', req.body);
  
      // Write to database
      await writeToDb({ username, password });
  
      // Send a success response
      res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error("Error during registration process", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

// Start the server
app.listen(PORT, (error) => {
    if (!error) {
        console.log("Server is Successfully Running, and App is listening on port " + PORT);
    } else {
        console.log("Error occurred, server can't start", error);
    }
});
