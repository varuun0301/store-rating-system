const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

console.log("User model loaded:", User ? "✅" : "❌");

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role, address } = req.body;

    // validation checks
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      address,
    });

    res.json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

// Login
// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid password" });

    // create token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "1h" }
    );

    // ✅ Return role along with token
    res.json({ 
      message: "Login successful", 
      token, 
      role: user.role,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

module.exports = router;
