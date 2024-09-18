import express from "express";
require("express-async-errors");
// const sequelize = require("./database/database");
import jwt from "jsonwebtoken";
import User from "./model/user.model";
// import UserMeta from "./model/userMeta.model";
import apiRouter from "./routes/api";
// import { colorLog, middlewareRoleManager } from "./utility/helper/helper";
// import ProfileRouter from "./routes/profile.route";
// import migration from "./migrations";
import bodyParser  from 'body-parser';
import mongoose from "mongoose"
import cors from "cors"

require("dotenv").config();
const app = express();

// Configure CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3002"); // Adjust the allowed origin as needed
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Set up body-parser middleware for parsing JSON and URL-encoded bodies
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.json())
app.use(cors())

// Set up routes
app.use("/auth", apiRouter);
// app.use("/auth/profile", ProfileRouter);

// Function to synchronize the database tables
async function syncDatabase() {
  try {
    // Assuming you have already connected to MongoDB using mongoose.connect somewhere in your app
    console.log("Mongoose is connected and ready to interact with the User collection.");
  } catch (error) {
    // console.log(colorLog("Error while trying to connect or initialize the User collection", "BgRed"));
  }
  

  try {
    // Ensure that the connection to the MongoDB database is established.
    // Assuming you're connected to MongoDB with mongoose.connect somewhere earlier in your app.
    
    console.log("UserMeta collection is ready.");
  
    // Call your migration function
    // migration();
  } catch (error) {
    console.log(
      // colorLog("Error while interacting with the UserMeta collection", "BgRed")
    );
  }
  
}
syncDatabase();

// Sync the sequelize instance with the database
mongoose
  .connect('mongodb+srv://Gourav:Gourav56@naturopura.zbmve.mongodb.net/?retryWrites=true&w=majority&appName=Naturopura', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });


const port = process.env.PORT || 4000;
app.listen(port, () => {
  // console.log(colorLog(`Auth Service at ${port}`, "BgGreen"));
});
