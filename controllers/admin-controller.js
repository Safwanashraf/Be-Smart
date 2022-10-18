      //////////////////////////////////

      /* REQUIRE */
      const VAR = require("../config/variables");
      const express = require("express");
      const router = express.Router();
      const catagories = require("../models/category");
      const categoryController = require("../controllers/category-controller");
      const productController = require("../controllers/product-controller");
      const orderModel = require("../models/orderSchema");
      const couponModel = require("../models/couponSchema");

      module.exports = {
          
          verifyLogin: (req, res, next) => {
        try {

            if(req.session.adminLoggedIn){
              next()
            }else{
              res.redirect("/admin")
            }
          }
          catch(error){
            console.log(error)
          }
          },
          postAddProductHandler: (req, res, next) => {
            try {
              
              const img = [];
              for (let i = 0; i < req.files.length; i++) {
                img[i] = req.files[i].filename;
              }
              req.body.image = img;
              productController.addproduct(req.body).then((response) => {
                console.log(req.body,'this iss req.body');
                res.redirect("/admin/veiw-product");
              });
            } catch (error) {
              console.log(error)
            }
          },
          
          
          //////////////////////////////////

        /* LOGIN AND HOME */
        getLoginHandler: (req, res) => {
          try {
            
            res.render("admin/login");
          } catch (error) {
            console.log(error)
          }
        },

        postLoginHandler: (req, res) => {
          try {
            
            if (VAR.email == req.body.email && VAR.password == req.body.password) {
              res.redirect("/admin/dashboard");
            } else {
              res.redirect("/admin");
            }
          } catch (error) {
            console.log(error)
          }
        },

        getDashboardHandler: (req, res) => {
          try {
            
            res.render("admin/dashboard",{admin:true});
          } catch (error) {
            console.log(error)
          }
        },


        //////////////////////////////////

        /* CATEGORY */
        getVeiwCategoryHandler: async (req, res) => {
          try {
            
            const categoryList = await catagories.find().lean();
            res.render("admin/veiw-category", { categoryList, admin:true });
          } catch (error) {
           console.log(error) 
          }
        },

        getAddCategoryHandler: (req, res) => {
          try {
            
            res.render("admin/add-category", { admin:true });
          } catch (error) {
            console.log(error)
          }
        },

        postAddCategoryHandler: (req, res) => {
          try {
            categoryController.addCategory(req.body).then((response) => {
              if (response.nameError) {
                //req.session.categoryError = "Category Already Exist"
                res.redirect("/admin/add-category");
              } else {
                res.redirect("/admin/veiw-category");
              }
            });
            
          } catch (error) {
            console.log(error)
          }
        },

        getEditCategoryHandler: async (req, res) => {
          try {
            
            let category = await categoryController.getCategoryDetails(req.params.id);
            res.render("admin/edit-category", { category, admin:true });
          } catch (error) {
           console.log(error) 
          }
        },

        postEditCategoryHandler: (req, res) => {
          try {
            
            console.log(req.body);
            categoryController
              .editCategory(req.params.id, req.body)
              .then((response) => {
                res.redirect("/admin/veiw-category");
              });
          } catch (error) {
            console.log(error)
          }
        },

        getDeleteCategoryHandler: (req, res) => {
          try {
            
            let categoryId = req.params.id;
            categoryController.deleteCategory(categoryId).then((response) => {
              res.redirect("/admin/veiw-category");
            });
          } catch (error) {
            console.log(error)
          }
        },


        //////////////////////////////////

        /* PRODUCT */
        getViewProductHandler: async (req, res) => {
          try {
            
            const productList = await productController.getAllProduct();
            // const productList = await products.find().lean()
            res.render("admin/veiw-product", { productList, admin:true });
          } catch (error) {
            console.log(error)
          }
        },

        getAddProductHandler: async (req, res) => {
          try {
            
            await categoryController.getAllCategory().then((categoryList) => {
              res.render("admin/add-product", { categoryList, admin:true });
            });
          } catch (error) {
            console.log(error)
          }
        },
        
        getEditProductHandler: async (req, res) => {
          try {
            let product = await productController.getProductDetails(req.params.id);
  
            categoryController.getAllCategory().then((categoryList) => {
              res.render("admin/edit-product", { product, categoryList,admin:true });
            });
            
          } catch (error) {
            console.log(error)
          }
        },

        postEditProductHandler:  (req, res, next) => {
          try {
            
            const img = [];
            for (let i = 0; i < req.files.length; i++) {
              img[i] = req.files[i].filename;
            }
            req.body.image = img;
            productController.editProduct(req.params.id,req.body).then((response) => {
              console.log(req.body,'this iss req.body');
              res.redirect("/admin/veiw-product");
            });
          } catch (error) {
            console.log(error)
          }
        },

        getDeleteProductHandler: (req, res) => {
          try {
            
            let productId = req.params.id;
            productController.deleteProduct(productId).then((response) => {
              res.redirect("/admin/veiw-product");
            });
          } catch (error) {
            console.log(error)
          }
        },
        
        orderData: async(req, res, next) => {
          try {
            
            console.log('wertyuiop')
            orderData = await orderModel.find().populate("userId").populate("products.productId").lean(); 
            console.log(orderData.products);
            res.render('admin/tableorderData',{orderData})
          } catch (error) {
            console.log(error)
          }
      },
      renderChangeOrderStatus: (req, res, next) => {
        try {
          
          id = req.params.id;
          console.log(id);
          res.render('admin/editOrderStatus',{id});  
        } catch (error) {
          console.log(error)
        }
      },
      editOrderStatus: async (req, res, next) => {
        try {
          
          await orderModel.findOneAndUpdate({ _id: req.params.id }, { orderStatus: req.body.productStatus });
          res.redirect('/admin/orders');
        } catch (error) {
          console.log(error)
        }
          
      },
      renderaddCoupon: (req, res, next) => {
        try {
          
          res.render('admin/addCoupon');
        } catch (error) {
          console.log(error)
        }
      },
      addCoupon:async(req, res, next) => {
        try {
          
          console.log(req.body);
  
      
          couponNameExist = await couponModel.find({ couponName: req.body.couponName }).lean();
          console.log(couponNameExist,'234567890');
          couponIdExist = await couponModel.find({ couponCode: req.body.couponCode }).lean();
          console.log(couponIdExist)
          if(couponNameExist[0] || couponIdExist[0])
          return res.json({ message: "the coupon already exist" });
          await couponModel.create(req.body);
          res.redirect('/admin/couponData');
        } catch (error) {
         console.log(error) 
        }
          },
          couponData: async (req, res, next) => {
            try {
              
              couponData = await couponModel.find().lean();
              res.render('admin/couponTable',{couponData})
            } catch (error) {
              console.log(error)
            }
          },
          renderEditCoupon: async (req, res, next) => {
            try {
              
              id = req.params.id
              couponData = await couponModel.find({ _id: req.params.id }).lean();
              console.log(couponData);
              couponData = couponData[0];
              res.render('admin/editCoupon', { id, couponData});
            } catch (error) {
              console.log(error)
            }
              
          },
          editCoupon: async(req, res, next) => {
            try {
              
              await couponModel.findOneAndUpdate({ _id: req.params.id }, { $set: { couponName:req.body.couponName,discountAmount:req.body.discountAmount,minAmount:req.body.minAmount,expiryDate:req.body.expiryDate,couponCode:req.body.couponCode} })
              
              res.redirect('/admin/couponData');
            } catch (error) {
              console.log(error)
            }
          },
          deleteCoupon: async (req, res, next) => {
            try {
              
              await couponModel.deleteOne({ _id: req.params.id });
              res.redirect('/admin/couponData');
              
            } catch (error) {
              console.log(error)
            }
          
          },
          addCoupon:async(req, res, next) => {
            try {
              
              couponNameExist = await couponModel.find({ couponName: req.body.couponName }).lean();
              console.log(couponNameExist,'234567890');
              couponIdExist = await couponModel.find({ couponCode: req.body.couponCode }).lean();
              console.log(couponIdExist)
              if(couponNameExist[0] || couponIdExist[0])
              return res.json({ message: "the coupon already exist" });
              await couponModel.create(req.body);
              res.redirect('/admin/couponData');
            } catch (error) {
              console.log(error)
            }        
        },
        couponData: async (req, res, next) => {
          try {
            
            couponData = await couponModel.find().lean();
            res.render('admin/couponTable',{couponData})
          } catch (error) {
            console.log(error)
          }
        },
        renderEditCoupon: async (req, res, next) => {
          try {
            
            id = req.params.id
            couponData = await couponModel.find({ _id: req.params.id }).lean();
            console.log(couponData);
            couponData = couponData[0];
            res.render('admin/editCoupon', { id, couponData});
          } catch (error) {
            console.log(error)
          }
            
        },
        editCoupon: async(req, res, next) => {
          try {
            
            await couponModel.findOneAndUpdate({ _id: req.params.id }, { $set: { couponName:req.body.couponName,discountAmount:req.body.discountAmount,minAmount:req.body.minAmount,expiryDate:req.body.expiryDate,couponCode:req.body.couponCode} })
            
            res.redirect('/admin/couponData');
          } catch (error) {
            console.log(error)
          }
        },
        deleteCoupon: async (req, res, next) => {
          try {
            
            await couponModel.deleteOne({ _id: req.params.id });
            res.redirect('/admin/couponData');
          } catch (error) {
           console.log(error) 
          }
        
            
        },

        graphData: async (req, res, next) => {
          try {
            
            const eachDaySale = await orderModel.aggregate([{ $group: { _id: { day: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" }, year: { $year: "$createdAt" } }, total: { $sum: "$amountPaid" } } }]).sort({ _id: -1 })
    
            const monthlySales = await orderModel.aggregate([{ $group: { _id: { month: { $month: "$createdAt" } }, total: { $sum: "$amountPaid" } } }]).sort({ _id: -1 })
            const paymentType = await orderModel.aggregate([{ $group: { _id: { paymentType: "$paymentType" }, total: { $sum: "$amountPaid" } } }]).sort({ paymentType: 1 })
           console.log(eachDaySale,monthlySales, paymentType,'nirmal shaji has got sales')
            graphData = { paymentType, monthlySales, eachDaySale }
            let paymentTotal = [];
            let monthlyTotal = [];
            paymentTotal[0] = paymentType[0].total;
            paymentTotal[1] = paymentType[1].total;
            let total;
            
            for (i = 0; i <= 11; i++){
                total = 0;
                for (j = 0; j <= monthlySales.length-1; j++){
                    
                    if (monthlySales[j]._id.month == (i + 1))
                        
                        total = total + monthlySales[j].total;    
                }
                monthlyTotal[i] = total;
            }
           
           
            res.json({ message: "success" ,paymentTotal,monthlyTotal});
          } catch (error) {
            console.log(error)
          }
      },
      }