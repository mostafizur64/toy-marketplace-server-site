const express = require('express');
const app = express()
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
const cors = require('cors')

//middleware
app.use(cors())
app.use(express.json())


//RcF1EhFFmdtRXC8T
//animalToys


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sat5t4p.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
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

        const addToysCollections = client.db('animalToys').collection('addToys')


        //get All toys
        app.get('/allToys',async(req,res)=>{
            const result = await addToysCollections.find().toArray()
            res.send(result);
        })

        // Add toys 
        app.post('/addToys', async (req, res) => {
            const addToys = req.body;
            const result = await addToysCollections.insertOne(addToys);
            res.send(result);
            console.log(addToys);
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
    res.send('animal toys are running')

})
app.listen(port, () => {
    console.log(`animal toy server is running on port ${port}`);
})