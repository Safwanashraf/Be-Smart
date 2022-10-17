const categoryModel = require('../models/category')
const bcrypt = require('bcrypt')

module.exports={
    addCategory: (categoryData) => {
        return new Promise(async (resolve, reject) => {
            let category = await categoryModel.findOne({name:categoryData.name}).lean()
            if(category){
                resolve({ nameError: true })
            }else{
                categoryModel.create(categoryData).then((data) => {
                    // console.log(data);
                    resolve(data)
                })
            }
        })
    },
    getAllCategory: () => {
        return new Promise( (resolve, reject) => {
            categoryModel.find().lean().then((categories)=>{
                resolve(categories)

            })
            // let categories = await category.find().toArray().lean()
            // console.log(categories);
        })
    },
    deleteCategory: (categoryId) => {
        return new Promise((resolve, reject) => {
            categoryModel.findByIdAndDelete(categoryId).then((response) => {
                // console.log(response)
                resolve(response)
            })
        })
    },
    getCategoryDetails: (categoryId) => {
        return new Promise((resolve, reject) => {
            categoryModel.findOne({ _id: (categoryId) }).lean().then((category) => {
                resolve(category)
            })

        })
    },
    editCategory: (categoryId, categoryDetails) => {
        return new Promise((resolve, reject) => {
            // console.log(categoryDetails);
                categoryModel.findByIdAndUpdate(categoryId, {
                    $set: {
                        name: categoryDetails.name
                    }
                }).then((response) => {
                    // console.log(response);
                    resolve()
                })
        })
    },
}