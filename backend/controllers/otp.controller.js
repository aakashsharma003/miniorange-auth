const OTP = require("../models/otp.model")
const nodemailer = require("nodemailer")
const User = require("../models/user.model")
const { generateTokens } = require("../utils/logger")
// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.example.com",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "your-email@example.com",
    pass: process.env.SMTP_PASSWORD || "your-password",
  },
})

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send OTP email
async function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: process.env.SMTP_FROM || '"Verification Service" <verify@example.com>',
    to: email,
    subject: "Your Email Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333; text-align: center;">Email Verification</h2>
        <p style="color: #666; font-size: 16px;">Please use the following code to verify your email address:</p>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
        <p style="color: #666; font-size: 14px;">If you didn't request this code, you can safely ignore this email.</p>
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}

// Controller methods
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" })
    }

    // Generate OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Check if an OTP already exists for this email and delete it
    await OTP.deleteMany({ email })

    // Store new OTP in MongoDB
    const newOTP = new OTP({
      email,
      otp,
      expiresAt,
    })
    await newOTP.save()

    // Send email
    await sendOTPEmail(email, otp)

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    })
  } catch (error) {
    console.error("Error sending OTP:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    })
  }
}
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "No OTP found for this email",
      });
    }

    if (Date.now() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    await OTP.deleteOne({ _id: otpRecord._id });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user found for this email",
      });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    
    user.refreshToken = refreshToken;
    user.isVerified = true; // ✅ mark user as verified
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      token: accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        verified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
    });
  }
};

