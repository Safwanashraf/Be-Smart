
//////////////////////////////////

/* REQUIRE */
const bcrypt = require('bcrypt');
const userModel = require("../models/user");
const productModel = require("../models/product");
const twilioContoller = require("../controllers/twilio-controller");
const productController = require("../controllers/product-controller");
const cartController = require("../controllers/cart-controller");
const addressModel = require("../models/address");
const orderModel = require("../models/orderSchema");
const wishlistController = require("../controllers/wishlist-conroller");

//////////////////////////////////

/* MODULE.EXPORTS */
module.exports = {

  //////////////////////////////////

  /* LOGIN AND HOME */
    getHome : async (req, res, next)=>{
      products = await productModel.find().lean()
      cartController.getCartCount(req.session.userId).then((data)=>{
       let cartCount = data; 
       wishlistController.getWishlistCount(req.session.userId).then((data)=>{
        let wishlistCount = data; 
      if(req.session.userLoggedIn){
        res.render('users/index',{products,cartCount,wishlistCount})
      }else{
        res.render('users/index-guest',{products})
      }
    })
  })
    },
    // getUser: (req, res, next)=>{
    //     res.render('userModel/index')
    // },
    getLogin : (req, res, next)=>{
      if(req.session.userLoggedIn){
        res.redirect("/");
      }else{
        res.render("users/login");
      }
    },
    getOtp :  (req, res, next) => {
        res.render("users/otp");
    },
    getLogout: (req, res, next) =>{
        res.redirect('/');
        req.session.destroy();
    },
    verifyLogin: (req, res, next) => {
      if(req.session.userLoggedIn){
        next()
      }else{
        res.redirect("/login")
      }
    },

  //////////////////////////////////

  /* PRODUCT */
     getProductDetails: async (req, res, next) =>{
      products = await productController.getProductDetails(req.params.id);
      productList = await productController.getAllProduct();
      const userId = req.session.userId;
      cartController.getCartCount(req.session.userId).then((data)=>{
        let cartCount = data; 
        wishlistController.getWishlistCount(req.session.userId).then((data)=>{
          let wishlistCount = data; 
       res.render('users/product-detail', {products, productList ,cartCount, userId, wishlistCount});
      })
    })
    },
    getShop:async (req, res, next)=>{
      products = await productModel.find().lean()
      res.render("users/shop",{products})
    },

  //////////////////////////////////

  /* SIGNUP AND LOGIN POST */
    doSignup: async function(req,res,next){
    const olduser = await userModel.findOne({ email: req.body.email});
        if (olduser) {
          return res.send('Already existing user')
        }
    
    req.body.password = await bcrypt.hash(req.body.password, 10)
    await userModel.create(req.body)
     req.session.userLoggedIn = true;
     req.session.body = req.body;

     twilioContoller.dosms(req.session.body).then((data) => {
      if (data) {
        res.redirect("/otp");
      }
    });
    },

    doLogin : async function(req, res, next){
      if (!req.body.email || !req.body.password) return res.redirect('/login')
     const userData= await userModel.findOne({email:req.body.email});

      if (!userData) return res.redirect('/login')
      const correct = await bcrypt.compare(req.body.password, userData.password);

      if (!correct) return res.redirect('/login')
      req.session.userLoggedIn = true;
      req.session.userId = userData._id;
      if(userData.isActive == false)
      res.send('We have been deneid the access to this user because of some issues for further information contact our team ')
      res.redirect('/')
    },


  //////////////////////////////////

  /* USERS */
  getVeiwUserHandler: async (req, res) => {
    const userList = await userModel.find().lean();
    res.render("admin/veiw-user", { userList }); 
  },
  
    getBlockUserHandler: async (req, res) => {
      await userModel.updateOne({_id:req.params.id},{$set:{isActive:false}})
      res.redirect("/admin/veiw-user")
    },
    getUnblockHandler: async (req, res) => {
      await userModel.updateOne({_id:req.params.id},{$set:{isActive:true}})
      res.redirect("/admin/veiw-user")
    },

    getUserProfile: async (req, res, next)=>{
      userData = await userModel.findOne({ _id: req.session.userId }).lean();
      addressData = await addressModel.find({ userId: req.session.userId }).lean();
      orderDatas = await orderModel.find({ userId: req.session.userId}).populate('products.productId').lean();
      cartController.getCartCount(req.session.userId).then((data)=>{
        let cartCount = data; 
        wishlistController.getWishlistCount(req.session.userId).then((data)=>{
          let wishlistCount = data; 
        
      if(req.session.userLoggedIn){
        res.render('users/user-profile',{userData,addressData,orderDatas,cartCount,wishlistCount})
      }else{
        res.redirect('/login')
      }
    })
    })
  }



}
