const User = require("../models/authModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userRegister = async (req, res) => {
  try {
    const { fullName, email, mobileNo, password } = req.body;

    if (!fullName || !email || !mobileNo || !password) {
      return res
        .status(400)
        .json({ success: false, message: "ALl fields are required" });
    }

    // Check if user already exists
    const userExits = await User.findOne({ email });
    if (userExits) {
      return res
        .status(400)
        .json({ success: false, message: "User already exits" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      email: email.toLowerCase(),
      mobileNo,
      password: hashedPassword,
    });
    await user.save();

    res
      .status(201)
      .json({ success: true, message: "User Registration successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for empty fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: false, // Client can access
      maxAge: 24 * 60 * 60 * 1000,
      secure: false, // Set to true in production (HTTPS)
      sameSite: "Lax", // Allows cookie for same-site requests
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

const userLogout = async (_, res) => {
  try {
    res.clearCookie("token");
    res
      .status(200)
      .json({ success: true, message: "User Logout Successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Logout failed, please try again" });
  }
};
module.exports = { userRegister, userLogin, userLogout };
