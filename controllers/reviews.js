const { Listing } = require('../models/listing.js');
const Review = require("../models/reviews");

    module.exports.createReview = async (req, res) => {

        const { id } = req.params;

        const listing = await Listing.findById(id);

        const newReview = new Review(req.body.review);
        newReview.author = req.user._id;

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        req.flash("success", "New review created!");

        return res.redirect(`/listings/${id}`);
    } 

    
    module.exports.deleteReview = async (req, res) => {
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

    }
    