const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
require("dotenv/config");

//BodyParser Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb" }));

//DB Congif
const db = process.env.MongoURI;

//Connect to Mongo
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.log(err));

//Use routes
app.use("/api/projects", require("./routes/api/projects"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/update", require("./routes/api/update"));

//Server static assets if in production

if (process.env.NODE_ENV === "production") {
  //Set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
//Run server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server Started on port ${port}`));
