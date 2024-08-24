const jwt = require('jsonwebtoken')
const UserModel = require('../models/user')
 


const checkAuth = async (req,res,next)=>{
    const {token} = req.cookies
    if(!token){
        req.flash('error','Unauthorised user Please login')
        res.redirect('/')
    
    }else{
        const verifylogin= jwt.verify(token,'pninfosys123@#48')
        //console.log(verifylogin) //ID:3263464651dffgrfg
        const data = await UserModel.findOne({_id:verifylogin.ID}) //main code
        // console.log(data)
        req.userdata = data //ye req wahi jayegi jahase aai hai
        next()
    }
}


module.exports =checkAuth