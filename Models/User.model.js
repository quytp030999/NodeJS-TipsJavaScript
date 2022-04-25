const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const { mongooseTutorial } = require("../Helpers/connections_multi_mongodb");

const UserSchema = new Schema({
  username: {
    type: String,
    require: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
});

UserSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(this.password, salt);
    this.password = hashPassword;
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.isCheckPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.log("error compare password", error);
    return false;
  }
};

module.exports = mongooseTutorial.model("users", UserSchema);
