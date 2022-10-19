//////////////////////////////////

/* REQUIRE */
const wishlistModel = require("../models/wishlist");
const cartModel = require("../models/cart");
const cartController = require("../controllers/cart-controller");

//////////////////////////////////

/* EXPORTS */
module.exports = {
  getVeiwWishlist: async (req, res, next) => {
    try {
      let userId = req.session.userId;
      wishlistData = await wishlistModel
        .findOne({ userId: userId })
        .populate("products.productId")
        .lean();
      let wishlistCount = 0;
      wishlist = await wishlistModel.findOne({ userId: userId });
      if (wishlist) {
        wishlistCount = wishlist.products.length;
      }
      let cartCount = 0;
      cart = await cartModel.findOne({ userId: userId });
      if (cart) {
        cartCount = cart.products.length;
      }
      if (wishlistData) {
        res.render("users/wishlist", {
          cartCount,
          wishlistCount,
          wishlistData,
        });
      } else {
        res.render("users/empty-wishlist");
      }
    } catch (error) {
      console.log(error);
    }
  },

  postAddToWishlist: async (req, res, next) => {
    try {
      const productId = req.body.product;
      userId = req.session.userId;
      wishlist = await wishlistModel.findOne({ userId: userId }).lean();
      if (wishlist) {
        await wishlistModel.findOneAndUpdate(
          { userId: userId },
          { $push: { products: { productId: productId } } }
        );
      } else {
        await wishlistModel.create({
          userId: userId,
          products: { productId: productId },
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  delete: async (req, res, next) => {
    try {
      userId = req.session.userId;
      console.log(userId);
      deletes = await wishlistModel.updateOne(
        { userId: userId },
        { $pull: { products: { productId: req.body.product } } }
      );
      console.log(deletes);

      res.status(200).json({ message: "the product is successfully deleted" });
    } catch (error) {
      console.log(error);
    }
  },
  getWishlistCount: async (userId) => {
    try {
      let wishlistCount = 0;
      wishlist = await wishlistModel.findOne({ userId: userId });
      if (wishlist) {
        wishlistCount = wishlist.products.length;
      }
      return wishlistCount;
    } catch (error) {
      console.log(error);
    }
  },
};
