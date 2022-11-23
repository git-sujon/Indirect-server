const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors= require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
let jwt = require("jsonwebtoken");



app.use(cors())
app.use(express.json())




const uri = "mongodb+srv://<username>:<password>@cluster0.prabmlk.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


app.get('/', (req, res)=> {
    res.send("Server Running")
})

app.listen(port, ()=> {
    console.log("Hey !!!" , port);
})
