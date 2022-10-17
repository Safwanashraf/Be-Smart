
//////////////////////////////////

/* REQUIRE */
const wishlistModel = require("../models/wishlist");
const cartModel = require("../models/cart")
const cartController = require("../controllers/cart-controller");

//////////////////////////////////

/* EXPORTS */
module.exports = {
  //////////////////////////////////

  /* WHISHLIST */
  getVeiwWishlist: async (req, res, next) => {

    let userId = req.session.userId;
    wishlistData = await wishlistModel.findOne({ userId: userId }).populate("products.productId").lean();
    // await cartController.getCartCount(req.session.userId).then((data) => {
     // let cartCount = data;
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
     
      if(wishlistData){
        res.render("users/wishlist", {cartCount, wishlistCount, wishlistData })
      }else{
        res.render("users/empty-wishlist")
      }
    // })
  },
  postAddToWishlist: async (req, res, next) => {
    const productId = req.body.product;
    userId = req.session.userId;
    wishlist = await wishlistModel.findOne({ userId: userId }).lean();
    if (wishlist) {
      // productexist = await wishlistModel.findOne({ userId: userId, "products.productId": productId });
      // if (productexist)
        //        return res.json({message:"product already added to wishlist"})
        await wishlistModel.findOneAndUpdate({ userId: userId }, { $push: { products: { productId: productId } } });

    }
    else { await wishlistModel.create({ userId: userId, products: { productId: productId } }); }
    // wishlistData = await wishlistModel.findOne(
    //     { userId: userId._id }
    // ).populate("products.productId").lean();
    // price = (wishlistData.products[0].productId.amount - wishlistData.products[0].productId.discount);
    // console.log(price);
    // await wishlistModel.updateOne({ userId: userId._id, "products.productId": productId },  { "products.$.price": price })
  },
  delete: async(req,res,next)=>{
    userId=req.session.userId;
    console.log(userId)
;
    deletes = await wishlistModel.updateOne({ userId: userId }, { $pull: { products: { productId: req.body.product } } })
    console.log(deletes)
    

    res.status(200).json({ message: "the product is successfully deleted" });

  },
  getWishlistCount: async (userId) => {
    let wishlistCount = 0;
    wishlist = await wishlistModel.findOne({ userId: userId });
    if (wishlist) {
      wishlistCount = wishlist.products.length;
    }
    return wishlistCount;
  },

}