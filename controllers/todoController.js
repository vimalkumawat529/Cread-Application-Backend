const Todo = require("../models/todoModel");

const addTodo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file ? `${req.file.path}` : undefined;
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const todoData = new Todo({ title, description, image });
    await todoData.save();
    res.status(201).json({
      success: true,
      message: "Todo created successfully!",
      data: todoData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllTodo = async (req, res) => {
  try {
    const todos = await Todo.find({});
    res.status(200).json({ success: true, data: todos, total: todos.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const image = req.file ? req.file.path : undefined;
    const updateTodo = await Todo.findByIdAndUpdate(
      id,
      { title, description, ...(image && { image }) },
      { new: true }
    );
    console.log(updateTodo);
    if (!updateTodo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      data: updateTodo,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addTodo, getAllTodo, updateTodo };
