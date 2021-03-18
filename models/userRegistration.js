const mongoose = require("mongoose");

const userRegistrationSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  secondName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required:true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/.test(v);
      },

      message: "{VALUE} is not a valid email!",
    },
  },
  addresses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Address'
  }]
});

module.exports = mongoose.model("register", userRegistrationSchema);
