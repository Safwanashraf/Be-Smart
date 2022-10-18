
//////////////////////////////////

/* REQUIRE */
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cartController = require("../controllers/cart-controller");
const wishlistController = require("../controllers/wishlist-conroller");
const userController = require("../controllers/user-controller");
const profileController = require("../controllers/profile-controller")
const verifyLogin = userController.verifyLogin;


//////////////////////////////////

/* LOGIN AND HOME */
router.get("/", userController.getHome);
router.get("/login", userController.getLogin);
router.post("/login", userController.doLogin);
router.post("/signUp", userController.doSignup);
// router.get("/otp", userController.getOtp);
router.get("/logout", userController.getLogout);

//////////////////////////////////

/* PRODUCT */
router.get("/product-detail/:id", userController.getProductDetails);
router.get("/shop", userController.getShop);

//////////////////////////////////

/* CART */
router.post("/add-to-cart", verifyLogin, cartController.postAddToCart);
router.get("/veiw-cart", verifyLogin, cartController.getVeiwCart);
router.post("/change-product-quantity",cartController.postCartCount);
router.post('/deleteCartProduct',verifyLogin,cartController.delete);


//////////////////////////////////

/* WHISHLIST */
router.post("/add-to-wishlist", verifyLogin, wishlistController.postAddToWishlist);
router.get("/veiw-wishlist", verifyLogin, wishlistController.getVeiwWishlist);
router.post('/deleteWishlistProduct',verifyLogin,wishlistController.delete);


//////////////////////////////////

/* USER PROFILE */
router.get("/user-profile", verifyLogin, userController.getUserProfile);
router.post('/cancelOrder', verifyLogin, profileController.cancelOrder);
router.get("/chekoutpage", verifyLogin, cartController.checkoutPage);
router.post('/new_address', verifyLogin, profileController.editAddress);
router.post('/address_fetching', verifyLogin, cartController.checkoutAddressChange);
router.get('/delete_address/:id', verifyLogin, profileController.deleteAddress);
router.post('/edit_userdata', verifyLogin, profileController.editUserData);
router.post('/order_confirmed', verifyLogin, cartController.renderConfirmation);
router.get('/renderConfirmation', verifyLogin, cartController.confirmationPage) ;
router.post('/edit_userdata', verifyLogin, profileController.editUserData);
router.post('/intiate_razorpay', verifyLogin, cartController.intiatePay);
router.post('/verifyRazorpay', verifyLogin, cartController.verifyPay);

//////////////////////////////////

/* COUPON */
router.post('/couponValidation', verifyLogin, cartController.validateCoupon);



module.exports = router;
