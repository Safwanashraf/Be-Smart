var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var usersModel = require("../models/user");
var categoryModel = require("../models/category")
var productModel = require('../models/product');
var cartModel = require("../models/cart");

module.exports = {
    totalAmount: (cartdata) => {
        try {
            
            total = cartdata.products.reduce((acc, curr) => {
                acc += curr.productId.current_price * curr.quantity
                return acc;
            }, 0);
            return total;
        } catch (error) {
            console.log(error)
        }
    }
}