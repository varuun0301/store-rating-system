const express = require("express");
const router = express.Router();
const { User, Store, Rating } = require("../models");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const { Sequelize } = require("sequelize");

// ✅ Add new user
router.post("/add-user", authenticateToken, authorizeRoles("ADMIN"), async (req, res) => {
  try {
    const { name, email, password, role, address } = req.body;
    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
  return res.status(400).json({ message: "Email already exists" });
    }


    const user = await User.create({ name, email, password: hashedPassword, role, address });
    res.json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
});

// ✅ Add new store
router.post("/add-store", authenticateToken, authorizeRoles("ADMIN"), async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    const store = await Store.create({ name, email, address, ownerId });
    res.json({ message: "Store created successfully", store });
  } catch (error) {
    res.status(500).json({ message: "Error creating store", error });
  }
});

// ✅ View all users
router.get("/users", authenticateToken, authorizeRoles("ADMIN"), async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ["id", "name", "email", "role", "address"] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// ✅ View all stores with avg rating
router.get("/stores", authenticateToken, authorizeRoles("ADMIN"), async (req, res) => {
  try {
    const stores = await Store.findAll({
      attributes: [
        "id",
        "name",
        "email",
        "address",
        [Sequelize.fn("AVG", Sequelize.col("Ratings.rating")), "avgRating"]
      ],
      include: [{ model: Rating, attributes: [] }],
      group: ["Store.id"]
    });
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stores", error });
  }
});

// ✅ Dashboard stats
router.get("/dashboard", authenticateToken, authorizeRoles("ADMIN"), async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard stats", error });
  }
});

// Delete User
router.delete("/delete-user/:id", authenticateToken, authorizeRoles("ADMIN"), async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

// Delete Store
router.delete("/delete-store/:id", authenticateToken, authorizeRoles("ADMIN"), async (req, res) => {
  try {
    const deleted = await Store.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Store not found" });
    res.json({ message: "Store deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting store", error });
  }
});


module.exports = router;
