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
  const bookingCollection = client
    .db("indirect")
    .collection("bookingCollection");
  const blogsCollection = client.db("indirect").collection("blogsCollection");
  const cityCollection = client.db("indirect").collection("cityCollection");
  const areaUnderCityCollection = client
    .db("indirect")
    .collection("areaUnderCityCollection");

  try {
    // ..............................................................................
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
      let query = {};
      const category = req.query.category;
      const email = req.query.email;

      if (email) {
        query = { email: email };
      }

      if (category) {
        query = { category: category };
      }

      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      let product = req.body;

      product = {
        ...product,
        Timestamp: new Date(),
      };

      const result = await productsCollection.insertOne(product);
      res.send(result);
    });

    // Delete product
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    // Update one for Advertizing
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const toggle = req.body;

      const updateDoc = {
        $set: {
          isAdvertized: toggle,
          // isAdvertized: {$not: isAdvertized}
        },
      };

      const options = { upsert: true };
      const result = await productsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // Updating all Products value

    app.get("/productsUpdate", async (req, res) => {
      const options = { upsert: true };
      const updateValue = {
        $set: {
          accountType: "Seller",
        },
      };

      const result = await productsCollection.updateMany(
        {},
        updateValue,
        options
      );
      res.send(result);
    });

    // ..............................................................................
    // Booking Information
    // ..............................................................................

    app.get("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const bookings = await bookingCollection.findOne(query);
      res.send(bookings);
    });

    app.get("/bookings", async (req, res) => {
      const buyerEmail = req.query.buyerEmail;
      console.log(buyerEmail);
      let query = {};
      if (buyerEmail) {
        query = { buyerEmail: buyerEmail };
      }
      const bookings = await bookingCollection.find(query).toArray();
      res.send(bookings);
    });

    app.post("/bookings", async (req, res) => {
      let booking = req.body;

      if (booking) {
        booking = {
          ...booking,
          Timestamp: new Date(),
        };
      }

      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });

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
      const accountType = req.query.accountType;

      let query = {};

      if (email) {
        query = { email: email };
      }

    

      const users = await usersCollection.find(query).toArray();

      res.send(users);
    });

    // get all users
    app.get("/sellers", async (req, res) => {
      const email = req.query.email;
      const accountType = req.query.accountType;

      let query = {};

      if (accountType) {
        query = { accountType: "Seller" };
      }

      const users = await usersCollection.find(query).toArray();

      res.send(users);
    });
    // get all users
    app.get("/Buyers", async (req, res) => {
      const email = req.query.email;
      const accountType = req.query.accountType;

      let query = {};

      if (accountType) {
        query = { accountType: "Buyer" };
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

    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const toggle = req.body;
      // productUserVerifing(id, toggle)

      const updateDoc = {
        $set: {
          isVerified: toggle,
        },
      };

      const options = { upsert: true };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
    });

    // const productUserVerifing  = (userId, toggle) => {
    //   app.get("/products", async (req, res) => {
    //     const query= req.query.isVerified
    //     console.log(query)
    //     console.log(userId, toggle)
    //     // const filter= {_id: ObjectId(id)}

    //     // const updateDoc = {
    //     //   $set: {
    //     //     isVerified: toggle

    //     //   },
    //     // };

    //     // const options = { upsert: true };
    //     // const result= await productsCollection.updateOne(filter, updateDoc, options)
    //     // res.send(result)
    //   })
    // }

    // Delete user

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    // ..............................................................................
    // Blog Posts
    // ..............................................................................
    app.get("/blogs/:id", async (req, res) =>
      res.send(await blogsCollection.findOne({ _id: ObjectId(req.params.id) }))
    );

    app.get("/blogs", async (req, res) =>
      res.send(await blogsCollection.find({}).toArray())
    );

    app.get("/updateBlogs", async (req, res) => {
      const options = { upsert: true };
      const updateValue = {
        $set: {
          Timestamp: new Date(),
        },
      };
      const result = await blogsCollection.updateMany({}, updateValue, options);
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
