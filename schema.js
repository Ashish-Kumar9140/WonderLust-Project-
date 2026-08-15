const joi= require('joi');
const listingschema = joi.object({
    title:joi.string().required(),
    description:joi.string().required(),
    image:joi.object({
        filename:joi.string(),
        url:joi.string().allow("" , null),
    }).required(),
    price:joi.number().required(),
    location:joi.string().required(),
    country:joi.string().required()
});


const reviewSchema1 = joi.object({
    review:joi.object({
        rating:joi.number().required().min(1).max(5),
        comment:joi.string().required()
    }).required()
});

module.exports = {listingschema, reviewSchema1};


