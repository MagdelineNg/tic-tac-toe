const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    user: {
        type: String,
        min: 4,
        max: 24, 
        unique: true,
        required: true,
    },
    password:{
        type: String,
        required: true,
        min: 8,
    },
    // socketId:{
    //     type: String
    // }
})

module.exports = mongoose.model("Users", userSchema)