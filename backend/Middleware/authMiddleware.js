const jwt = require("jsonwebtoken");
const config = require("../config");

function authMiddleware(req, res, next) {
  const header = req.header("Authorization");
  if (!header) {
    return res.status(401).send({
      message: "Access denied. no token provided",
    });
  }
  const token = header.replace("Bearer", "").trim();
  try {
    const decodedUser = jwt.verify(token, config.secret);
    req.user = decodedUser;
    next();
  } catch (error) {
    console.log("JWT verification error:", error); // Log any errors
    return res.status(400).send({
      message: "Invalid token..",
    });
  }
}

module.exports = authMiddleware;