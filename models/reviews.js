const mangoose = require('mongoose');
const Schema = mangoose.Schema;

const reviewSchema = new Schema({
     rating: {
        type: Number,
        default:1,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
    },
   
    createdAt: {
        type: Date,
        default: Date.now
    },
    author:{
        type: Schema.Types.ObjectId,
        ref:"User",
    }
});

module.exports = mangoose.model('Review', reviewSchema);
