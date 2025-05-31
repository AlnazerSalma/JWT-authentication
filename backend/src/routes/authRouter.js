const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getAllUsers,
  authenticateToken
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticateToken, logout);
router.get("/", authenticateToken, getAllUsers); // Protected

module.exports = router;
