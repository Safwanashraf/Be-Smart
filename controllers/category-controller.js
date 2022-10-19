//////////////////////////////////

/* REQUIRE */
const categoryModel = require("../models/category");

//////////////////////////////////

/* EXPORTS */
module.exports = {
  addCategory: (categoryData) => {
    try {
      return new Promise(async (resolve, reject) => {
        let category = await categoryModel
          .findOne({ name: categoryData.name })
          .lean();
          
        if (category) {
          resolve({ nameError: true });
        } else {
          categoryModel.create(categoryData).then((data) => {
            resolve(data);
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  },

  getAllCategory: () => {
    try {
      return new Promise((resolve, reject) => {
        categoryModel
          .find()
          .lean()
          .then((categories) => {
            resolve(categories);
          });
      });
    } catch (error) {
      console.log(error);
    }
  },

  deleteCategory: (categoryId) => {
    try {
      return new Promise((resolve, reject) => {
        categoryModel.findByIdAndDelete(categoryId).then((response) => {
          resolve(response);
        });
      });
    } catch (error) {
      console.log(error);
    }
  },

  getCategoryDetails: (categoryId) => {
    try {
      return new Promise((resolve, reject) => {
        categoryModel
          .findOne({ _id: categoryId })
          .lean()
          .then((category) => {
            resolve(category);
          });
      });
    } catch (error) {
      console.log(error);
    }
  },

  editCategory: (categoryId, categoryDetails) => {
    try {
      return new Promise((resolve, reject) => {
        categoryModel
          .findByIdAndUpdate(categoryId, {
            $set: {
              name: categoryDetails.name,
            },
          })
          .then((response) => {
            resolve();
          });
      });
    } catch (error) {
      console.log(error);
    }
  },
};
