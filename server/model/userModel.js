const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  user: {
    type: String,
    min: 4,
    max: 24,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    trim: true,
  },
  tokens: [{   
    token: {
      type: String,
      required: true 
    }
  }],
  allMatrix: {
    type: Array,
  },
  result: {
    type: Array,
  },
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "ilovereact");

  user.tokens = user.tokens.concat({token})
  await user.save()
  return token
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  //delete userObject.tokens

  return userObject;
};

module.exports = mongoose.model("Users", userSchema);
