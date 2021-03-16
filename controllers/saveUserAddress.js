const User = require("../models/userRegistration");
const Address = require("../models/address");

const saveUserAddress = async (req, res) => {
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
    await User.findOneAndUpdate(
      { _id: addressData.userId },
      { $push: { addresses: addressData._id } },
      { new: true }
    );
    res.json({
      error: 0,
      message: "address successfully saved",
    });
  } catch (error) {
    res.json({
      err: 1,
      message: error.message,
      error,
    });
  }
};
module.exports = saveUserAddress;
