const mongoose = require('mongoose');
const initdata = require('./data.js');
const {Listing} = require('../models/listing.js');


// const mon_url = "mongodb://127.0.0.1:27017/wanderlust1";

const dbUrl = process.env.ATLASDB_URL;
async function main(){
    await mongoose.connect(dbUrl);
}
main().then(() => {
    console.log("MongoDB connected successfully");
}).catch((err) => {
    console.log("MongoDB connection failed", err);
});

const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj, owner : "6a7dc73533be11740ff6e7f8"}));
    await Listing.insertMany(initdata.data);
    console.log("Database initialized with sample data.");
    console.log("data is saved in the database");
}
initDB();