const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    image:{
        public_id:{
            type:String
        },
        url:{
            type:String
        }
    },
    role:{
        type: String,
        default:'user'
    },
    token: {
        type:String
    },
    is_verified:{
        type:Number,
        default:0
    }
})

//create collection
const UserModel= mongoose.model('user',UserSchema)

module.exports = UserModel