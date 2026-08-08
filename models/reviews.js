const mangoose = require('mongoose');
const Schema = mangoose.Schema;

const reviewSchema = new Schema({
    comment: {
        type: String,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Review = mangoose.model('Review', reviewSchema);
module.exports = { reviewSchema, Review };