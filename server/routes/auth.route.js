// rotues for authetnication and account management
const express = require("express"); 
const router = express.Router();

// Importing middleware, controllers, and validators for handling user authentication and account management
const { body } = require('express-validator');
const { signupController, signinController, getUserController, updateNameController, updatePasswordController, deleteAccountController } = require("../controllers/auth.controller");
const fetchUser = require("../middleware/fetchUser");
const { dummyAccounts, DummyData } = require("../controllers/dummyData.controller");

// Defining routes for user authentication and account management
router.post('/signup', [
    body('email').not().isEmpty().withMessage('Email is required').isEmail(),
    body('password').not().isEmpty().withMessage('Password is required').isLength({ min: 5 }),
], signupController); // Route for user signup

router.post('/signin', [
    body('email').not().isEmpty().withMessage('Email is required').isEmail(),
    body('password').not().isEmpty().withMessage('Password is required').isLength({ min: 5 })
], signinController); // Route for user signin

router.get('/getUser', fetchUser, getUserController); // Route to get user details
router.put('/name', fetchUser, updateNameController); // Route to update user name
router.put('/password', fetchUser, updatePasswordController); // Route to update user password
router.delete('/', fetchUser, deleteAccountController); // Route to delete user account

router.get('/dummyAccounts', dummyAccounts); // Route to fetch dummy accounts
router.get('/dummyData', DummyData); // Route to fetch dummy data

module.exports = router; 
