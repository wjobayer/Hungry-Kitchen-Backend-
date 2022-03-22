const express = require("express");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;

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
    app.post("/foods", async (req, res) => {
      const foods = req.body;
      const saveFood = await foodsCollection.insertOne(foods);
      console.log(foods);
      res.json(saveFood);
    });
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

    app.delete("/foods/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const foods = await foodsCollection.deleteOne(filter);
      console.log(foods);
      res.send(foods);
    });

    app.get("/category", async (req, res) => {
      const category = req.query.category;
      const query = { category: category };
      const cursor = foodsCollection.find(query);
      const categories = await cursor.toArray();
      res.json(categories);
    });
    app.get("/mealTime", async (req, res) => {
      const mealTime = req.query.mealTime;
      const query = { mealTime: mealTime };
      const cursor = foodsCollection.find(query);
      const getMealTime = await cursor.toArray();
      res.json(getMealTime);
    });
    // Orders collections ---------
    app.get("/orders", async (req, res) => {
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });
    app.post("/orders", async (req, res) => {
      const orders = req.body;
      const result = await ordersCollection.insertMany(orders);
      res.json(result);
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

    // users data post to mongodb
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log("user result", result);
      res.json(result);
    });

    // make admin
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateUser = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateUser);
      res.json(result);
    });

    // check admin
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json(user);
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

// server link: https://hungry-kitchen-app.herokuapp.com/
