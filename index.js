const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors= require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
let jwt = require("jsonwebtoken");



app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.prabmlk.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



const run = async() => {

    const catagoriesCollection= client.db('indirect').collection('catagoriesCollection')
    const productsCollection= client.db('indirect').collection('productsCollection')


    try{
        // Catagories 
        // ..............................................................................

        // get single Catagories  

        app.get('/catagories/:id', async(req, res)=> {
            const id= req.params.id
            const query= {_id: ObjectId(id)}
            const result= await catagoriesCollection.findOne(query)
            res.send(result)
        })

        // get all Catagories  
        app.get('/catagories', async(req, res)=> {
            const result= await catagoriesCollection.find({}).toArray()
            res.send(result)
        })

        // ..............................................................................
        // User 
        // ..............................................................................

        // get all users 
        app.get("/users", async (req, res) => {
            const authHeader = req.headers.authorization;
            const email = req.headers.email;
      
            const query = {};
            const users = await usersCollection.find(query).toArray();
      
            res.send(users);
          });




    }
    finally{

    }
}
run().catch(err=> console.log(err))








































app.get('/', (req, res)=> {
    res.send("Server Running")
})

app.listen(port, ()=> {
    console.log("Hey !!!" , port);
})
