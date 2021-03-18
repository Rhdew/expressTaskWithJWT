const jwt = require("jsonwebtoken");
const verifyToken = async function verifyToken(req, res, next) {
  try {
    jwt.verify(req.headers.token, process.env.SECRET_KEY);
    next();
  } catch (error) {
    res.json({
      err: 1,
      message: error.message,
      error,
    });
  }
};
module.exports = verifyToken;
