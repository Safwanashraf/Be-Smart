const mongoose = require("mongoose");
const couponSchema = new mongoose.Schema({  
    couponName: {
        type: String,
    },
    discountAmount: {
        type: String,
        
    },
    minAmount: {
        type:String,
    },
    expiryDate: {
        type:Date,
    },
    couponCode: {
        type:String,
    },
    users: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
          },
          couponStatus: {
            type: String,
            default: "Valid"
          }
      
       
        }
        
      ]
      





},{timestamps:true});
const coupon = mongoose.model("Coupon", couponSchema);
module.exports = coupon;