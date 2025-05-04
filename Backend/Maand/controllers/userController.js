// controllers/userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Helper to get signed JWT
const getToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @desc    Register new user (Sign Up)
// @route   POST /api/users/signup
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, institution, gender, avatarUrl } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      institution,
      gender,
      avatarUrl
    });

    // Generate token
    const token = getToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Authenticate user (Sign In)
// @route   POST /api/users/signin
// @access  Public
exports.authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = getToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password -resetPasswordToken -resetPasswordExpires');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by email
// @route   GET /api/users/email/:email
// @access  Private
exports.getUserByEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      const err = new Error('User not found'); err.statusCode = 404;
      return next(err);
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user ID by email
// @route   GET /api/users/id/:email
// @access  Private
exports.getUserIdByEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      const err = new Error('User not found'); err.statusCode = 404;
      return next(err);
    }
    res.json({ uuid: user.uuid });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res, next) => {
  try {
    const updates = req.body;
    if (updates.password) delete updates.password; // password via reset only

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) {
      const err = new Error('User not found'); err.statusCode = 404;
      return next(err);
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};


// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -resetPasswordToken -resetPasswordExpires');
    if (!user) {
      const err = new Error('User not found'); err.statusCode = 404;
      return next(err);
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      const err = new Error('User not found'); err.statusCode = 404;
      return next(err);
    }
    res.json({ message: 'User removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/users/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error('No user with that email'); err.statusCode = 404;
      return next(err);
    }

    const resetToken = user.getResetPasswordToken();
    await user.save();

    const resetUrl = `${req.protocol}://${req.get('host')}/api/users/reset-password/${resetToken}`;
    const message = `You requested a password reset. Click here: ${resetUrl}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    await transporter.sendMail({
      to: user.email,
      from: process.env.FROM_EMAIL,
      subject: 'Password Reset',
      text: message
    });

    res.json({ message: 'Email sent with reset instructions' });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/users/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }
    }).select('+password');

    if (!user) {
      const err = new Error('Invalid or expired token'); err.statusCode = 400;
      return next(err);
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password updated' });
  } catch (error) {
    next(error);
  }
};