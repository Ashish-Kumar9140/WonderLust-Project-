const express = require('express');
const app = express();
const mongoose = require('mongoose');
const mon_url = "mongodb://127.0.0.1:27017/wanderlust1";
const {Listing} = require('./models/listing');
const path = require('path');
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpessError.js');
const {listingschema,reviewSchema1} = require('./schema.js');
const Review = require('./models/reviews.js');



// Define the port number for the server to listen on
const port = 8000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, 'public')));

function validateListing(req, res, next) {
    const { error } = listingschema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else {
        next();
    }
}


function validateReview(req, res, next) {
    const { error } = reviewSchema1.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else {
        next();
    }
}

async function main(){
    await mongoose.connect(mon_url);
}
main().then(() => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.log("MongoDB connection failed", err);
});



// route to display the home page
app.get('/', (req, res) => {
    res.send("Hello World");
});
// Index route to display all listings
app.get('/listings',wrapAsync(async (req, res) => {
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
app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
});


// Create route to handle form submission and save new listing to the database
app.post('/listings', wrapAsync(async (req, res) => {
    try {
        const newListing = new Listing(req.body);
        await newListing.save();
        res.redirect('/listings');
        console.log("New listing created successfully");
    } catch (err) {
        console.error("Error creating listing:", err);
        res.status(500).send("Internal Server Error");
    }
}));

//edit route to display the edit form for a specific listing by ID
app.get('/listings/:id/edit',wrapAsync(async (req, res) => {
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
app.put('/listings/:id', wrapAsync(async (req, res) => {
    try {
        const { id } = req.params;
        await Listing.findByIdAndUpdate(id, req.body);
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error("Error updating listing:", err);
        res.status(500).send("Internal Server Error");
    }
}));


 // Delete route to handle deletion of a specific listing by ID
app.delete('/listings/:id', wrapAsync(async (req, res) => {
    try {
        const { id } = req.params;
        await Listing.findByIdAndDelete(id);
        res.redirect('/listings');
        
    } catch (err) {
        console.error("Error deleting listing:", err);
        res.status(500).send("Internal Server Error");
    }
}));

//review route to handle submission of a new review for a specific listing by ID
//post route to handle submission of a new review for a specific listing by ID
app.post('/listings/:id/reviews',validateReview,wrapAsync(async (req, res) => {
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
        res.status(500).send("Internal Server Error");
    }
}));


//reviews ka delete route ye hai 
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req ,res)=>{
    let {id , reviewId}= req.params;

    await Listing.findByIdAndUpdate(id ,{$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}))


// show route to display a specific listing by ID
app.get('/listings/:id',wrapAsync(async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id).populate('reviews');
        res.render('listings/show.ejs', { listing });
    } catch (err) {
        console.error("Error fetching listing:", err);
        res.status(500).send("Internal Server Error");
    }
}));


 
app.all('/*splat', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

// errorr handling middleware
app.use((err, req, res, next) => {
    // const { statusCode = 500 } = err;
    // if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    // res.status(statusCode).render('error.ejs', { err });
    res.render('error.ejs', { statusCode: err.statusCode  || 400,errorMessage: err.message });
});



app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})
// aaj 08 aug ko maine ish project ko github pe push kiya hu 
//use this steps to push

//checking is git working or not
// git add .
// git commit -m "your message"
// git push