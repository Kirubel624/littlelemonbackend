const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const lowercaseEmail = email.toLowerCase(); // Convert email to lowercase

    // Check if the email is already registered
    const existingUserE = await User.findOne({ email: lowercaseEmail });
    const existingUserU = await User.findOne({ username: username });
    

    if (existingUserE || existingUserU) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ email: lowercaseEmail, password: hashedPassword, username });

    const data = {
      username: newUser.username,
      userID: newUser._id,
      email: newUser.email,
    };

    await newUser.save();
    console.log("User registered successfully");

    res.status(200).json({
      userID: data.userID,
      username: data.username,
      message: 'User registered successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login an existing user
exports.login = async (req, res) => {
  //console.log("it has gotten inside here!!!!!")
  try {
    const { email, password } =req.body;
    const lowercaseEmail = email.toLowerCase(); // Convert email to lowercase

//console.log(req.body)
    // Check if the email exists
    const user = await User.findOne({ email:lowercaseEmail });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

    res.status(200).json({ token, username: user.username, userID:user._id });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
