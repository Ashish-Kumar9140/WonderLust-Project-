const mangoose = require('mongoose');
const Schema = mangoose.Schema;
let defaultLink = "https://images.unsplash.com/photo-1785679339355-36cd3f065f7b?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
       filename:String,
        url:String,
        
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],

})
const Listing = mangoose.model('Listing', listingSchema);
module.exports = {Listing};