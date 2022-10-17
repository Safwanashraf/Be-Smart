const productModel = require('../models/product')

module.exports={
    addproduct: (productData) => {
        return new Promise(async (resolve, reject) => {
                productModel.create(productData).then((data) => {
                    // console.log(data);
                    resolve(data)
                    
                })
        })
    },
    getAllProduct: () => {
        return new Promise(async (resolve, reject) => {
            const products=await productModel.find().populate('category').lean()
            // let products =  productModel.find().toArray()
            resolve(products)
            
        })
    },
    deleteProduct: (productId) => {
        return new Promise((resolve, reject) => {
            productModel.findByIdAndDelete(productId).then((response) => {
                resolve(response)
            })
        })
    }, 
    getProductDetails: (productId) => {
        return new Promise((resolve, reject) => {
            productModel.findOne({ _id: (productId) }).lean().then((product) => {
                resolve(product)
            })

        })
    },
    editProduct: (productId, productDetails) => {
        return new Promise((resolve, reject) => {
                productModel.findByIdAndUpdate({_id: productId}, {
                    $set: {
                        name: productDetails.name,
                        category: productDetails.category,
                        price: productDetails.price,
                        description: productDetails.description,
                        image: productDetails.image
                    }
                }).then((response) => {
                    
                    resolve()
                })
        })
    },
}
