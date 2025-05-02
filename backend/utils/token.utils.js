const jwt = require("jsonwebtoken")
const { JWT_SECRET, JWT_REFRESH_SECRET } = require("../config/env")

exports.generateTokens = (user) => {
  const accessToken = jwt.sign({ id: user._id, email: user.email, username: user.username }, JWT_SECRET, {
    expiresIn: "1h",
  })

  const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, { expiresIn: "7d" })

  return { accessToken, refreshToken }
}

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}
