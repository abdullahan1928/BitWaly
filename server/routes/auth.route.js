const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const { signupController, signinController, getUserController } = require("../controllers/auth.controller");
const fetchUser = require("../middleware/fetchUser");

//ROUTE1: creating a user        /auth/signup,    NO AUTHENTICATION/LOGIN REQUIRED
router.post('/signup', [
    body('email').not().isEmpty().withMessage('Email is required').isEmail(),
    body('password').not().isEmpty().withMessage('Password is required').isLength({ min: 5 })
], signupController);


//ROUTE2: authenticating a user  /auth/signin,    NO AUTHENTICATION/LOGIN REQUIRED
router.post('/signin', [
    body('email').not().isEmpty().withMessage('Email is required').isEmail(),
    body('password').not().isEmpty().withMessage('Password is required').isLength({ min: 5 })
], signinController);


//ROUTE3: get logged in user details  /auth/getuser,    AUTHENTICATION/LOGIN REQUIRED
router.post('/getuser', fetchUser, getUserController);

module.exports = router;