const express = require('express')
const FrontController = require('../controllers/FrontController')
const route = express.Router()
const checkAuth= require('../middleware/auth')
const CourseController = require('../controllers/CourseController')
const AdminController = require('../controllers/AdminController')
const islogin = require('../middleware/islogin')

//routing
route.get("/",islogin, FrontController.login);
route.get('/home',checkAuth,FrontController.home)
route.get('/about',checkAuth,FrontController.about)
route.get('/',FrontController.login)
route.get('/register',FrontController.register)
route.get('/contact',checkAuth,FrontController.contact)
route.get('/logout',FrontController.logout)

//insertdata 
route.post('/insertregister',FrontController.insertRegister)
route.post('/verifylogin',FrontController.verifylogin)


//Profile Work
route.get('/profile',checkAuth,FrontController.profile)
route.post('/changePassword',checkAuth,FrontController.changePassword)
route.post('/updateProfile',checkAuth,FrontController.updateProfile)


//CourseController
route.post('/course_insert',checkAuth,CourseController.courseInsert)
route.get('/course_display',checkAuth,CourseController.courseDisplay)
route.get('/courseView/:id',checkAuth,CourseController.courseView)
route.get('/courseEdit/:id',checkAuth,CourseController.courseEdit)
route.get('/courseDelete/:id',checkAuth,CourseController.courseDelete)
route.post('/course_update/:id',checkAuth,CourseController.courseUpdate)

//AdminController
route.get('/admin/display',checkAuth,AdminController.display)
route.post('/admin/updateStatus/:id',checkAuth,AdminController.updateStatus)

route.get('/verify',FrontController.verifyMail)
route.get('/forgotPassword',FrontController.forgotPassword)
route.post('/forget_Password',FrontController.forgetPasswordVerify)
route.get('/reset-password',FrontController.resetPassword)
route.post('/reset_password1',FrontController.reset_Password1)

 




module.exports = route