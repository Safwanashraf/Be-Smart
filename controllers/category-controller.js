const categoryModel = require('../models/category')
const bcrypt = require('bcrypt')

module.exports={
    addCategory: (categoryData) => {
        try {
            
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
        } catch (error) {
            console.log(error)
        }
    },
    getAllCategory: () => {
        try {
            
            return new Promise( (resolve, reject) => {
                categoryModel.find().lean().then((categories)=>{
                    resolve(categories)
    
                })
                // let categories = await category.find().toArray().lean()
                // console.log(categories);
            })
        } catch (error) {
            console.log(error)
        }
    },
    deleteCategory: (categoryId) => {
        try {
            
            return new Promise((resolve, reject) => {
                categoryModel.findByIdAndDelete(categoryId).then((response) => {
                    // console.log(response)
                    resolve(response)
                })
            })
        } catch (error) {
            console.log(error)
        }
    },
    getCategoryDetails: (categoryId) => {
        try {
            
            return new Promise((resolve, reject) => {
                categoryModel.findOne({ _id: (categoryId) }).lean().then((category) => {
                    resolve(category)
                })
    
            })
        } catch (error) {
            console.log(error)
        }
    },
    editCategory: (categoryId, categoryDetails) => {
        try {
            
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
        } catch (error) {
            console.log(error)
        }
    },
}