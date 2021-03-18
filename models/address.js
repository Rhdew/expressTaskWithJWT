const mongoose = require('mongoose')

const addressSchema = mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    pinCode:{
        type:Number,
        required:true
    },
    phone:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('Address',addressSchema)