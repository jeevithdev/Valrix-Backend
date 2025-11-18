const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All Fields Required" });
    }

    const exsistingUser = await User.findOne({ email });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (exsistingUser) {
      return res.status(409).json({ message: "User Already Exists." });
    }
    const domainPatterns = [".edu", ".ac.in", ".edu.in"];
    const hasRollNumber = /\d+/.test(email);

    const validDomain = domainPatterns.some((p) => email.endsWith(p));

    if (!hasRollNumber || !validDomain) {
      return res.status(400).json({
        message: "Only valid college student email IDs are allowed",
      });
    }

    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    return res
      .status(201)
      .json({ message: "Registration Successful", user: { name, email } });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Registration Failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Both fields required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRETKEY, {
      expiresIn: "7d",
    });

    return res.json({
      message: "Login Successful",
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Login Failed" });
  }
};
