const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/todo-app");
  } catch (error) {}
};

module.exports = connectDB;
