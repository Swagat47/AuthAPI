const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

//DATABASE
const URI = process.env.MONGODB_URL;
// console.log(URI);
mongoose
  .connect(URI)
  .then(() => {
    console.log("Connected to MongoDB!!!");
  })
  .catch((err) => {
    console.log("Error: MongoDB Not connected");
  });

//MIDDLEWARE
app.use(express.json());

//ROUTES
const userRouter = require("./Routes/userRoutes");
app.use("/api", userRouter);

//SERVER LISTENING
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
