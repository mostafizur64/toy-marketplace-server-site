const express = require('express');
const app = express()
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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


        //get All toys =
        app.get('/allToys', async (req, res) => {
            const result = await addToysCollections.find().toArray()
            res.send(result);
        })

        app.get('/allToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await addToysCollections.findOne(query);
            res.send(result)

        })
        //specific data find =
        app.get('/myToys', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }

            }
            const result = (await addToysCollections.find(query).toArray());
            res.send(result)
        })



        // // update the toys ==
        app.patch('/myToys/:id', async (req, res) => {
            const id = req.params.id;
            const options = { upsert: true };
            const filter = { _id: new ObjectId(id) }
            const updateToys = req.body;
            const coffee = {
                $set: {
                    price: updateToys.price,
                    quantity: updateToys.quantity,
                    description: updateToys.description,
                    rating: updateToys.rating,
                }
            }
            const result = await addToysCollections.updateOne(filter, coffee, options);
            res.send(result);
        })

        // Add toys 
        app.post('/addToys', async (req, res) => {
            const addToys = req.body;
            const result = await addToysCollections.insertOne(addToys);
            res.send(result);
            console.log(addToys);
        })

        app.delete('/myToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await addToysCollections.deleteOne(query);
            res.send(result);
        })

        //Search the toy name
        app.get('/getToyName/:text', async (req, res) => {
            const searchText = req.params.text;
            const result = await addToysCollections.find({
                $or: [
                    {
                        ToysName: { $regex: searchText, $options: "i" }
                    },
                ],
            }).toArray();
            console.log(result);
            res.send(result);
        });
        //sub category 
        //get All toys
        app.get('/subCategory/:categoryName', async (req, res) => {
            const query = req.params.categoryName
            const filter = { Subcategory: query }
            const result = await addToysCollections.find(filter).toArray()


            res.send(result);
        })

  //sort data
  app.get('/shortAssending',async(req,res)=>{
    const cursor = addToysCollections.find().sort({price:1});
    const result = await cursor.toArray();
    res.send(result);

  })
  app.get('/shortDesending',async(req,res)=>{
    const cursor = addToysCollections.find().sort({price:-1});
    const result = await cursor.toArray();
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
    res.send('animal toys are running')

})
app.listen(port, () => {
    console.log(`animal toy server is running on port ${port}`);
})