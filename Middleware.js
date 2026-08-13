module.exports.isloggedIn=(req,res,next)=>{
    if (!req.isAuthenticated()) {
        req.flash("error", "Login first to creat Listings");
        return res.redirect("/login");
    }
    next();
}

 