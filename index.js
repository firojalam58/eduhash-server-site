const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

require('dotenv').config();
console.log(process.env.DB_USER);


// middleware 
app.use(cors())
app.use(express.json())

// pass : EW2edBvJJ4rLXqfZ
// pass : assignment

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bjrjkm4.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        const serviceCollection = client.db('sports').collection('services');

        app.get('/services', async(req, res)=>{
            const size  = parseInt(req.query.size);
            const query = {};
            const cursor = serviceCollection.find(query);
            const result = await cursor.limit(size).toArray()
            const count = await serviceCollection.estimatedDocumentCount()
            res.send({count,result});
        })
        app.get('/services', async(req, res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const result = await cursor.toArray()
            res.send(result);
        })
    }
    finally{

    }
}

run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('Assignment 11 server running')
})


app.listen(port, () => {
    console.log(`mongodb projects run ${port}`);
})