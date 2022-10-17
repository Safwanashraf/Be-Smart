
        //////////////////////////////////

        /* REQUIRE */
        const { default: mongoose } = require("mongoose");
        const { ConversationPage } = require("twilio/lib/rest/conversations/v1/conversation");
        const cartModel = require("../models/cart");
        const { mapReduce } = require("../models/product");
        const cartFunctions = require("../controllers/cartFunctions")
        const addressModel = require("../models/address");
        const orderModel = require('../models/orderSchema');
        const address = require("../models/address");
        const razorpay = require("../controllers/razorpay_controller");
        const couponModel = require("../models/couponSchema");
        const productModel=require('../models/product');
        const wishlistController = require("../controllers/wishlist-conroller");


        //////////////////////////////////

        /* EXPORTS */
        module.exports = {

          //////////////////////////////////

          /* CART */
          getVeiwCart: async (req, res, next) => {

            let userId = req.session.userId;
            cartData = await cartModel.findOne(
              { userId: userId }
            ).populate("products.productId").lean();
            let cartCount = 0;

            if (cartData) {
              console.log(cartData, "if case")
              cartCount = cartData.products.length;
              // console.log(cartData.products[0].productId.current_price);

              totalAmount = await cartFunctions.totalAmount(cartData)
              wishlistController.getWishlistCount(req.session.userId).then((data)=>{
                let wishlistCount = data; 
              res.render("users/cart", { cartData, cartCount, totalAmount, wishlistCount})
              })
            } else {
              console.log(cartData, "else case")
              res.render("users/empty-cart")
            }


          },
          postAddToCart: async (req, res, next) => {
            console.log(req.body);
            const productId = req.body.product;
            console.log(productId);
            userId = req.session.userId;
            quantity = parseInt(req.body.quantity);

            userCart = await cartModel.findOne({ userId: userId }).lean();
            cartData = await cartModel.findOne({ userId: userId }).populate('products.productId').lean();
            if (cartData) {


              console.log(cartData);
              oldCart = cartData.products.filter((i) => {
                if (i.productId._id == productId)
                  return i.quantity
              });
              console.log(oldCart);
              if (oldCart[0]) {
                quantities = oldCart[0].quantity + quantity;
              }
              else {
                quantities = quantity;
              }
            }
            else {
              quantities = quantity
            }
            //  stock = await productModel.findOne({ _id: productId }, { _id: 0, stock: 1 }).lean();

            //  if (stock.stock<=0) 
            //  return res.json({message:'Out of stock'})            

            if (userCart) {
              productexist = await cartModel.findOne({ userId: userId, "products.productId": productId });
              if (productexist) {
                await cartModel.updateOne({ userId: userId, "products.productId": productId }, { "products.$.quantity": quantities });
              }
              else {
                await cartModel.findOneAndUpdate({ userId: userId }, { $push: { products: { productId: productId, quantity: quantities } } });
              }
            }

            else {
              await cartModel.create({ userId: userId, products: { productId: productId, quantity: quantities } });
            }

          },

          getCartCount: async (userId) => {
            let cartCount = 0;
            cart = await cartModel.findOne({ userId: userId });
            if (cart) {
              cartCount = cart.products.length;
            }
            return cartCount;
          },

          postCartCount: async (req, res, next) => {
           
            let productId = req.body.product
            let quantity = parseInt(req.body.Qty)
            if (quantity == -1 && req.body.value == 1) {
              await cartModel.findOneAndUpdate({ userId: req.session.userId }, { $pull: { products: { productId: req.body.product } } })

            }
            await cartModel.findOneAndUpdate({
              userId: req.session.userId,
              'products.productId': productId
            },
              {
                $inc: {
                  "products.$.quantity": quantity
                }
              })
            res.json('mission successfull')
          },

          delete: async (req, res, next) => {
            userId = req.session.userId;
            console.log(userId)
              ;
            deletes = await cartModel.updateOne({ userId: userId }, { $pull: { products: { productId: req.body.product } } })
            console.log(deletes)


            res.status(200).json({ message: "the product is successfully deleted" });

          },

          checkoutPage: async (req, res, next) => {
            userId = req.session.userId;
            console.log(userId);
            const address = await addressModel.find({ userId: userId }).lean();
            console.log(address)

            cartData = await cartModel.findOne({ userId: userId }).populate("products.productId").lean();
            console.log(cartData)

            productData = cartData.products;
            totalAmount = await cartFunctions.totalAmount(cartData);
            couponData = await couponModel.find().lean();
            let cartCount = 0;
            cart = await cartModel.findOne({ userId: userId });
            if (cart) {
              cartCount = cart.products.length;
            }
            wishlistController.getWishlistCount(req.session.userId).then((data)=>{
              let wishlistCount = data; 
            res.render('users/chekoutpage', { address, productData, totalAmount, cartData ,couponData, cartCount, wishlistCount})
            })
          },
          checkoutAddressChange: async (req, res, next) => {

            userId = req.session.userId;
            console.log(req.body.address, "req.body.address")
            console.log(userId, "userID")

            const address = await addressModel.find({ userId: userId, _id: req.body.address }).lean();
            console.log(address, "address in checkoutAddressChange");
            res.json({ message: "this is succesfully", address });
          },
          renderConfirmation: async (req, res, next) => {

            req.body.userId = req.session.userId;
            cartData = await cartModel.findOne({ userId: req.body.userId }, { _id: 0, products: 1 }).populate("products.productId").lean();
            console.log(cartData);
            totalAmount = await cartFunctions.totalAmount(cartData);
            if(req.session.coupon){
                amountPaid = totalAmount - req.session.coupon.discountAmount;
                req.body.discount = req.session.coupon.discountAmount;
                await couponModel.findOneAndUpdate({ _id: req.session.coupon._id }, { users: { couponStatus: "Invalid" } });
                delete req.session.coupon;
            }
            else {
                amountPaid = totalAmount;
            }
            req.body.amountPaid = amountPaid;
            req.body.totalAmount = totalAmount;
            req.body.products = cartData.products;
            req.body.paymentType = "C.O.D";
            orderData = await orderModel.create(req.body)
            
            await Promise.all(orderData.products.map(async (i) => {
                productData = await productModel.findOne({ _id: i.productId }).lean();
              
                stock = productData.stock - i.quantity;
                await productModel.findOneAndUpdate({ _id: i.productId }, { stock: stock });
               
            }));
            
            orderDataPopulated = await orderModel.findOne({ _id: orderData._id }).populate("products.productId").lean();
            req.session.confirmationData = { orderDataPopulated, amountPaid };
            res.json({ message: "sucessfull" });
          },
          confirmationPage: (req, res, next) => {
            console.log(req.session.confirmationData);
            orderDataPopulated = req.session.confirmationData.orderDataPopulated
            totalAmount = req.session.confirmationData.totalAmount;
            req.session.confirmationData = null;
            res.render('users/order_confirmation', { userheader: true, orderDataPopulated, totalAmount });
          },
          intiatePay: async (req, res, next) => {
            console.log('arrivedqwertyuioprtyuihyghjuijuhghjihbj');
            console.log(req.body);
            req.body.userId = req.session.userId;
            cartData = await cartModel.findOne({ userId: req.body.userId }, { _id: 0, products: 1 }).populate("products.productId").lean();
            console.log(cartData);
            totalAmount = await cartFunctions.totalAmount(cartData);
            req.body.products = cartData.products;
            req.body.paymentType = "Online Payment";
            orderData = await orderModel.create(req.body)

            await cartModel.findOneAndDelete({ userId: req.body.userId });
            orderDataPopulated = await orderModel.findOne({ _id: orderData._id }).populate("products.productId").lean();
            console.log(req.body);
            console.log('stopped here', orderData._id, totalAmount);
            totalAmounts = totalAmount * 100;
            razorData = await razorpay.intiateRazorpay(orderData._id, totalAmounts);
            console.log(razorData)
            console.log('continuing')
            await orderModel.findOneAndUpdate({ _id: orderData._id }, { orderId: razorData.id });
            console.log(razorData);
            razorId = process.env.RAZOR_PAY_ID;

            req.session.confirmationData = { orderDataPopulated, totalAmount };
            totalAmounts = totalAmount * 100;
            res.json({ message: 'success', totalAmounts, razorData, orderData });

          },
          verifyPay: async (req, res, next) => {
            console.log(req.body, "hihihihihihhhihhihh");
            success = await razorpay.validate(req.body);
            if (success) {
              await orderModel.findOneAndUpdate({ orderId: req.body['razorData[id]'] }, { paymentStatus: "success" });
              return res.json({ status: "true" });
            }
            else {
              await orderModel.findOneAndUpdate({ orderId: req.body['razorData[id]'] }, { paymentStatus: "failed" });
              return res.json({ status: "failed" });
            }
          },
          
          validateCoupon: async (req, res, next) => {
            userId = req.session.userId;
           
            couponExist = await couponModel.findOne({couponCode:req.body.couponId,"users.userId": userId }).lean();
            
            coupons = await couponModel.findOne({ couponCode: req.body.couponId }).lean();
           
            currentDate = new Date();
      
            if (coupons) {
            if(couponExist){
             
                return res.json({ message: 'the coupon is used already' });    
            }
            if (currentDate > coupons.expiryDate) 
            return res.json({ message: "sorry the coupon has expired" });   
            
             
           
             if (req.body.total > coupons.minAmount)
             return res.json({ message: "please add items to cart" });
          
             await couponModel.findOneAndUpdate({ couponCode: req.body.couponId }, { users: { userId: userId } });
                
               
                
               
                newTotal = req.body.total - coupons.discountAmount;
                req.session.coupon = coupons;
               return res.json({ message: "succesfull" ,coupons,newTotal});
                
        
            }
            return res.json({ message: "invalid coupon" });
          }

        }