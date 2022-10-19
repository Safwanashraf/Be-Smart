//////////////////////////////////

/* REQUIRE */
const usersModel = require("../models/user");
const addressModel = require("../models/address");
const orderModel = require("../models/orderSchema");

//////////////////////////////////

/* EXPORTS */
module.exports = {
  editAddress: async (req, res, next) => {
    try {
      userId = req.session.userId;
      req.body.userId = userId;
      await addressModel.create(req.body);
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  },

  deleteAddress: async (req, res, next) => {
    try {
      await addressModel.findOneAndDelete({ _id: req.params.id });
      res.redirect("/user-profile");
    } catch (error) {
      console.log(error);
    }
  },

  editUserData: async (req, res, next) => {
    try {
      emailExists = await usersModel.findOne({ email: req.body.email }).lean();
      if (emailExists)
        return res.json({
          message: "the email already exists please enter another one",
        });
      if (req.body.phone_number) {
        updateData = await usersModel.findOneAndUpdate(
          { _id: req.session.userId },
          {
            $set: {
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              phone_number: req.body.phone_number,
              email: req.body.email,
            },
          }
        );
      } else {
        updateData = await usersModel.findOneAndUpdate(
          { _id: req.session.userId },
          {
            $set: {
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              email: req.body.email,
            },
          }
        );
      }
      res.redirect("/user-profile");
    } catch (error) {
      console.log(error);
    }
  },

  cancelOrder: async (req, res, next) => {
    try {
      await orderModel.findOneAndUpdate(
        { _id: req.body.orderId },
        { orderStatus: "cancelled" }
      );
      res.json({ message: "successfull" });
    } catch (error) {
      console.log(error);
    }
  },
};
