const express = require("express")
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { Listing } = require('../models/listing.js');
const ExpressError = require('../utils/ExpessError.js');
const { listingschema } = require('../schema.js');
const { isloggedIn, isOwner, validateListing } = require("../Middleware.js");






// Index route to display all listings
router.get('/', wrapAsync(async (req, res) => {
    try {
        const allListings = await Listing.find({});
        console.log("listing is done");
        res.render('listings/index.ejs', { allListings });
    } catch (err) {
        console.error("Error fetching listings:", err);
        res.status(500).send("Internal Server Error");
    }
}));
//adding a new listing
router.get('/new', isloggedIn, (req, res) => {
    res.render('listings/new.ejs');
});


// Create route to handle form submission and save new listing to the database
router.post('/', isloggedIn, wrapAsync(async (req, res) => {
    try {
        const newListing = new Listing(req.body);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", " new listing Created!");
        res.redirect('/listings');
        console.log("New listing created successfully");
    } catch (err) {
        console.error("Error creating listing:", err);
        res.status(500).send("Internal Server Error");
    }
}));

//edit route to display the edit form for a specific listing by ID
router.get('/:id/edit', isloggedIn, wrapAsync(async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        res.render('listings/edit.ejs', { listing });
    } catch (err) {
        console.error("Error fetching listing for edit:", err);
        res.status(500).send("Internal Server Error");
    }
}));

//Update route to handle form submission and update the listing in the database
router.put('/:id', isloggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    try {
        const { id } = req.params;
        let listing = await Listing.findById(id);
        await Listing.findByIdAndUpdate(id, req.body);

        req.flash("success", " Updated listing!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error("Error updating listing:", err);
        res.status(500).send("Internal Server Error in updat.ejs");
    }
}));


// Delete route to handle deletion of a specific listing by ID
router.delete('/:id', isloggedIn, wrapAsync(async (req, res) => {
    try {
        const { id } = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success", " Deleted listing!");
        res.redirect('/listings');

    } catch (err) {
        console.error("Error deleting listing:", err);
        res.status(500).send("Internal Server Error");
    }
}));


// show route to display a specific listing by ID
router.get('/:id', wrapAsync(async (req, res) => {
    try {
        const { id } = req.params;

        const listing = await Listing.findById(id)
            .populate({ path: 'reviews', populate: { path: 'author'} })
            .populate('owner');

        if (!listing) {
            req.flash("error", "This listing does not exist");
            return res.redirect("/listings");
        }

        res.render('listings/show.ejs', { listing });
    } catch (err) {
        console.error("Error fetching listing:", err);
        res.status(500).send("Internal Server Error");
    }
}));

module.exports = router;