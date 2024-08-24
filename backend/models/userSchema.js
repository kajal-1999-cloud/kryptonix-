const mongoose = require('mongoose')

const Schema = mongoose.Schema
const userSchema =  new Schema({

    name:{type:String},
    email:{type:String, required:true, unique: true},
    password:{
        type: String
      
    },
    todo :[ {
        type:mongoose.Schema.Types.ObjectId, ref:"todo"
    }]
},  { timestamps: true })

const USerModel = mongoose.model('registerUser', userSchema)

module.exports = {USerModel}