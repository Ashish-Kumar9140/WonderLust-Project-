const mongoose = require('mongoose');
const initdata = require('./data.js');
const {Listing} = require('../models/listing.js');



const mon_url = "mongodb://127.0.0.1:27017/wanderlust1";
async function main(){
    await mongoose.connect(mon_url);
}
main().then(() => {
    console.log("MongoDB connected successfully");
}).catch((err) => {
    console.log("MongoDB connection failed", err);
});

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("Database initialized with sample data.");
    console.log("data is saved in the database");
}
initDB();