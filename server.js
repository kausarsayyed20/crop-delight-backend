const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const PORT = 3000;
const uri = "mongodb+srv://ksayyed2098:17XAKIwMnzQnw0wG@capstoneproject.euikujp.mongodb.net/?retryWrites=true&w=majority&appName=CapstoneProject";
let client;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Connect to MongoDB
async function connectToMongoDB() {
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
}

connectToMongoDB();

// Function to write user to the database
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

// Function to find user in the database
async function findUser(username) {
  try {
    const database = client.db('crop_delight_db');
    const collection = database.collection('users');
    const user = await collection.findOne({ username });
    console.log('User found:', user); // Log the user found
    return user;
  } catch (error) {
    console.error("Error finding user in the database", error);
    return null;
  }
}

// Register endpoint
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Log received data
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

// Login endpoint
app.post('/login', async (req, res) => {
  console.log("attemp to log in ");
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Log received data
    console.log('Received login data:', req.body);
    console.log("the user name "+ username)
    const user = await findUser(username);
    
    if (user && password === user.password) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error("Error during login process", error);
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
