const mongoose = require("mongoose");
const bannerSchema = new mongoose.Schema({
    image: {
        type: String,
        required:true
    },
    heading: {
        type: String,
        required:true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Products'
        },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Coupon'
    }
   
    
    
});
const banner = mongoose.model("Banner", bannerSchema);
module.exports = banner;