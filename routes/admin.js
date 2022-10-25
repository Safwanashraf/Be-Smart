//////////////////////////////////

/* REQUIRE */
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin-controller");
const multer = require("multer");
const userController = require("../controllers/user-controller");
const verifyLogin = adminController.verifyLogin;

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
router.get("/dashboard", verifyLogin, adminController.getDashboardHandler);

//////////////////////////////////

/* CATEGORY */
router.get("/veiw-category", verifyLogin, adminController.getVeiwCategoryHandler);
router.get("/add-category", verifyLogin, adminController.getAddCategoryHandler);
router.post("/add-category", verifyLogin, adminController.postAddCategoryHandler);
router.get("/edit-category/:id", verifyLogin, adminController.getEditCategoryHandler);
router.post("/edit-category/:id", verifyLogin, adminController.postEditCategoryHandler);
router.get("/delete-category/:id", verifyLogin, adminController.getDeleteCategoryHandler);

//////////////////////////////////

/* PRODUCT */
router.get("/veiw-product", verifyLogin, adminController.getViewProductHandler);
router.get("/add-product", verifyLogin, adminController.getAddProductHandler);
router.post("/add-product", verifyLogin, upload.array("image", 3), adminController.postAddProductHandler);
router.get("/edit-product/:id", verifyLogin, adminController.getEditProductHandler);
router.post("/edit-product/:id", verifyLogin, upload.array("image", 3), adminController.postEditProductHandler);
router.get("/delete-product/:id",verifyLogin, adminController.getDeleteProductHandler);

//////////////////////////////////

/* USER */
router.get("/veiw-user", verifyLogin, userController.getVeiwUserHandler);
router.get("/block-user/:id", verifyLogin, userController.getBlockUserHandler);
router.get("/unblock-user/:id", verifyLogin, userController.getUnblockHandler);

//////////////////////////////////

/* ORDERS */
router.get('/orders', verifyLogin, adminController.orderData);
router.get('/renderChangeOrderStatus/:id', verifyLogin, adminController.renderChangeOrderStatus);
router.post('/changeOrderStatus/:id', verifyLogin,   adminController.editOrderStatus);

//////////////////////////////////

/* COUPON */
router.get('/addCoupon', verifyLogin, adminController.renderaddCoupon);
router.post('/addCoupon', verifyLogin, adminController.addCoupon);
router.get('/couponData', verifyLogin, adminController.couponData);
router.get('/editCoupon/:id', verifyLogin, adminController.renderEditCoupon);
router.post('/editCoupon/:id', verifyLogin, adminController.editCoupon);
router.get('/deleteCoupon/:id', verifyLogin, adminController.deleteCoupon);

//////////////////////////////////

/* DASHBOARD */
router.post('/dashboardGraph', verifyLogin, adminController.graphData);

module.exports = router;
