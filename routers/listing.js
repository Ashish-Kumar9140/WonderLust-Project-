const express = require("express")
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { Listing } = require('../models/listing.js');
const ExpressError = require('../utils/ExpessError.js');
const { listingschema } = require('../schema.js');
const { isloggedIn, isOwner, validateListing } = require("../Middleware.js");
const listingsControllers = require('../controllers/listings.js');

const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })






// Index route to display all listings
router.get('/', wrapAsync(listingsControllers.index));

//adding a new listing
router.get('/new', isloggedIn,listingsControllers.renderNewForm);


// Create route to handle form submission and save new listing to the database
router.post('/', isloggedIn,upload.single('image[url]'), wrapAsync(listingsControllers.newlistingPost));



//edit route to display the edit form for a specific listing by ID
router.get('/:id/edit', isloggedIn, wrapAsync(listingsControllers.editFormRender));


//Update route to handle form submission and update the listing in the database
router.put('/:id', isloggedIn, isOwner, validateListing, wrapAsync(listingsControllers.udateEditformPUT));


// Delete route to handle deletion of a specific listing by ID
router.delete('/:id', isloggedIn, wrapAsync(listingsControllers.deleteListing));


// show route to display a specific listing by ID
router.get('/:id', wrapAsync(listingsControllers.showPage));


module.exports = router;