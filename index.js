const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middlewares
app.use(cors())
app.use(express.json());

// console.log(process.env.DB_USER);

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { configDotenv } = require('dotenv');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x69co.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const assignmentCollection = client.db('solveItDB').collection('assignments');
    const submittedCollection = client.db('solveItDB').collection('submit');

    app.get('/assignments', async (req, res) => {
      const result = await assignmentCollection.find().toArray();
      res.send(result)
    })

    app.get('/assignments/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await assignmentCollection.findOne(query);
      res.send(result)
    })

    app.get('/assignments/submit/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = {
        // Include only the `title` and `imdb` fields in the returned document
        projection: { _id: 1, title: 1 },
      };
      const result = await assignmentCollection.findOne(query, options);
      res.send(result);
    })

    app.get('/submitted', async (req, res) => {
      // console.log(req.query.email)
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await submittedCollection.find(query).toArray();
      res.send(result)
    })

    app.get('/submitted/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await submittedCollection.findOne(query);
      res.send(result)
    })

    app.post('/submitted', async (req, res) => {
      const doc = req.body;
      const result = await submittedCollection.insertOne(doc);
      res.send(result)
    })

    app.post('/assignments', async (req, res) => {
      //  console.log(req.body);
      const doc = req.body;
      const result = await assignmentCollection.insertOne(doc);
      res.send(result)
    })

    app.put('/assignments/update/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedDoc = req.body;
      // console.log(updatedDoc);
      const updateDoc = {
        $set: {
          title: updatedDoc.title,
          marks: updatedDoc.marks,
          thumbnail: updatedDoc.thumbnail,
          level: updatedDoc.level,
          dueDate: updatedDoc.dueDate,
          email: updatedDoc.email,
          name: updatedDoc.name,
          description: updatedDoc.description,
        },
      };
      const result = await assignmentCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    })

    app.put('/submitted/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = req.body;
      const updateDoc = {
        $set: {
          
          marks: updatedDoc.marks,
          examinerNote: updatedDoc.examinerNote,
        }
      };
      const result = await submittedCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })

    app.delete('/assignments/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await assignmentCollection.deleteOne(query);
      res.send(result)
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


app.get('/', (req, res) => {
  res.send('SolveIt server is running.')
})

app.listen(port, () => {
  console.log(`SolveIt server is currently listening to port ${port}`)
})