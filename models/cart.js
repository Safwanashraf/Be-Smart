const mongoose = require('mongoose')
const ProductsModel = require('../models/product')
const cartSchema = new mongoose.Schema({

     userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products"
        },
        quantity: {
          type: Number,
        },
      },    
    ],

    createdAt: {
      type: Date,
      default: Date.now(),
      // select: false,
    },
    ModifiedAt: {
      type: Date,
      default: Date.now(),
      // select: false,
    },
    },
    { timestamps: true }

)
const CartModel = mongoose.model('carts',cartSchema);
module.exports = CartModel