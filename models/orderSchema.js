const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Users'
        // required:true
    },
    firstName: {
        type: String,
        // unique:true
    },
    lastName: {
        type: String,
        // unique:true
    },
    
    phoneNumber: {
        type: Number,
    },
    pincode: {
        type: String,
        // unique:true
    },
    
    address: {
        type: String,
        // unique:true
    },
    city: {
        type: String,
    },
    state: {
        type: String,
        // unique:true
    },
      landMark: {
        type: String,
    },
    alternatePhoneNumber: {
        type:Number,
    }, 
      type: {
        type: String,
    },
    orderStatus: {
        type: String,
        default: "Ordered"
    },
    paymentType: {
        type: String,
        
    },
    paymentStatus: {
        type: String,
        default:"Pending"
    },
    orderId: {
        type: String,
        
    },
    totalAmount: {
        type:Number
    },
    amountPaid: {
        type:Number
    },
    discount:{
        type:Number,
    },
    products: [
        {
         productId: {
         type: mongoose.Schema.Types.ObjectId,
         ref:'Products'
         },
        quantity: {
            type: Number,
            
             },
             price: {
                 type: Number,
                 default:0
            }
       
         }
        
 ]
    
    
}, {timestamps:true});
const order = mongoose.model("Order", orderSchema);
module.exports = order;