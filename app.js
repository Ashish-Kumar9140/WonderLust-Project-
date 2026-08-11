const express = require('express');
const app = express();
const mongoose = require('mongoose');
const mon_url = "mongodb://127.0.0.1:27017/wanderlust1";
const path = require('path');
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
const ExpressError = require('./utils/ExpessError.js');
const Review = require('./models/reviews.js');

const listings = require("./routers/listing.js");
const reviews = require("./routers/review.js");



// Define the port number for the server to listen on
const port = 8000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, 'public')));



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

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
 
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