const mongoose = require('mongoose')

const Schema = mongoose.Schema
const todoSchema =  new Schema({

    TodoDesc:{type:String},
    Completed : {type:Boolean},
    Date:{type: String},
    user_id :{ type:mongoose.Schema.Types.ObjectId, ref:"registerUser", require: true}
    
},  { timestamps: true })

const TodoModel = mongoose.model('todo', todoSchema)

module.exports = {TodoModel}