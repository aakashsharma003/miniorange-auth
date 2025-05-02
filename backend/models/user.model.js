const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for OAuth users
    googleId: { type: String },
    facebookId: { type: String },
    refreshToken: { type: String },
    profile: {
      name: { type: String},
      phone: { type: String },
      updatedAt: { type: Date, default: Date.now },
    },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("User", userSchema);
