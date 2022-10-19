//////////////////////////////////

/* REQUIRE */
const productModel = require("../models/product");

//////////////////////////////////

/* EXPORTS */
module.exports = {
  addproduct: (productData) => {
    try {
      return new Promise(async (resolve, reject) => {
        productModel.create(productData).then((data) => {
          resolve(data);
        });
      });
    } catch (error) {
      console.log(error);
    }
  },

  getAllProduct: () => {
    try {
      return new Promise(async (resolve, reject) => {
        const products = await productModel.find().populate("category").lean();
        resolve(products);
      });
    } catch (error) {
      console.log(error);
    }
  },

  deleteProduct: (productId) => {
    try {
      return new Promise((resolve, reject) => {
        productModel.findByIdAndDelete(productId).then((response) => {
          resolve(response);
        });
      });
    } catch (error) {
      console.log(error);
    }
  },

  getProductDetails: (productId) => {
    try {
      return new Promise((resolve, reject) => {
        productModel
          .findOne({ _id: productId })
          .lean()
          .then((product) => {
            resolve(product);
          });
      });
    } catch (error) {
      console.log(error);
    }
  },

  editProduct: (productId, productDetails) => {
    try {
      return new Promise((resolve, reject) => {
        productModel
          .findByIdAndUpdate(
            { _id: productId },
            {
              $set: {
                name: productDetails.name,
                category: productDetails.category,
                price: productDetails.price,
                description: productDetails.description,
                image: productDetails.image,
              },
            }
          )
          .then((response) => {
            resolve();
          });
      });
    } catch (error) {
      console.log(error);
    }
  },
};
