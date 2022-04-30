const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k0zgs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("bagsQ").collection("products");

    //get all inventory
    app.get("/products", async (req, res) => {
      console.log("db connected");
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.json(products);
    });

    //add inventory
    app.post("/addinventory", async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    //find by id
    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
    });
    //update quantity
    app.patch("/update/:id", async (req, res) => {
      const id = req.params.id;
      const updatedQuantity = req.body.updatedQuantity;
      const filteredProduct = { _id: ObjectId(id) };
      console.log(id, updatedQuantity, filteredProduct);
      const updateDoc = {
        $set: {
          quantity: updatedQuantity,
        },
      };
      const updatedProduct = await productCollection.updateOne(
        filteredProduct,
        updateDoc
      );
      res.send(updatedProduct);
    });

    app.delete("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("bagsQ successfully connected");
});

app.listen(port, () => {
  console.log("Listening bagsQ from port", port);
});
