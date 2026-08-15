const express = require("express")
const router = express.Router({ mergeParams: true });

const Review = require("../models/reviews");
const { Listing } = require('../models/listing.js');
const { model } = require("mongoose");
const wrapAsync = require('../utils/wrapAsync.js');
const { listingschema, reviewSchema1 } = require('../schema.js');
const ExpressError = require('../utils/ExpessError.js');
const { isloggedIn, isOwner, validateListing, validateReview,isreviewAuthor } = require("../Middleware.js");


//review route to handle submission of a new review for a specific listing by ID
//post route to handle submission of a new review for a specific listing by ID
router.post(
    "/",
    isloggedIn,
    validateReview,
    wrapAsync(async (req, res) => {

        const { id } = req.params;

        const listing = await Listing.findById(id);

        const newReview = new Review(req.body.review);
        newReview.author = req.user._id;

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        req.flash("success", "New review created!");

        return res.redirect(`/listings/${id}`);
    })
);


//reviews ka delete route ye hai 
router.delete("/:reviewId",isloggedIn,isreviewAuthor, wrapAsync(async (req, res) => {
    try {
        let { id, reviewId } = req.params;

        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "  review deleted!");

        res.redirect(`/listings/${id}`);

    }
    catch {
        console.error("Error adding review:", err);
        res.status(500).send("Internal Server Error review delete");
    }

}))

module.exports = router;

