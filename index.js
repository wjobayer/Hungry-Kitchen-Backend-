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

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5ltnk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("database connected successfully");
    await client.connect();
    const database = client.db("hungry_kitchen");
    const foodsCollection = database.collection("foods");


app.get("/", (req, res) => {
  res.send("Hello From Newspaper database!");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
