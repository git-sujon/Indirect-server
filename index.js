const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
let jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.prabmlk.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  const catagoriesCollection = client
    .db("indirect")
    .collection("catagoriesCollection");
  const productsCollection = client
    .db("indirect")
    .collection("productsCollection");
  const usersCollection = client.db("indirect").collection("usersCollection");

  try {
    // Catagories
    // ..............................................................................

    // get single Catagories

    app.get("/catagories/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await catagoriesCollection.findOne(query);
      res.send(result);
    });

    // get all Catagories
    app.get("/catagories", async (req, res) => {
      const result = await catagoriesCollection.find({}).toArray();
      res.send(result);
    });

      // ..............................................................................
    // Product
    // ..............................................................................

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const result = await productsCollection.find({}).toArray();
      res.send(result);
    });

    app.post('/products', async(req, res)=> {
      let product = req.body
      
      product ={
        ...product,
        Timestamp: new Date()
      }


      const result = await productsCollection.insertOne(product)
      res.send(result)
    })










    // ..............................................................................
    // User
    // ..............................................................................

    // get Single users

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    // get all users
    app.get("/users", async (req, res) => {
      const email = req.query.email;
      // const decodedEmail = req.decoded.email;
      // console.log(decodedEmail)

    //   if (email !== decodedEmail) {
    //     return res.status(403).send({ message: "forbidden access" });
    //   }

    let  query = {}
    if(email) {
       query = { email: email };
    }
     

      const users = await usersCollection.find(query).toArray();


      res.send(users);
    });

    //   users post

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
  } finally {
  }
};
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.listen(port, () => {
  console.log("Hey !!!", port);
});
