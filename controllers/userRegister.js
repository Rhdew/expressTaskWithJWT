require("dotenv").config();
const User = require("../models/userRegistration");
const bcrypt = require("bcrypt");

const userRegister = async (req, res) => {
  try {
    let {
      firstName,
      secondName,
      userName,
      password,
      confirmPassword,
      email,
    } = req.body;
    let validatedPassword;
    if (password === confirmPassword) {
      const size = process.env.SALT;
      const salt = await bcrypt.genSalt(parseInt(size));
      validatedPassword = await bcrypt.hash(password, salt);
    } else {
      throw "password did not match";
    }
    let userRecord = await User.findOne({
      $or: [{ email: email }, { userName: userName }],
    });
    if (userRecord) {
      console.log("user");
      throw "username or email is already exist";
    }

    let userData = {
      firstName: firstName,
      secondName: secondName,
      userName: userName,
      password: validatedPassword,
      email: email,
    };
    let user = new User(userData);
    await user.save();

    res.json({
      error: 0,
      message: "registered successfully",
    });
  } catch (error) {
    res.json({
      err: 1,
      message: error.message,
      error,
    });
  }
};

module.exports = userRegister;