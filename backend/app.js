require('dotenv').config()
const cors = require('cors');

const express = require('express');
const app = express();

app.use(cors());

app.use(express.json())
const PORT = process.env.PORT
const DB_URL = process.env.MONGODB_URI


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