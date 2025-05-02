const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_REFRESH_SECRET } = require("../config/env");

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { id: user._id, email: user.email },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

const logLevels = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
}

const currentLogLevel = process.env.LOG_LEVEL ? logLevels[process.env.LOG_LEVEL] : logLevels.INFO

const logger = {
  error: (message, ...args) => {
    if (currentLogLevel >= logLevels.ERROR) {
      console.error(`[ERROR] ${message}`, ...args)
    }
  },
  warn: (message, ...args) => {
    if (currentLogLevel >= logLevels.WARN) {
      console.warn(`[WARN] ${message}`, ...args)
    }
  },
  info: (message, ...args) => {
    if (currentLogLevel >= logLevels.INFO) {
      console.info(`[INFO] ${message}`, ...args)
    }
  },
  debug: (message, ...args) => {
    if (currentLogLevel >= logLevels.DEBUG) {
      console.debug(`[DEBUG] ${message}`, ...args)
    }
  },
}

module.exports = {logger, generateTokens}
