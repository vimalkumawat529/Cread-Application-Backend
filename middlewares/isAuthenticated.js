const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  try {
    //  Access token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Please login to access this resource.",
      });
    }

    const decodedObj = jwt.verify(token, process.env.JWT_SECRET);

    req.id = decodedObj.id; // Attach user ID to request
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please login again.",
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Authorization denied.",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }
};

module.exports = isAuthenticated;
