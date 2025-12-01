require('dotenv').config()

const express = require('express');
const app = express();
app.use(express.json())
const PORT = 3000;
const DB_URL = "mongodb://localhost:27017/TeamLiquid-DB"


const mongoose = require('mongoose')
mongoose.connect(DB_URL)
  .then(() => console.log("Connected to MongoDB!"))
  .catch(() => console.log("Fail connect to MongoDB!"));


const router = require('./routes/index');
app.use("/", router)

app.set('query parser', 'extended');

app.listen(PORT, (error) => {
  if (!error) (
    console.log("Server is listening on port", PORT)
  )
});

app.get("/", (req, res) => {
  try {
    res.send("Wellcome to Website eCommerce Team Liquid!")
  }
  catch {
    res.send("Error connecting to server!")
  }
})