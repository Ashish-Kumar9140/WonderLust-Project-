const express = require("express")
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require("../utils/ExpessError.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../Middleware.js");
const userControllers = require('../controllers/users.js');


router.get("/signup",userControllers.signupPage )

router.post("/signup", wrapAsync(userControllers.signupPOST));


router.get("/login", wrapAsync(userControllers.loginGET))

router.post("/login",saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),userControllers.loginPOST);

router.get("/logout", userControllers.logout);

module.exports = router;