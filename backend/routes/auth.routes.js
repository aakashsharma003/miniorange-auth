const express = require("express")
const router = express.Router()
const authController = require("../controllers/auth.controller")
const { authenticateToken } = require("../middlewares/auth.middleware")

// Auth routes
router.post("/register", authController.register)
router.post("/login", authController.login)
router.post("/refresh-token", authController.refreshToken)
router.post("/verify", authenticateToken, authController.verifyToken)

// OAuth routes
router.get("/google", authController.googleRedirect)
router.get("/google/callback", authController.googleCallback)
router.get("/facebook", authController.facebookRedirect)
router.get("/facebook/callback", authController.facebookCallback)

module.exports = router
