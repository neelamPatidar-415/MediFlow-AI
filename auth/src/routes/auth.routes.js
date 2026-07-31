const express = require('express');
const router = express.Router();
const validator = require("../middlewares/validator.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const authController = require("../controllers/auth.controller");

router.post('/register',validator.registerUserValidations,authController.registerUser);
router.post('/login', validator.loginUserValidations,authController.loginUser);
router.get('/me',authMiddleware.authMiddleware,authController.getCurrentUser);
router.get('/logout', authController.logoutUser);
// Address routes
router.get('/users/me/address', authMiddleware.authMiddleware, authController.getUserAddress);
router.put('/users/me/address', authMiddleware.authMiddleware, validator.addUserAddressValidations, authController.addOrUpdateUserAddress);

module.exports = router;
