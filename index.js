const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require('jsonwebtoken');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


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
  const reportedProduct = client
    .db("indirect")
    .collection("reportedProduct");

  const blogsCollection = client.db("indirect").collection("blogsCollection");
  const paymentsCollection = client.db('indirect').collection('paymentsCollection');
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



    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
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

    // get all users for email
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

      const query = { accountType: "Seller" };

      const users = await usersCollection.find(query).toArray();

      res.send(users);
    });
    // get all users
    app.get("/Buyers", async (req, res) => {
      const email = req.query.email;
      const accountType = req.query.accountType;

      const query = { accountType: "Buyer" };

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

      let updateDoc = {};
      if (toggle) {
        updateDoc = {
          $set: {
            isVerified: toggle,
          },
        };
      }

      const options = { upsert: true };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
    });

    // Delete user

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    // ..............................................................................
    // Reported Product 
    // ..............................................................................

    app.delete("/reportedProduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reportedProduct.deleteOne(query);
      res.send(result);
    });

  app.get("/reportedProduct", async (req, res) =>
  res.send(await reportedProduct.find({}).toArray())
);


    app.post("/reportedProduct", async(req, res)=> {
      let product= req.body

      product = {
        ...product,
        Timestamp: new Date(),
      };

      const result = await reportedProduct.insertOne(product)
      res.send(result)
    })




    // ..............................................................................
    // Stripe Payment Method 
    // ..............................................................................

    app.post('/create-payment-intent', async (req, res) => {
      const booking = req.body;
      const price = booking.price;
      const amount = (price * 100);


      const paymentIntent = await stripe.paymentIntents.create({
          currency: 'INR',
          amount: amount,
          "payment_method_types": [
              "card"
          ]
      });
      res.send({
          clientSecret: paymentIntent.client_secret,
      });
  });

  app.post('/payments', async (req, res) =>{
      const payment = req.body;
      const result = await paymentsCollection.insertOne(payment);
      const id = payment.bookingId
      const filter = {_id: ObjectId(id)}
      const updatedDoc = {
          $set: {
              paid: true,
              transactionId: payment.transactionId
          }
      }
    
      const updatedResult = await bookingCollection.updateOne(filter, updatedDoc)
      res.send(result);
  })



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
