const express = require("express")
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const {Listing} = require('../models/listing.js');
const ExpressError = require('../utils/ExpessError.js');
const {listingschema} = require('../schema.js');



function validateListing(req, res, next) {
    const { error } = listingschema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else {
        next();
    }
}


// Index route to display all listings
router.get('/',wrapAsync(async (req, res) => {
    try {
        const allListings = await Listing.find({});
        console.log("listing is done");
        res.render('listings/index.ejs', {allListings });
    } catch (err) {
        console.error("Error fetching listings:", err);
        res.status(500).send("Internal Server Error");
    }
}));
//adding a new listing
router.get('/new', (req, res) => {
    res.render('listings/new.ejs');
});


// Create route to handle form submission and save new listing to the database
router.post('/', wrapAsync(async (req, res) => {
    try {
        const newListing = new Listing(req.body);
        await newListing.save();
        req.flash("success" ," new listing Created!");
        res.redirect('/listings');
        console.log("New listing created successfully");
    } catch (err) {
        console.error("Error creating listing:", err);
        res.status(500).send("Internal Server Error");
    }
}));

//edit route to display the edit form for a specific listing by ID
router.get('/:id/edit',wrapAsync(async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        
        res.render('listings/edit.ejs', { listing });
    } catch (err) {
        console.error("Error fetching listing for edit:", err);
        res.status(500).send("Internal Server Error");
    }
}));

//edit route to handle form submission and update the listing in the database
router.put('/:id', wrapAsync(async (req, res) => {
    try {
        const { id } = req.params;
        await Listing.findByIdAndUpdate(id, req.body);
         req.flash("success" ," Updated listing!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error("Error updating listing:", err);
        res.status(500).send("Internal Server Error");
    }
}));


 // Delete route to handle deletion of a specific listing by ID
router.delete('/:id', wrapAsync(async (req, res) => {
    try {
        const { id } = req.params;
        await Listing.findByIdAndDelete(id);
         req.flash("success" ," Deleted listing!");
        res.redirect('/listings');
        
    } catch (err) {
        console.error("Error deleting listing:", err);
        res.status(500).send("Internal Server Error");
    }
}));


// show route to display a specific listing by ID
router.get('/:id',wrapAsync(async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id).populate('reviews');
        res.render('listings/show.ejs', { listing });
    } catch (err) {
        console.error("Error fetching listing:", err);
        res.status(500).send("Internal Server Error");
    }
}));

module.exports = router;