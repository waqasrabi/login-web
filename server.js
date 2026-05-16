
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

//below is for locally istalled mongodb with mongoose layer
//mongoose.connect("mongodb://127.0.0.1:27017/loginDB")
//.then(() => console.log("Database connected"))
//.catch(err => console.log(err));

// and now for cloud database with env as isntalled above


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Database connected"))
.catch(err => console.log(err));

const User = mongoose.model("User", {
  username: String,
  password: String
});






app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ message: "All fields required" });
  }

  let existingUser = await User.findOne({ username });

  if (existingUser) {
    return res.json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    username,
    password: hashedPassword
  });

  res.json({ message: "User created successfully" });
});





app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  let user = await User.findOne({ username });

  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.json({ success: false, message: "Wrong password" });
  }

  // 🔐 CREATE TOKEN
  const token = jwt.sign(
    { id: user._id, username: user.username },
    "secretKey123",
    { expiresIn: "1h" }
  );

  res.json({
    success: true,
    message: "Login successful",
    token: token
  });
});







function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; 
  // format: "Bearer TOKEN"

  jwt.verify(token, "secretKey123", (err, decoded) => {
    if (err) {
      return res.json({ success: false, message: "Invalid token" });
    }

    req.user = decoded; // attach user data to request
    next(); // continue to route
  });
}

app.get("/dashboard-data", verifyToken, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to dashboard",
    user: req.user
  });
});






const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});









