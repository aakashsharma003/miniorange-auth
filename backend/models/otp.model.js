const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 }); // Auto delete after 10 min

module.exports = mongoose.model("OTP", otpSchema);
