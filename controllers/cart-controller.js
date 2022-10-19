//////////////////////////////////

/* REQUIRE */
const cartModel = require("../models/cart");
const cartFunctions = require("../controllers/cartFunctions");
const addressModel = require("../models/address");
const orderModel = require("../models/orderSchema");
const razorpay = require("../controllers/razorpay_controller");
const couponModel = require("../models/couponSchema");
const productModel = require("../models/product");
const wishlistController = require("../controllers/wishlist-conroller");

//////////////////////////////////

/* EXPORTS */
module.exports = {
  getVeiwCart: async (req, res, next) => {
    try {
      let userId = req.session.userId;
      cartData = await cartModel
        .findOne({ userId: userId })
        .populate("products.productId")
        .lean();
      let cartCount = 0;

      if (cartData) {
        cartCount = cartData.products.length;
        totalAmount = await cartFunctions.totalAmount(cartData);
        wishlistController.getWishlistCount(req.session.userId).then((data) => {
          let wishlistCount = data;
          res.render("users/cart", {
            cartData,
            cartCount,
            totalAmount,
            wishlistCount,
          });
        });
      } else {
        res.render("users/empty-cart");
      }
    } catch (error) {
      console.log(error);
    }
  },
  postAddToCart: async (req, res, next) => {
    try {
      const productId = req.body.product;
      userId = req.session.userId;
      quantity = parseInt(req.body.quantity);
      userCart = await cartModel.findOne({ userId: userId }).lean();
      cartData = await cartModel
        .findOne({ userId: userId })
        .populate("products.productId")
        .lean();
        
      if (cartData) {
        oldCart = cartData.products.filter((i) => {
          if (i.productId._id == productId) return i.quantity;
        });
        if (oldCart[0]) {
          quantities = oldCart[0].quantity + quantity;
        } else {
          quantities = quantity;
        }
      } else {
        quantities = quantity;
      }
      if (userCart) {
        productexist = await cartModel.findOne({
          userId: userId,
          "products.productId": productId,
        });
        if (productexist) {
          await cartModel.updateOne(
            { userId: userId, "products.productId": productId },
            { "products.$.quantity": quantities }
          );
        } else {
          await cartModel.findOneAndUpdate(
            { userId: userId },
            {
              $push: {
                products: { productId: productId, quantity: quantities },
              },
            }
          );
        }
      } else {
        await cartModel.create({
          userId: userId,
          products: { productId: productId, quantity: quantities },
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  getCartCount: async (userId) => {
    try {
      let cartCount = 0;
      cart = await cartModel.findOne({ userId: userId });
      if (cart) {
        cartCount = cart.products.length;
      }
      return cartCount;
    } catch (error) {
      console.log(error);
    }
  },

  postCartCount: async (req, res, next) => {
    try {
      let productId = req.body.product;
      let quantity = parseInt(req.body.Qty);
      if (quantity == -1 && req.body.value == 1) {
        await cartModel.findOneAndUpdate(
          { userId: req.session.userId },
          { $pull: { products: { productId: req.body.product } } }
        );
      }
      await cartModel.findOneAndUpdate(
        {
          userId: req.session.userId,
          "products.productId": productId,
        },
        {
          $inc: {
            "products.$.quantity": quantity,
          },
        }
      );
      res.json("mission successfull");
    } catch (error) {
      console.log(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      userId = req.session.userId;
      deletes = await cartModel.updateOne(
        { userId: userId },
        { $pull: { products: { productId: req.body.product } } }
      );

      res.status(200).json({ message: "the product is successfully deleted" });
    } catch (error) {
      console.log(error);
    }
  },

  checkoutPage: async (req, res, next) => {
    try {
      userId = req.session.userId;
      const address = await addressModel.find({ userId: userId }).lean();
      cartData = await cartModel
        .findOne({ userId: userId })
        .populate("products.productId")
        .lean();

      productData = cartData.products;
      totalAmount = await cartFunctions.totalAmount(cartData);
      couponData = await couponModel.find().lean();
      let cartCount = 0;
      cart = await cartModel.findOne({ userId: userId });
      if (cart) {
        cartCount = cart.products.length;
      }
      wishlistController.getWishlistCount(req.session.userId).then((data) => {
        let wishlistCount = data;
        res.render("users/chekoutpage", {
          address,
          productData,
          totalAmount,
          cartData,
          couponData,
          cartCount,
          wishlistCount,
        });
      });
    } catch (error) {
      console.log(error);
    }
  },
  checkoutAddressChange: async (req, res, next) => {
    try {
      userId = req.session.userId;
      const address = await addressModel
        .find({ userId: userId, _id: req.body.address })
        .lean();

      res.json({ message: "this is succesfully", address });
    } catch (error) {
      console.log(error);
    }
  },
  renderConfirmation: async (req, res, next) => {
    try {
      req.body.userId = req.session.userId;
      cartData = await cartModel
        .findOne({ userId: req.body.userId }, { _id: 0, products: 1 })
        .populate("products.productId")
        .lean();

      totalAmount = await cartFunctions.totalAmount(cartData);
      if (req.session.coupon) {
        amountPaid = totalAmount - req.session.coupon.discountAmount;
        req.body.discount = req.session.coupon.discountAmount;
        await couponModel.findOneAndUpdate(
          { _id: req.session.coupon._id },
          { users: { couponStatus: "Invalid" } }
        );
        delete req.session.coupon;
      } else {
        amountPaid = totalAmount;
      }
      req.body.amountPaid = amountPaid;
      req.body.totalAmount = totalAmount;
      req.body.products = cartData.products;
      req.body.paymentType = "C.O.D";
      orderData = await orderModel.create(req.body);

      await Promise.all(
        orderData.products.map(async (i) => {
          productData = await productModel.findOne({ _id: i.productId }).lean();

          stock = productData.stock - i.quantity;
          await productModel.findOneAndUpdate(
            { _id: i.productId },
            { stock: stock }
          );
        })
      );

      orderDataPopulated = await orderModel
        .findOne({ _id: orderData._id })
        .populate("products.productId")
        .lean();

      req.session.confirmationData = { orderDataPopulated, amountPaid };
      res.json({ message: "sucessfull" });
    } catch (error) {
      console.log(error);
    }
  },
  confirmationPage: (req, res, next) => {
    try {
      orderDataPopulated = req.session.confirmationData.orderDataPopulated;
      totalAmount = req.session.confirmationData.totalAmount;
      req.session.confirmationData = null;
      res.render("users/order_confirmation", {
        userheader: true,
        orderDataPopulated,
        totalAmount,
      });
    } catch (error) {
      console.log(error);
    }
  },
  intiatePay: async (req, res, next) => {
    try {
      req.body.userId = req.session.userId;
      cartData = await cartModel
        .findOne({ userId: req.body.userId }, { _id: 0, products: 1 })
        .populate("products.productId")
        .lean();

      totalAmount = await cartFunctions.totalAmount(cartData);
      req.body.products = cartData.products;
      req.body.paymentType = "Online Payment";
      orderData = await orderModel.create(req.body);

      await cartModel.findOneAndDelete({ userId: req.body.userId });
      orderDataPopulated = await orderModel
        .findOne({ _id: orderData._id })
        .populate("products.productId")
        .lean();

      totalAmounts = totalAmount * 100;
      razorData = await razorpay.intiateRazorpay(orderData._id, totalAmounts);
      await orderModel.findOneAndUpdate(
        { _id: orderData._id },
        { orderId: razorData.id }
      );
      razorId = process.env.RAZOR_PAY_ID;

      req.session.confirmationData = { orderDataPopulated, totalAmount };
      totalAmounts = totalAmount * 100;
      res.json({ message: "success", totalAmounts, razorData, orderData });
    } catch (error) {
      console.log(error);
    }
  },
  verifyPay: async (req, res, next) => {
    try {
      console.log(req.body, "hihihihihihhhihhihh");
      success = await razorpay.validate(req.body);
      if (success) {
        await orderModel.findOneAndUpdate(
          { orderId: req.body["razorData[id]"] },
          { paymentStatus: "success" }
        );
        return res.json({ status: "true" });
      } else {
        await orderModel.findOneAndUpdate(
          { orderId: req.body["razorData[id]"] },
          { paymentStatus: "failed" }
        );
        return res.json({ status: "failed" });
      }
    } catch (error) {
      console.log(error);
    }
  },

  validateCoupon: async (req, res, next) => {
    try {
      userId = req.session.userId;

      couponExist = await couponModel
        .findOne({ couponCode: req.body.couponId, "users.userId": userId })
        .lean();

      coupons = await couponModel
        .findOne({ couponCode: req.body.couponId })
        .lean();

      currentDate = new Date();

      if (coupons) {
        if (couponExist) {
          return res.json({ message: "the coupon is used already" });
        }
        if (currentDate > coupons.expiryDate)
          return res.json({ message: "sorry the coupon has expired" });

        if (req.body.total > coupons.minAmount)
          return res.json({ message: "please add items to cart" });

        await couponModel.findOneAndUpdate(
          { couponCode: req.body.couponId },
          { users: { userId: userId } }
        );

        newTotal = req.body.total - coupons.discountAmount;
        req.session.coupon = coupons;
        return res.json({ message: "succesfull", coupons, newTotal });
      }
      return res.json({ message: "invalid coupon" });
    } catch (error) {
      console.log(error);
    }
  },
};
