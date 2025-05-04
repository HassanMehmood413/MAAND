// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Public routes
router.post('/signup', userController.registerUser);
router.post('/signin', userController.authUser);

module.exports = router;