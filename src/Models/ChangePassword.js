const mongoose = require("mongoose");
const { Schema } = mongoose;

const ChangePasswordSchema = new Schema(
  {
    email: {
      unique: true,
      required: true,
      type: String,
    },
    token: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ChangePassword", ChangePasswordSchema);
