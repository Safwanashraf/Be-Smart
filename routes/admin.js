//////////////////////////////////

/* REQUIRE */
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin-controller");
const multer = require("multer");
const userController = require("../controllers/user-controller");
const { verifyLogin } = require("../controllers/user-controller");

//////////////////////////////////

/* INITIALISING */
const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/image");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "--" + file.originalname);
    },
  });
  const upload = multer({ storage: fileStorageEngine });  

//////////////////////////////////

/* LOGIN AND HOME */
router.get("/", adminController.getLoginHandler);
router.post("/", adminController.postLoginHandler);
router.get("/dashboard", adminController.getDashboardHandler);

//////////////////////////////////

/* CATEGORY */
router.get("/veiw-category", adminController.getVeiwCategoryHandler);
router.get("/add-category", adminController.getAddCategoryHandler);
router.post("/add-category", adminController.postAddCategoryHandler);
router.get("/edit-category/:id", adminController.getEditCategoryHandler);
router.post("/edit-category/:id", adminController.postEditCategoryHandler);
router.get("/delete-category/:id", adminController.getDeleteCategoryHandler);

//////////////////////////////////

/* PRODUCT */
router.get("/veiw-product", adminController.getViewProductHandler);
router.get("/add-product", adminController.getAddProductHandler);
router.post("/add-product",upload.array("image", 3), adminController.postAddProductHandler);
router.get("/edit-product/:id", adminController.getEditProductHandler);
router.post("/edit-product/:id", upload.array("image", 3), adminController.postEditProductHandler);
router.get("/delete-product/:id", adminController.getDeleteProductHandler);

//////////////////////////////////

/* USER */
router.get("/veiw-user", userController.getVeiwUserHandler);
router.get("/block-user/:id", userController.getBlockUserHandler);
router.get("/unblock-user/:id", userController.getUnblockHandler);

//////////////////////////////////

/* ORDERS */
router.get('/orders', adminController.orderData);
router.get('/renderChangeOrderStatus/:id', adminController.renderChangeOrderStatus);
router.post('/changeOrderStatus/:id', adminController.editOrderStatus);

//////////////////////////////////

/* COUPON */
router.get('/addCoupon', adminController.renderaddCoupon);
router.post('/addCoupon', adminController.addCoupon);
router.get('/couponData', adminController.couponData);
router.get('/editCoupon/:id', adminController.renderEditCoupon);
router.post('/editCoupon/:id', adminController.editCoupon);
router.get('/deleteCoupon/:id', adminController.deleteCoupon);

//////////////////////////////////

/* DASHBOARD */
router.post('/dashboardGraph', adminController.graphData);

module.exports = router;
