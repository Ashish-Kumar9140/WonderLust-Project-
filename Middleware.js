const { Listing } = require('./models/listing.js');
const Review = require('./models/reviews.js');
const ExpressError = require('./utils/ExpessError.js');
const { listingschema ,reviewSchema1} = require('./schema.js');


module.exports.isloggedIn=(req,res,next)=>{
    if (!req.isAuthenticated()) {
        req.session.redirectUrl =req.originalUrl;
        req.flash("error", "Login first to creat Listings");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res ,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    const { id } = req.params;
            let listing = await Listing.findById(id);
            if (
                res.locals.currUser &&
                !listing.owner._id.equals(res.locals.currUser._id)
            ) {
                req.flash("error", "You don't have access to update this listing");
                return res.redirect(`/listings/${id}`);
            }
            next();
}

module.exports.validateListing = (req, res, next)=> {
    const { error } = listingschema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
   
}

module.exports.validateReview= (req, res, next) =>{
    const { error } = reviewSchema1.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else {
        next();
    }
   
}

module.exports.isreviewAuthor = async (req, res, next) => {

    const { id, reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
};