const User = require("../models/userRegistration");

const getAllData = async (req, res) => {
  try {
    User.findOne({ _id: req.params.id })
      .populate("addresses")
      .then((user) => {
        res.json({
          error: 0,
          message: "fetched data successfully",
          data: [user],
        });
      });
  } catch (error) {
    res.json({
      err: 1,
      message: error.message,
      error,
    });
  }
};

module.exports = getAllData;
