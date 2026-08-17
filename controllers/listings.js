const { Listing } = require('../models/listing.js');


module.exports.index = async (req, res) => {
    try {
        const allListings = await Listing.find({});
        console.log("listing is done");
        res.render('listings/index.ejs', { allListings });
    } catch (err) {
        console.error("Error fetching listings:", err);
        res.status(500).send("Internal Server Error");
    }
}

module.exports.renderNewForm =  (req, res) => {
    res.render('listings/new.ejs');
}


module.exports.showPage = async (req, res) => {
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
}

module.exports.newlistingPost = async (req, res) => {
    try {
        let url  = req.file.path;
        let filename = req.file.filename;
        console.log(url + ".." + filename);
        const newListing = new Listing(req.body);

        newListing.owner = req.user._id;
        newListing.image = {url:url ,filename:filename};
        await newListing.save();

        req.flash("success", " new listing Created!");
        res.redirect('/listings');
        console.log("New listing created successfully");

    } catch (err) {
        console.error("Error creating listing:", err);
        res.status(500).send("Internal Server Error");
    }
}


module.exports.editFormRender = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        res.render('listings/edit.ejs', { listing });
    } catch (err) {
        console.error("Error fetching listing for edit:", err);
        res.status(500).send("Internal Server Error");
    }
}

module.exports.udateEditformPUT = async (req, res) => {
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
}

module.exports.deleteListing = async (req, res) => {
    try {
        const { id } = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success", " Deleted listing!");
        res.redirect('/listings');

    } catch (err) {
        console.error("Error deleting listing:", err);
        res.status(500).send("Internal Server Error");
    }
}