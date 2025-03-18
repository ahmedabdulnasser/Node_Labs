const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    const db = client.db("TestDB1");
    console.log("Connected to DB successfully.");
    return db;
  } catch (err) {
    console.error(err);
  }
}

module.exports = connectDB;
