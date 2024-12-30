const express = require("express");
const {
  addTodo,
  getAllTodo,
  updateTodo,
} = require("../controllers/todoController");
const todoRouter = express.Router();

const multer = require("multer");
const isAuthenticated = require("../middlewares/isAuthenticated");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

todoRouter.post("/add-todo", isAuthenticated, upload.single("image"), addTodo);
todoRouter.get("/all-todo", isAuthenticated, getAllTodo);
todoRouter.put(
  "/update-todo/:id",
  isAuthenticated,
  upload.single("image"),
  updateTodo
);

module.exports = todoRouter;
