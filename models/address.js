const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
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
      }
  });
  
  const address = mongoose.model("address", addressSchema);
  
  module.exports = address;
  