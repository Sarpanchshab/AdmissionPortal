const CourseModel = require('../models/course')
const nodemailer= require('nodemailer')


class AdminController {


    static display = async (req, res) => {
        try {
            const { name, image, email } = req.userdata
            const course = await CourseModel.find()
            res.render('admin/display', { n: name, image: image, course: course })
        } catch (error) {
            console.log(error)
        }
    }

    static updateStatus = async (req, res) => {
        try {
            //console.log(req.body)
            const { comment, name, email, status } = req.body;         
            const update = await CourseModel.findByIdAndUpdate(req.params.id, {
                status: req.body.status,
                comment: req.body.comment
            })
            // this.sendEmail(name,email,status,comment) // yahi ka code send karege.
            //console.log(email)
            res.redirect('/admin/display')
        } catch (error) {
            console.log(error)
        }
    }

    static sendEmail = async (name, email, status, comment) => {
        console.log(name,email,status,comment)
        // connenct with the smtp server
    
        let transporter = await nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
    
          auth: {
            user: "monu1999june@gmail.com",
            pass: "lhqmyptwemgwjlwx",
          },
        });
        let info = await transporter.sendMail({
          from: "test@gmail.com", // sender address
          to: email, // list of receivers
          subject: ` Course ${status}`, // Subject line
          text: "heelo", // plain text body
          html: `<b>${name}</b> Course  <b>${status}</b> successful! <br>
             <b>Comment from Admin</b> ${comment} `, // html body
        });
      };
    

}

module.exports = AdminController