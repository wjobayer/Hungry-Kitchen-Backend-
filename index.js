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
    const ordersCollection = database.collection("orders");
    const usersCollection = database.collection("users");

    //Foods Collectios--------------------
    app.get("/foods", async (req, res) => {
      const cursor = foodsCollection.find({});
      const foods = await cursor.toArray();
      res.send(foods);
    });
    app.get("/foods/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await foodsCollection.findOne(query);
      res.json(result);
    });
    app.get("/category", async (req, res) => {
      const category = req.query.category;
      const query = { category: category };
      const cursor = foodsCollection.find(query);
      const categories = await cursor.toArray();
      res.json(categories);
    });
    // Orders collections ---------
    app.get("/orders", async (req, res) => {
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });
    // users collections ---------
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });
    app.get("/role", async (req, res) => {
      const role = req.query.role;
      const query = { role: role };
      const cursor = usersCollection.find(query);
      const orles = await cursor.toArray();
      res.json(orles);
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
