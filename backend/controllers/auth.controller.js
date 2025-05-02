const bcrypt = require("bcrypt")
const axios = require("axios")
const { v4: uuidv4 } = require("uuid")
const jwt = require("jsonwebtoken")
const User = require("../models/user.model")
const { generateTokens } = require("../utils/logger")
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  API_BASE_URL,
  FRONTEND_URL,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
} = require("../config/env")

console.log(GOOGLE_CLIENT_ID);
// Register a new user
// exports.register = async (req, res) => {
//   try {
//     const { username, email, password } = req.body

//     // Check if user already exists
//     const existingUser = await User.findOne({ $or: [{ email }, { username }] })
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" })
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10)
//     const hashedPassword = await bcrypt.hash(password, salt)

//     // Create new user
//     const user = new User({
//       username,
//       email,
//       password: hashedPassword,
//       profile: {
//         phone: "",
//         updatedAt: Date.now(),
//       },
//     })

//     await user.save()

//     res.status(201).json({ message: "User registered successfully" })
//   } catch (error) {
//     console.error("Registration error:", error)
//     res.status(500).json({ message: "Server error" })
//   }
// }
exports.register = async (req, res) => {
  try {
    const { username, name, email, password } = req.body

    // Username and phone number must be provided
    if (!username || !name) {
      return res.status(400).json({ message: "Username and name are required" });
    }

    // Use default email if not provided
    const userEmail = email || "add@gmail.com";

    // Check if user already exists (by email or username)
    const existingUser = await User.findOne({ $or: [{ email: userEmail }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password if provided
    let hashedPassword = "";
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Create new user
    const user = new User({
      username,
      email: userEmail,
      password: hashedPassword,
      profile: {
        name:name,
        updatedAt: Date.now(),
      },
    });
    console.log("user", user)

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
}


// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user)

    // Save refresh token to database
    user.refreshToken = refreshToken
    await user.save()

    res.json({
      token: accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Google OAuth redirect
exports.googleRedirect = (req, res) => {
  const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth"
  const redirectUri = `${API_BASE_URL}/auth/google/callback`
  // console.log(redirectUri);
  const url = `${googleAuthUrl}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=profile email`

  res.redirect(url)
}

// Google OAuth callback
// exports.googleCallback = async (req, res) => {
//   try {
//     const { code } = req.query

//     // Exchange code for tokens
//     const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
//       code,
//       client_id: GOOGLE_CLIENT_ID,
//       client_secret: GOOGLE_CLIENT_SECRET,
//       redirect_uri: `${API_BASE_URL}/auth/google/callback`,
//       grant_type: "authorization_code",
//     })

//     const { access_token } = tokenResponse.data

//     // Get user info
//     const userInfoResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
//       headers: { Authorization: `Bearer ${access_token}` },
//     })

//     const { id, email, name } = userInfoResponse.data

//     // Find or create user
//     let user = await User.findOne({ googleId: id })

//     if (!user) {
//       user = new User({
//         googleId: id,
//         email,
//         username: `google_${name.replace(/\s+/g, "_").toLowerCase()}_${uuidv4().substring(0, 8)}`,
//         profile: {
//           phone: "",
//           updatedAt: Date.now(),
//         },
//       })

//       await user.save()
//     }

//     // Generate tokens
//     const { accessToken, refreshToken } = generateTokens(user)

//     // Save refresh token
//     user.refreshToken = refreshToken
//     await user.save()

//     // Redirect to frontend with token
//     res.redirect(`${FRONTEND_URL}/oauth-callback?token=${accessToken}&refreshToken=${refreshToken}`)
//   } catch (error) {
//     console.error("Google OAuth error:", error)
//     res.redirect(`${FRONTEND_URL}/oauth-callback?error=Authentication failed`)
//   }
// }
// Google OAuth callback
exports.googleCallback = async (req, res) => {
  try {
    const { code } = req.query

    // Exchange code for tokens
    const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: `${API_BASE_URL}/auth/google/callback`,
      grant_type: "authorization_code",
    })

    const { access_token } = tokenResponse.data

    // Get user info
    const userInfoResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    })

    const { id, email, name } = userInfoResponse.data
    console.log("name", name);
    // Find or create user
    let user = await User.findOne({ googleId: id })
     console.log("before" , user);
    if (!user) {
      user = new User({
        googleId: id,
        email,
        username: `google_${name.replace(/\s+/g, "_").toLowerCase()}_${uuidv4().substring(0, 8)}`,
        profile: {
          name: name || "", // Save full name
          phone: "Not Provided", // Default phone if not available
          updatedAt: Date.now(),
        },
      })
      console.log("after" , user);
      await user.save()
    } else {
      // Update name and phone if needed
      if (!user.profile.name) {
        user.profile.name = name || "";
      }
      if (!user.profile.phone) {
        user.profile.phone = "Not Provided";
      }
      user.profile.updatedAt = Date.now();
      await user.save();
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user)

    // Save refresh token
    user.refreshToken = refreshToken
    await user.save()

    // Redirect to frontend with token
    res.redirect(`${FRONTEND_URL}/oauth-callback?token=${accessToken}&refreshToken=${refreshToken}`)
  } catch (error) {
    console.error("Google OAuth error:", error)
    res.redirect(`${FRONTEND_URL}/oauth-callback?error=Authentication failed`)
  }
}


// Facebook OAuth redirect
exports.facebookRedirect = (req, res) => {
  const facebookAuthUrl = "https://www.facebook.com/v12.0/dialog/oauth"
  const redirectUri = `${API_BASE_URL}/auth/facebook/callback`

  const url = `${facebookAuthUrl}?client_id=${FACEBOOK_APP_ID}&redirect_uri=${redirectUri}&scope=email`

  res.redirect(url)
}

// Facebook OAuth callback
exports.facebookCallback = async (req, res) => {
  try {
    const { code } = req.query

    // Exchange code for tokens
    const tokenResponse = await axios.get("https://graph.facebook.com/v12.0/oauth/access_token", {
      params: {
        client_id: FACEBOOK_APP_ID,
        client_secret: FACEBOOK_APP_SECRET,
        redirect_uri: `${API_BASE_URL}/auth/facebook/callback`,
        code,
      },
    })

    const { access_token } = tokenResponse.data

    // Get user info
    const userInfoResponse = await axios.get("https://graph.facebook.com/me", {
      params: {
        fields: "id,name,email",
        access_token,
      },
    })

    const { id, email, name } = userInfoResponse.data

    // Find or create user
    let user = await User.findOne({ facebookId: id })

    if (!user) {
      user = new User({
        facebookId: id,
        email: email || `fb_${id}@facebook.com`, // Facebook might not provide email
        username: `fb_${name.replace(/\s+/g, "_").toLowerCase()}_${uuidv4().substring(0, 8)}`,
        profile: {
          phone: "",
          updatedAt: Date.now(),
        },
      })

      await user.save()
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user)

    // Save refresh token
    user.refreshToken = refreshToken
    await user.save()

    // Redirect to frontend with token
    res.redirect(`${FRONTEND_URL}/oauth-callback?token=${accessToken}&refreshToken=${refreshToken}`)
  } catch (error) {
    console.error("Facebook OAuth error:", error)
    res.redirect(`${FRONTEND_URL}/oauth-callback?error=Authentication failed`)
  }
}

// Refresh token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" })
    }

    // Verify refresh token
    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET)

      // Find user with this refresh token
      const user = await User.findOne({ _id: decoded.id, refreshToken })

      if (!user) {
        return res.status(401).json({ message: "Invalid refresh token" })
      }

      // Generate new tokens
      const tokens = generateTokens(user)

      // Update refresh token in database
      user.refreshToken = tokens.refreshToken
      await user.save()

      res.json({
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      })
    } catch (error) {
      return res.status(401).json({ message: "Invalid refresh token" })
    }
  } catch (error) {
    console.error("Refresh token error:", error)
    res.status(401).json({ message: "Invalid refresh token" })
  }
}

// Verify token
exports.verifyToken = (req, res) => {
  // The auth middleware has already verified the token
  // and attached the user to the request
  res.json({ valid: true, user: req.user })
}
