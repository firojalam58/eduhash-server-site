const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

require('dotenv').config();


// middleware 
app.use(cors())
app.use(express.json())

// pass : EW2edBvJJ4rLXqfZ
// pass : assignment

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bjrjkm4.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        const serviceCollection = client.db('sports').collection('services');
        const reviewCollection = client.db('sports').collection('review')

        app.get('/services', async(req, res)=>{
            const size  = parseInt(req.query.size);
            const query = {};
            const cursor = serviceCollection.find(query);
            const result = await cursor.limit(size).toArray()
            const count = await serviceCollection.estimatedDocumentCount()
            res.send({count,result});
        })

        app.get('/service', async(req, res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const result = await cursor.toArray()
            res.send(result);
        })


     app.get('/service/:id', async(req, res)=>{
        const id = req.params.id;
        const query ={_id: ObjectId(id)}
        const service = await serviceCollection.findOne(query)
        res.send(service)
     });

     app.get('/reviews', async(req, res)=>{
        const query = {};
        const cursor =  reviewCollection.find(query)
        const result = await cursor.toArray()
        res.send(result)
     });

    //  review 
    app.post('/review', async(req, res)=>{
        const query = req.body
        const result = await reviewCollection.insertOne(query)
        res.send(result)
    });


    // service added 
    app.get('/user', async (req, res) => {
        const cursor = serviceCollection.find({});
        const users = await cursor.toArray();
        res.send(users);
    })

    app.post('/user', async (req, res) => {
        const user = req.body;
        const result = await serviceCollection.insertOne(user)
        console.log(result);
        user._id = result.insertedId
        res.send(user)
    });


    app.get('/clientEmail', async(req, res)=>{
        let query = req.query.email
        if(req.query.email){
            query = {email: req.query.email }

        }
        const cursor =  reviewCollection.find(query)
        const result = await cursor.toArray()
        res.send(result)
    });


    // for delete
    app.delete('/delete/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await reviewCollection.deleteOne(query);
        res.send(result);
     });

     app.get('/reviews/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const user = await reviewCollection.findOne(query);
        res.send(user);
     });

     //for update
     app.patch('/reviews/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const user = req.body;
        const option = { upsert: true };
        const updateUser = {
           $set: {
              name: user.name,
              message: user.message
           }
        }
        const result = await reviewCollection.updateOne(filter, updateUser, option);
        res.send(result)
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