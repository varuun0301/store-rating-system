const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

//Middleware
const protectedRoutes = require("./routes/protected");
app.use("/dashboard", protectedRoutes);

// Routes
const authRoutes = require("./routes/auth");
console.log("Auth routes:", authRoutes);
app.use("/auth", authRoutes);

// rating and store routes
const userRoutes = require("./routes/user");
app.use("/user", userRoutes);

// owner routes
const ownerRoutes = require("./routes/owner");
app.use("/owner", ownerRoutes);

//admin routes
const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);



app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
