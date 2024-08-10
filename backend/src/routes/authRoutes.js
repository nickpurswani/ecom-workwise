
const express = require('express');
const { signUp, login, getUser, updateUserData } = require('../controllers/authController');
const { authUserMiddleware } = require("../middlewares/auth.middleware");
const router = express.Router();
// .put( authUserMiddleware ,updateUserData)
router.route("/").post(signUp).get( authUserMiddleware, getUser );
router.route("/login").post(login);

module.exports = router;
