const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const usersFilePath = path.join(__dirname, "../../data/users.json");
const JWT_SECRET = process.env.TOKEN_SECRET;

if (!JWT_SECRET) {
  throw new Error("TOKEN_SECRET is not defined in .env file");
}

// Simple token blacklist (not for production)
let blacklistedTokens = [];

// Helper: Read users JSON
const readUsers = () => {
  try {
    const data = fs.readFileSync(usersFilePath, "utf8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
};

// Helper: Write users JSON
const writeUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// Register user
const register = (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required, including role" });
  }

  if (!["admin", "user"].includes(role)) {
    return res.status(400).json({ error: "Invalid role selected" });
  }

  const users = readUsers();
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: "Email already registered" });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: "Server error" });

    const newUser = {
      id: Date.now(),
      name,
      email,
      role,
      passwordHash: hash,
    };

    users.push(newUser);
    writeUsers(users);

    res.status(201).json({ message: "User registered successfully" });
  });
};

// Login user
const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const users = readUsers();
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  bcrypt.compare(password, user.passwordHash, (err, result) => {
    if (err || !result) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  });
};

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Token missing" });
  if (blacklistedTokens.includes(token)) return res.status(403).json({ error: "Token is blacklisted" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    req.token = token;
    next();
  });
};

// Logout (blacklist token)
const logout = (req, res) => {
  const token = req.token;
  blacklistedTokens.push(token);
  res.json({ message: "Logged out successfully" });
};

// Get all users (protected)
const getAllUsers = (req, res) => {
  const users = readUsers();
  res.json(users);
};

module.exports = {
  register,
  login,
  logout,
  getAllUsers,
  authenticateToken
};
