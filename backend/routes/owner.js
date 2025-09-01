const express = require("express");
const router = express.Router();
const { Store, Rating, User } = require("../models");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const { Sequelize } = require("sequelize");

// ✅ Get all ratings for the owner’s store
router.get("/ratings", authenticateToken, authorizeRoles("OWNER"), async (req, res) => {
  try {
    const store = await Store.findOne({ where: { ownerId: req.user.id } });

    if (!store) {
      return res.status(404).json({ message: "No store found for this owner" });
    }

    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [{ model: User, attributes: ["id", "name", "email"] }]
    });

    res.json({ store: store.name, ratings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching ratings", error });
  }
});

// ✅ Get average rating of the owner’s store

router.get("/average-rating", authenticateToken, authorizeRoles("OWNER"), async (req, res) => {
  try {
    const store = await Store.findOne({ where: { ownerId: req.user.id } });

    if (!store) {
      return res.status(404).json({ message: "No store found for this owner" });
    }

    const avgRating = await Rating.findAll({
      attributes: [
        [Sequelize.fn("AVG", Sequelize.col("rating")), "avgRating"]
      ],
      where: { storeId: store.id },
      raw: true
    });
    console.log("AVG RESULT:", avgRating);


    res.json({
      store: store.name,
      averageRating: avgRating[0].avgRating ? parseFloat(avgRating[0].avgRating) : 0
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching average rating", error });
  }
});

// Add Store (Owner only)
router.post("/add-store", async (req, res) => {
  try {
    const { name, address } = req.body;

    if (!name || !address) {
      return res.status(400).json({ message: "Store name and address required" });
    }

    // store is linked with logged-in owner
    const newStore = await Store.create({
      name,
      address,
      ownerId: req.user.id, // comes from JWT token
    });

    res.json({ message: "Store added successfully", store: newStore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding store" });
  }
});



module.exports = router;
