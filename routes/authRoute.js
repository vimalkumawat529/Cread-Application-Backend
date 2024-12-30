const express = require("express");
const {
  userRegister,
  userLogin,
  userLogout,
} = require("../controllers/authController");
const authRouter = express.Router();

authRouter.post("/register", userRegister);
authRouter.post("/login", userLogin);
authRouter.get("/logout", userLogout);

module.exports = authRouter;
