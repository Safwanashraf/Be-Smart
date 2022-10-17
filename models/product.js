const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: String,
    brand: String,
    old_price: Number,
    current_price: Number,
    stock: Number,
    category: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'categories'
    },
    image: Array,
description: String
})

module.exports = mongoose.model("Products",productSchema)