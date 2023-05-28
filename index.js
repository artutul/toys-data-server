const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json());



const uri = `mongodb+srv://artutulbd3:1Q5sXkQR1jKDiC0v@toys-market.dt5xlxn.mongodb.net/?retryWrites=true&w=majority`;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@toys-market.dt5xlxn.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     },
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     maxPoolSize: 10,
// });
async function run() {
    // client.connect((error) => {
    //     if (error) {
    //         console.log(error)
    //         return;
    //     }
    // });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");


    const toysCollection = client.db('toysMarket').collection('toys_car');




    app.get('/toys', async (req, res) => {
        const cursor = toysCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })
    app.get('/toys/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id)
        const query = { _id: new ObjectId(id) };
        const result = await toysCollection.findOne(query);
        res.send(result)
    })
    // Create a MongoClient with a  object 
    app.get('/toyByCategory/:category', async (req, res) => {
        const toysCategory = req.params.category;
        console.log(toysCategory)

        const cursor = toysCollection.find({
            sub_category: req.params.category
        });
        const result = await cursor.toArray();
        res.send(result)
    })
    app.get('/mytoys', async (req, res) => {
        let query = {};
        if (req.query?.email) {
            query = { email: req.query.email }
        }
        console.log(query.email);
        const result = await toysCollection.find(query).toArray()
        res.send(result)
    })
    app.get("/toysBySearch/:text", async (req, res) => {
        const text = req.params.text;
        const result = await toysCollection
            .find({
                $or: [
                    { toys_name: { $regex: text, $options: "i" } },
                    { sub_category: { $regex: text, $options: "i" } },
                ],
            })
            .toArray();
        console.log(result)
        res.send(result);
    });
    app.post('/addtoys', async (req, res) => {
        const addedData = req.body;
        console.log(addedData)
        const result = await toysCollection.insertOne(addedData);
        res.send(result)
    })

    app.delete('/mytoys/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id)
        const query = { _id: new ObjectId(id) };
        const result = await toysCollection.deleteOne(query);
        res.send(result)
    })

    app.put("/updateToys/:id", async (req, res) => {
        const id = req.params.id;
        const body = req.body;
        console.log(body);
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
            $set: {
                toys_name: body.toys_name,
                sub_category: body.sub_category,
                quantity: body.quantity,
                price: body.price,
                toys_image: body.toys_image,
                rating: body.rating,
                description: body.description,
            },
        };
        const result = await toysCollection.updateOne(filter, updateDoc);
        res.send(result);
    });

}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello Toys Market')
})






app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})