const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

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
    app.use("/products", async (req, res) => {
      console.log("db connected");
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.json(products);
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
