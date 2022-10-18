
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
const categoryModel = require("../models/category")

//////////////////////////////////

/* MODULE.EXPORTS */
module.exports = {

  //////////////////////////////////

  /* LOGIN AND HOME */
    getHome : async (req, res, next)=>{
      try {
        
        products = await productModel.find().populate('category').lean()

        let categoryData = await categoryModel.find().lean()
        cartController.getCartCount(req.session.userId).then((data)=>{
         let cartCount = data; 
         wishlistController.getWishlistCount(req.session.userId).then((data)=>{
          let wishlistCount = data; 
        if(req.session.userLoggedIn){
          res.render('users/index',{products,cartCount,wishlistCount,categoryData})
        }else{
          res.render('users/index-guest',{products,categoryData})
        }
      })
    })
      } catch (error) {
        console.log(error)
      }
    },
    // getUser: (req, res, next)=>{
    //     res.render('userModel/index')
    // },
    getLogin : (req, res, next)=>{
      try {
        
        if(req.session.userLoggedIn){
          res.redirect("/");
        }else{
          res.render("users/login");
        }
      } catch (error) {
        console.log(error)
      }
    },
    getOtp :  (req, res, next) => {
      try {
        
        res.render("users/otp");
      } catch (error) {
        console.log(error)
      }
    },
    getLogout: (req, res, next) =>{
      try {
        res.redirect('/');
        req.session.destroy();
        
      } catch (error) {
        console.log(error)
      }
    },
    verifyLogin: (req, res, next) => {
      try {
        
        if(req.session.userLoggedIn){
          next()
        }else{
          res.redirect("/login")
        }
      } catch (error) {
        console.log(error)
      }
    },

  //////////////////////////////////

  /* PRODUCT */
     getProductDetails: async (req, res, next) =>{
      try {
        
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
      } catch (error) {
        console.log(error)
      }
    },
    getShop:async (req, res, next)=>{
      try {
        let categoryData = await categoryModel.find().lean()
        products = await productModel.find().populate('category').lean()
        res.render("users/shop",{products,categoryData})
      } catch (error) {
        console.log(error)
      }
    },

  //////////////////////////////////

  /* SIGNUP AND LOGIN POST */
    doSignup: async function(req,res,next){
      try {
        
        const olduser = await userModel.findOne({ email: req.body.email});
            if (olduser) {
              return res.send('Already existing user')
            }
        
        req.body.password = await bcrypt.hash(req.body.password, 10)
        await userModel.create(req.body)
         req.session.userLoggedIn = true;
         req.session.body = req.body;
         res.redirect("/")
        //  twilioContoller.dosms(req.session.body).then((data) => {
        //   if (data) {
        //     res.redirect("/otp");
        //   }
        // });
      } catch (error) {
       console.log(error) 
      }
    },

    doLogin : async function(req, res, next){
      try {
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
        
      } catch (error) {
        console.log(error)
      }
    },


  //////////////////////////////////

  /* USERS */
  getVeiwUserHandler: async (req, res) => {
    try {
      
      const userList = await userModel.find().lean();
      res.render("admin/veiw-user", { userList }); 
    } catch (error) {
      console.log(error)
    }
  },
  
    getBlockUserHandler: async (req, res) => {
      try {
        
        await userModel.updateOne({_id:req.params.id},{$set:{isActive:false}})
        res.redirect("/admin/veiw-user")
      } catch (error) {
        console.log(error)
      }
    },
    getUnblockHandler: async (req, res) => {
      try {
        
        await userModel.updateOne({_id:req.params.id},{$set:{isActive:true}})
        res.redirect("/admin/veiw-user")
      } catch (error) {
       console.log(error) 
      }
    },

    getUserProfile: async (req, res, next)=>{
      try {
        
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
      } catch (error) {
        console.log(error)
      }
  }



}
