const mongoose = require("mongoose")
require("dotenv").config()

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (error, client) => {
    if (error){
        console.log(process.env.MONGO_URL)
        return console.log(error.message)
    }

    console.log("connected to db!")
})