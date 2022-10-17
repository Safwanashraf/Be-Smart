const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    password: String,
    confirmPassword: String,
isActive: {
    type: Boolean,
    default:1
}
})

module.exports = mongoose.model("Users",userSchema)


