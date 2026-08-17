const express = require("express")
const router = express.Router({ mergeParams: true });

const Review = require("../models/reviews");
const { Listing } = require('../models/listing.js');
const { model } = require("mongoose");
const wrapAsync = require('../utils/wrapAsync.js');
const { listingschema, reviewSchema1 } = require('../schema.js');
const ExpressError = require('../utils/ExpessError.js');
const { isloggedIn, isOwner, validateListing, validateReview,isreviewAuthor } = require("../Middleware.js");
const reviewControllers = require('../controllers/reviews.js');


//review route to handle submission of a new review for a specific listing by ID
//post route to handle submission of a new review for a specific listing by ID
router.post(
    "/",
    isloggedIn,
    // validateReview,
    wrapAsync(reviewControllers.createReview)
);



//reviews ka delete route ye hai 
router.delete("/:reviewId",isloggedIn,isreviewAuthor, wrapAsync(reviewControllers.deleteReview))

module.exports = router;

