const User = require("../models/userRegistration");

const getPageData = async (req, res) => {
  try {
    let skip = req.params.page * 10;
    const userList = await User.find().skip(skip).limit(10);
    res.json({
      error: 0,
      message: "user list",
      data: [userList],
    });
  } catch (error) {
    res.json({
      err: 1,
      message: error.message,
      error,
    });
  }
};

module.exports = getPageData;
