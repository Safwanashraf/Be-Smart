const express = require("express");
const usersModel = require("../models/user");
const addressModel = require('../models/address');
const orderModel = require("../models/orderSchema")


module.exports={
    editAddress: async (req, res, next) => {
        userId = req.session.userId;
        console.log(userId)
        console.log(req.body);
        req.body.userId = userId;
        await addressModel.create(req.body);
        res.redirect('/');
        
    },
    deleteAddress: async (req, res, next) => {
        console.log(req.params.id);
        await addressModel.findOneAndDelete({ _id: req.params.id });
        res.redirect('/user-profile');
    },
    
    editUserData: async(req, res, next) => {
        console.log(req.body);
        emailExists = await usersModel.findOne({ email: req.body.email }).lean();
        if (emailExists)
return res.json({ message: "the email already exists please enter another one" });
        if (req.body.phone_number) {
        updateData = await usersModel.findOneAndUpdate({ _id: req.session.userId }, { $set: { first_name: req.body.first_name, last_name: req.body.last_name, phone_number: req.body.phone_number,email:req.body.email } });
        }
        else {
updateData = await usersModel.findOneAndUpdate({ _id: req.session.userId }, { $set: { first_name: req.body.first_name, last_name: req.body.last_name,email:req.body.email } }); 
        }
        res.redirect('/user-profile');
    },
    cancelOrder: async (req, res, next) => {
        await orderModel.findOneAndUpdate({ _id: req.body.orderId }, { orderStatus: 'cancelled' });
        res.json({ message: 'successfull' });
    }
}