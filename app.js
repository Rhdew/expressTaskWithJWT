require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const Register = require("./models/userRegistraion");
const Address = require("./models/address");

const router = express.Router();
const app = express();

mongoose
  .connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    reconnectTries: 30,
    reconnectInterval: 500,
    poolSize: 10,
    bufferMaxEntries: 0,
    autoIndex: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Link established to database");
  })
  .catch((err) => {
    console.log("No link to database.", err);
  });

router.post("/user/register", async (req, res) => {
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
      validatedPassword = await bcrypt.hash(password, 10);
    } else {
      throw "password did not match";
    }
    let userRecord = await Register.findOne({
      $or: [{ email: email }, { userName: userName }],
    });
    if (userRecord) {
      throw "username or email is already exist";
    }

    let userData = {
      firstName: firstName,
      secondName: secondName,
      userName: userName,
      password: validatedPassword,
      email: email,
    };
    let user = new Register(userData);
    await user.save();

    res.status(200).send("registered succefully");
  } catch (error) {
    res.status(500).send({
      error: error,
    });
  }
});

router.post("/user/login/:username/:password", async (req, res) => {
  try {
    let username = req.params.username;
    let password = req.params.password;
    const user = await Register.findOne({ userName: username });
    if (!user) {
      throw "user not found";
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw "not a valid password";
    }
    let accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: 180,
    });
    res.send(accessToken);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: error,
    });
  }
});

router.get("/user/get/:id", verifyToken, async (req, res) => {
  try {
    await Register.findOne({ _id: req.params.id })
      .populate("addresses")
      .then((user) => {
        res.json(user);
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: error,
    });
  }
});

router.put("/user/delete", verifyToken, async (req, res) => {
  try {
    await Register.findOneAndDelete({
      _id: req.headers.token,
    });
    res.send("user succesfully deleted");
  } catch (error) {
    res.status(500).send({
      error: error,
    });
  }
});

router.get("/user/list/:page", verifyToken, async (req, res) => {
  try {
    let skip = req.params.page * 10;
    const userList = await Register.find().skip(skip).limit(10);
    res.send(userList);
  } catch (error) {
    res.status(500).send({
      error: error,
    });
  }
});

router.post("/user/address", verifyToken, async (req, res) => {
  try {
    let { address, city, state, pinCode, phone } = req.body;
    let userId = req.headers.token;
    let userAddress = {
      userId: userId,
      address: address,
      city: city,
      state: state,
      pinCode: pinCode,
      phone: phone,
    };
    const userAddressData = new Address(userAddress);
    const addressData = await userAddressData.save();
    await Register.findOneAndUpdate(
      { _id: addressData.userId },
      { $push: { addresses: addressData._id } },
      { new: true }
    );
    res.send("address successfully saved");
  } catch (error) {
    res.status(500).send({
      error: error,
    });
  }
});

async function verifyToken(req, res, next) {
  try {
    jwt.verify(req.headers.token, process.env.SECRET_KEY);
    next();
  } catch (error) {
    res.status(500).send({
      error: error,
    });
  }
}

app.use(bodyParser.json());
app.use(router);
app.listen(3000, () => {
  console.log("connected ");
});
