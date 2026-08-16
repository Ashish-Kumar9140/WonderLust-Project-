const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require("../utils/ExpessError.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../Middleware.js");
const userControllers = require('../controllers/users.js');

module.exports.signupPage = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signupPOST = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });

        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(arr);
            }
            req.flash("success", "Welcome to wnaderlust");
            res.redirect("/listings");


        })


    } catch (e) {
        req.flash("error", "user already exist! Try another username");
        res.redirect('/signup');

    }
}

module.exports.loginGET = async (req, res) => {
    res.render("users/login.ejs");
}

module.exports.loginPOST =  async (req, res) => {
    req.flash("success", "Welcome back");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "logout confirmed!");
        res.redirect('/listings');
    });

}