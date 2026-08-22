if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const mon_url = "mongodb://127.0.0.1:27017/wanderlust1";
const path = require('path');
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
const ExpressError = require('./utils/ExpessError.js');


const session = require('express-session');
const { MongoStore } = require("connect-mongo");

const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

const listingsRouter = require("./routers/listing.js");
const reviewsRouter = require("./routers/review.js");
const userRouter = require("./routers/user.js");


const dbUrl = process.env.ATLASDB_URL;


// Define the port number for the server to listen on
const port = process.env.PORT || 8000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, 'public')));



async function main() {
    await mongoose.connect(dbUrl);
}
main().then(() => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.log("MongoDB connection failed", err);
});

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600
});

store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
});
// session options
const sessioOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,

    },
};

// route to display the home page
//  

app.use(session(sessioOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


app.get("/demouser", async (req, res) => {
    let fakeUser = new User({
        email: "student@gmail.som",
        username: "delta-student",
    })

    let registeredUser = await User.register(fakeUser, "helloworld");
    res.send(registeredUser);
})

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.all('/*splat', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

// errorr handling middleware
app.use((err, req, res, next) => {
    // const { statusCode = 500 } = err;
    // if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    // res.status(statusCode).render('error.ejs', { err });

    res.render('error.ejs', { statusCode: err.statusCode || 400, errorMessage: err.message });
});



app.listen(port, () => {
    //    console.log(dbUrl)
    console.log(`Server is running on ${port}`);
})
// aaj 08 aug ko maine ish project ko github pe push kiya hu
//use this steps to push

//checking is git working or not
// git add .
// git commit -m "your message"
// git push