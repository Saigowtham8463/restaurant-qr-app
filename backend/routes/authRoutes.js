const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const Admin = require("../models/Admin")

// Register Admin (run once)
router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const admin = new Admin({
      username: req.body.username,
      password: hashedPassword
    })

    await admin.save()

    res.json({ message: "Admin created" })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


// Login Admin
router.post("/login", async (req, res) => {
  try {
    const admin = await Admin.findOne({ username: req.body.username })

    if (!admin) {
      return res.status(400).json({ message: "User not found" })
    }

    const isMatch = await bcrypt.compare(
      req.body.password,
      admin.password
    )

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" })
    }

    const token = jwt.sign(
      { id: admin._id },
      "secretkey",
      { expiresIn: "1d" }
    )

    res.json({ token })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router