const CourseModel = require("../models/course")


class CourseController {

    static courseInsert = async (req, res) => {
        try {
            const { id } = req.userdata //jo course insert krega uski id bhej rahe hai
            const { name, email, phone, dob, address, gender, education, course, } = req.body
            const result = new CourseModel({
                name: name,
                email: email,
                phone: phone,
                dob: dob,
                gender: gender,
                address: address,
                education: education,
                course: course,
                user_id: id
            });
            await result.save();
            res.redirect('/course_display')

        } catch (error) {
            console.log(error)
        }
    }
    static courseDisplay = async (req, res) => {
        try {
            const { name, image, email,id} = req.userdata
            const course = await CourseModel.find({user_id:id})
            //console.log(course)
            res.render('course/display',{n:name,e:email,image:image,course:course })
        } catch (error) {
            console.log(error)
        }
    }
    static courseView = async (req, res) => {
        try {
            const{name,image,email,id }=req.userdata
            const course = await CourseModel.findById(req.params.id)
                //console.log(course)
            
            res.render('course/view',{n:name,e:email,image:image,course:course})
        } catch (error) {
            console.log(error)
        }
    }
    static courseEdit = async (req, res) => {
        try {
            const{name,image,email,id }=req.userdata
            const course = await CourseModel.findById(req.params.id);
               //console.log(req.body)
            
            res.render('course/edit',{n:name,e:email,image:image,course:course})
        } catch (error) {
            console.log(error)
        }
    }
    static courseUpdate = async (req, res) => {
        try {
            
            const { name, email, phone, dob, address, gender, education, course, } = req.body
            
                const update = await CourseModel.findByIdAndUpdate(req.params.id,{
                 name: name,
                 email: email,
                 phone: phone,
                 dob: dob,
                 gender: gender,
                 address: address,
                 education: education,
                 course: course
                
            } )
              res.redirect('/course_display')

        } catch (error) {
            console.log(error)
        }
    }
    static courseDelete = async (req, res) => {
        try {
            const{name,image,email,id }=req.userdata
            const course = await CourseModel.findByIdAndDelete(req.params.id);
            res.redirect('/course_display')             
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = CourseController