const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile: mobile || ''
    });
    
    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        profileImage: user.profileImage,
        xp: user.xp,
        streak: user.streak
      }

    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Update last active
    user.lastActive = Date.now();
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        profileImage: user.profileImage,
        xp: user.xp,
        streak: user.streak
      }

    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Google Sign-In
router.post('/google', async (req, res) => {
  try {
    const { email, name, profileImage, googleId } = req.body;
    
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user if they don't exist
      user = await User.create({
        name,
        email,
        profileImage,
        googleId, // Store googleId for future reference
        password: await bcrypt.hash(Math.random().toString(36), 10), // Random password for social users
        mobile: ''
      });
    } else {
      // Update existing user with Google info if needed
      if (profileImage && !user.profileImage) {
        user.profileImage = profileImage;
      }
      if (!user.googleId) {
        user.googleId = googleId;
      }
      user.lastActive = Date.now();
      await user.save();
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      message: 'Google login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        profileImage: user.profileImage,
        xp: user.xp,
        streak: user.streak
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Profile
const auth = require('../middleware/auth');
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, mobile, profileImage } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name cannot be empty' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name;
    if (mobile !== undefined) {
      user.mobile = mobile;
    }
    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }
    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        profileImage: user.profileImage,
        xp: user.xp,
        streak: user.streak
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;