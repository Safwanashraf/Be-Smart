const mongoose = require("mongoose");
const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
        // required:true
    },
    products: [
       {
        productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Products'
        },
            price: {
                type: Number,
                default:0
           }
      
        }
       
]
   
    
    
}, {timestamps:true});
const wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = wishlist;