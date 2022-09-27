const express = require("express");
const cors = require("cors");
const logging = require("./middleware/logging.middleware");
const mongoose = require("mongoose");

require('dotenv').config();

// Controllers
const auth = require("./controllers/v1/auth.controller");
const users = require("./controllers/v1/users.controller");

const app = express();
const port = 3000;

mongoose.connect(
  `${process.env.DB_CONNECT_STRING}`,
  {
    // Configuration options to remove deprecation warnings, just include them to remove clutter
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
);
const db = mongoose.connection;

let db_status = 'MongoDB connection not successful';

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => db_status = 'Successful opened connection to database!');

// The order is intentional for middleware use statements, don't change unless you know what you are doing.
app.use(cors());
app.use(express.json());
app.use(logging);

// Routes
app.use("/v1/auth", auth);
app.use("/v1/users", users);

// Catch-all route, should always be defined last
app.use("*", (request, response) => {
  response.send("Undefined route, please see documentation.");
});

// Fire this thing up
app.listen(port, (error) => {
  if (error) {
    console.error("Error when starting server ", error);
  } else {
    console.log(`Listening of port ${port}`);
  }
});
