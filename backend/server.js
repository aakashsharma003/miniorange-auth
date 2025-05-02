const express = require("express")
const cors = require("cors")
const { connectDB } = require("./config/db")
const { PORT } = require("./config/env")
const authRoutes = require("./routes/auth.routes")
const profileRoutes = require("./routes/profile.routes")
const otpRoutes = require("./routes/otp.routes")
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB
connectDB()

// Routes
app.use("/auth", authRoutes)
app.use("/profile", profileRoutes)
app.use("/verify", otpRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
