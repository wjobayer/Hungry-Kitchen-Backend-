const express = require("express");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 8000;

app.use(cors());
app.use(fileUpload());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7xx1x.mongodb.net/hungry-kitchen?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("database connected successfully");
    await client.connect();
    const database = client.db("hungry-kitchen");
    const foodsCollection = database.collection("foods");

    // //GET Foots API
    app.get("/foods", async (req, res) => {
      const cursor = foodsCollection.find({});
      const foods = await cursor.toArray();
      res.send(foods);
    });
    app.get("/category", async (req, res) => {
      const category = req.query.category;
      const query = { category: category };
      const cursor = foodsCollection.find(query);
      const categories = await cursor.toArray();
      res.json(categories);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello From Hungry Kitchen database!");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
