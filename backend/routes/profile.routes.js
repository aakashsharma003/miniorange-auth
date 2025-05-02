const express = require("express")
const router = express.Router()
const authController = require("../controllers/auth.controller")
const { authenticateToken } = require("../middlewares/auth.middleware")

// Auth routes
router.get("/",authenticateToken, (req, res) => {
    // console.log(req)
    console.log(req.user);
    res.json({user: req.user})
})

module.exports = router
