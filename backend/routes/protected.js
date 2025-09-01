const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

// Normal User Route
router.get("/user-dashboard", authenticateToken, authorizeRoles("USER"), (req, res) => {
  res.json({ message: "Welcome Normal User!", user: req.user });
});

// Store Owner Route
router.get("/owner-dashboard", authenticateToken, authorizeRoles("OWNER"), (req, res) => {
  res.json({ message: "Welcome Store Owner!", user: req.user });
});

// Admin Route
router.get("/admin-dashboard", authenticateToken, authorizeRoles("ADMIN"), (req, res) => {
  res.json({ message: "Welcome Admin!", user: req.user });
});

module.exports = router;
