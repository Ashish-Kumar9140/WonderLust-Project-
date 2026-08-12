const express = require("express")
const router = express.Router({ mergeParams: true });

const Review = require("../models/reviews");
const {Listing} = require('../models/listing.js');
const { model } = require("mongoose");
const wrapAsync = require('../utils/wrapAsync.js');
const {listingschema,reviewSchema1} = require('../schema.js');
const ExpressError = require('../utils/ExpessError.js');

function validateReview(req, res, next) {
    const { error } = reviewSchema1.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else {
        next();
    }
}
//review route to handle submission of a new review for a specific listing by ID
//post route to handle submission of a new review for a specific listing by ID
router.post('/',validateReview,wrapAsync(async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        const newReview = new Review(req.body.review);
        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        res.redirect(`/listings/${id}`);
      
    } catch (err) {
        console.error("Error adding review:", err);
        res.status(500).send("Internal Server Error review post");
    }
}));


//reviews ka delete route ye hai 
router.delete("/:reviewId", wrapAsync(async (req ,res)=>{
    try{
        let {id , reviewId}= req.params;

    await Listing.findByIdAndUpdate(id ,{$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);

    }
    catch{
         console.error("Error adding review:", err);
        res.status(500).send("Internal Server Error review delete");
    }
    
}))

module.exports = router;

