const express = require("express");
const routes = require("./routes/v1");
const mongoose = require("mongoose");
const captureDateMiddleware = require("./middleware/middleware");
const cors = require("cors");
const config = require("./config/config");
const DB_URI = config.mongoose.url;

const app = express();

app.use(cors());
app.use(express.json());

// NOTE - Uncomment in Milestone 5
// Middleware to log API request metadata
// app.use(captureDateMiddleware);

app.use("/v1", routes);

// TODO - Create a MongoDB connection using Mongoose

// Start the MongoDB and Node server
mongoose
  .connect(`${DB_URI}`)
  .then(() => {
    console.log("Connected to DB at", DB_URI);
    app.listen(8082, () => {
      console.log("Listening at port 8082 ...");
    });
  })
  .catch((e) => console.log("Failed to connect to DB", e));
