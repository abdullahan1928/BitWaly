const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const { signupController } = require("../controllers/auth.controller");

//ROUTE1: creating a user        /auth/signup,    NO AUTHENTICATION/LOGIN REQUIRED
router.post('/signup', [
    body('email').not().isEmpty().withMessage('Email is required').isEmail(),
    body('password').not().isEmpty().withMessage('Password is required').isLength({ min: 5 })
], signupController);

module.exports = router;