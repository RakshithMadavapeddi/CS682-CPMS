const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    console.log(req.body); // Check if the request body contains the correct fields

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Validate user input
    if (!(email && password && role)) {
      return res.status(400).send('All input is required');
    }

    // Check if user already exist
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send('User Already Exist. Please Login');
    }

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      role: role.toLowerCase()
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: '2h'
      }
    );

    console.log(`User ${email} registered successfully`);

    // Return new user
    return res.status(201).json({ user, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res.status(400).send('All input is required');
    }

    // Validate if user exists in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: '2h'
        }
      );

      console.log(`User ${email} logged in successfully`);

      // Send user information
      return res.status(200).json({ user, token });
    }

    console.log(`Login failed for user ${email}`);

    return res.status(400).send('Invalid Credentials');
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Logout
exports.logout = (req, res) => {
    req.session.token = null;
    res.redirect('/');
  };

// Get authenticated user's info
exports.me = async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header is missing' });
      }
  
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
  
      const user = await User.findOne({ _id: decoded.user_id });
  
      console.log(`User ${user.email} authenticated successfully`);
  
      return res.status(200).json({ user });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Server error' });
    }
  };
