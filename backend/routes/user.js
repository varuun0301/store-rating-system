const express = require("express");
const router = express.Router();
const { Store, Rating } = require("../models");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const { Sequelize } = require("sequelize");

// Get all stores with avg rating
router.get("/stores", authenticateToken, authorizeRoles("USER"), async (req, res) => {
  try {
    const stores = await Store.findAll({
      attributes: [
        "id",
        "name",
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

module.exports = router;
// Submit or Update rating
router.post("/rate", authenticateToken, authorizeRoles("USER"), async (req, res) => {
  try {
    const { storeId, rating } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const [newRating, created] = await Rating.upsert({
      storeId,
      userId: req.user.id,
      rating
    });

    res.json({ message: created ? "Rating added" : "Rating updated", rating: newRating });
  } catch (error) {
    res.status(500).json({ message: "Error submitting rating", error });
  }
});

