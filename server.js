const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const dotenv = require("dotenv").config();
const connectDB = require("./config/database");
const authRouter = require("./routes/authRoute");
const todoRouter = require("./routes/todoRoute");
const path = require("path");
const port = process.env.PORT || 3000;
app.use(cookieParser());
// Middleware to parse JSON requests
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Add image static path
app.use("/upload", express.static(path.join(__dirname, "upload")));

// Routes
app.use("/api/v1", authRouter);
app.use("/api/v1", todoRouter);

// Database Connection and Server Start
connectDB().then(() => {
  console.log("Database connected successfully");
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
