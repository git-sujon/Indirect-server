const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors= require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
let jwt = require("jsonwebtoken");



app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.prabmlk.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



const run = async() => {

    const catagoriesCollection= client.db('indirect').collection('catagoriesCollection')
    const productsCollection= client.db('indirect').collection('productsCollection')


    try{








    }
    finally{

    }
}


app.get('/', (req, res)=> {
    res.send("Server Running")
})

app.listen(port, ()=> {
    console.log("Hey !!!" , port);
})
