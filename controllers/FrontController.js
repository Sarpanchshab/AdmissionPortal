const UserModel = require('../models/user')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary').v2
var jwt = require('jsonwebtoken');
const CourseModel = require('../models/course')
const randomstring = require("randomstring");

cloudinary.config({
  cloud_name: 'dfpkxjf3y',
  api_key: '882943454568449',
  api_secret: 'QaWojDLtTyJ4L8eA8OCQ9EPsV8o'
});

class FrontController {

  static home = async (req, res) => {
    try {
      const { name, image, email, id } = req.userdata
      const btech = await CourseModel.findOne({ user_id: id, course: "btech" });
      const bca = await CourseModel.findOne({ user_id: id, course: "bca" });
      const mca = await CourseModel.findOne({ user_id: id, course: "mca" });
      res.render('home', { n: name, image: image, e: email, btech: btech, bca: bca, mca: mca })//response dega
    } catch (error) {
      console.log(error)
    }
  }
  static about = async (req, res) => {
    try {
      const { name, image, email } = req.userdata
      res.render('about', { n: name, image: image, e: email })
    } catch (error) {
      console.log(error)
    }
  }
  static login = async (req, res) => {
    try {
      res.render('login', { message: req.flash('error') })
    } catch (error) {
      console.log(error)
    }
  }
  static register = async (req, res) => {
    try {
      res.render('register', { message: req.flash('error') });
    } catch (error) {
      console.log(error)
    }
  }
  static contact = async (req, res) => {
    try {
      const { name, image, email } = req.userdata
      res.render('contact', { n: name, image: image, e: email })
    } catch (error) {
      console.log(error)
    }
  }
  static insertRegister = async (req, res) => {
    try {
      //console.log(req.files.image)
      const file = req.files.image
      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "profile_image"
      })
      // console.log(imageUpload)

      const { n, e, p, cp } = req.body
      const user = await UserModel.findOne({ email: e })

      if (user) {
        req.flash('error', 'Email already Exists')
        res.redirect("/register")
      }
      else {
        if (n && e && p && cp) {
          if (p == cp) {
            const hashPassword = await bcrypt.hash(p, 10)
            const result = new UserModel({
              name: n,
              email: e,
              password: hashPassword,
              image: {
                public_id: imageUpload.public_id,
                url: imageUpload.secure_url
              },
            });
            const Userdata = await result.save();
            if (Userdata) {
              const token = jwt.sign(
                {
                  ID: Userdata.id
                },
                "pninfosys123@#48"
              )
              res.cookie("token", token);
              this.sendVerifymail(n, e, Userdata._id);

              //redirect to login page
              req.flash(
                "success",
                "Registration Success plz verify your email"
              )
              res.redirect('/register')
            } else {
              req.flash("error" / "Not Register.")
              res.redirect("/register");
            }
            req.flash("Success", "Register success! plz login")
            res.redirect("/")// url
          } else {
            req.flash('error', 'Password doesnot match')
            res.redirect("/register")
          }
        } else {
          req.flash('error', 'All Fields are Required')
          res.redirect("/register")
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  static verifylogin = async (req, res) => {
    try {
      //console.log(req.body)
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email: email });
      //console.log(user);
      if (user != null) {
        const ismatch = await bcrypt.compare(password, user.password);
        //console.log(ismatch)
        if (ismatch) {
          if (user.role == "user" && user.is_verified == 1) {
            const token = jwt.sign({ ID: user._id }, "pninfosys123@#48");
            //console.log(token)
            res.cookie("token", token);

            res.redirect("/home");
          } else if (user.role == "admin" && user.is_verified == 1) {
            const token = jwt.sign({ ID: user._id }, "pninfosys123@#48");
            //console.log(token)
            res.cookie("token", token);

            res.redirect("/admin/display");
          } else {
            req.flash("error", "Please verify your email address.")
            res.redirect("/")
          }
          //token
        } else {
          req.flash("error", "Email or password is not match.");
          res.redirect("/");
        }
      } else {
        req.flash("error", "You are not registered user.");
        res.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  }
  static logout = async (req, res) => {
    try {
      res.clearCookie('token')
      res.redirect('/')
    } catch (error) {
      console.log(error)
    }
  }

  static profile = async (req, res) => {
    try {
      const { name, image, email } = req.userdata
      res.render('profile', { name: name, image: image, email: email })
    } catch (error) {
      console.log(error)
    }
  }

  static changePassword = async (req, res) => {
    try {
      const { id } = req.userdata;
      //console.log(req.body)
      const { op, np, cp } = req.body;
      if (op && np && cp) {
        const user = await UserModel.findById(id);
        const isMatched = await bcrypt.compare(op, user.password);
        //console.log(isMatched)
        if (!isMatched) {
          req.flash("error", "Current password is incorrect ");
          res.redirect("/profile");
        } else {
          if (np != cp) {
            req.flash("error", "Password does not match");
            res.redirect("/profile");
          } else {
            const newHashPassword = await bcrypt.hash(np, 10);
            await UserModel.findByIdAndUpdate(id, {
              password: newHashPassword,
            });
            req.flash("success", "Password Updated successfully ");
            res.redirect("/");
          }
        }
      } else {
        req.flash("error", "ALL fields are required ");
        res.redirect("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static updateProfile = async (req, res) => {
    try {
      const { id } = req.userdata;
      const { name, email, role } = req.body;
      if (req.files) {
        const user = await UserModel.findById(id);
        const imageID = user.image.public_id;
        // console.log(imageID);

        //deleting image from Cloudinary
        await cloudinary.uploader.destroy(imageID);
        //new image update
        const imagefile = req.files.image;
        const imageupload = await cloudinary.uploader.upload(
          imagefile.tempFilePath,
          {
            folder: "profile_image",
          }
        );
        var data = {
          name: name,
          email: email,
          image: {
            public_id: imageupload.public_id,
            url: imageupload.secure_url,
          },
        };
      } else {
        var data = {
          name: name,
          email: email,
        };
      }
      await UserModel.findByIdAndUpdate(id, data);
      req.flash("success", "Update Profile successfully");
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  static sendVerifymail = async (name, email, user_id) => {
    //console.log(name, email, user_id);
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
      subject: "For Verification mail", // Subject line
      text: "heelo", // plain text body
      html:
        "<p>Hii " +
        name +
        ',Please click here to <a href="http://localhost:3000/verify?id=' +
        user_id +
        '">Verify</a>Your mail</p>.',
    });
    //console.log(info);
  };

  static verifyMail = async (req, res) => {
    try {
      const updateinfo = await UserModel.findByIdAndUpdate(req.query.id, {
        is_verified: 1,
      });
      if (updateinfo) {
        res.redirect("/home");
      }
    } catch (error) {
      console.log(error)
    }
  }

  static forgotPassword = async (req, res) => {
    try {
      res.render("forgotPassword", { msg: req.flash("error") })
    } catch (error) {
      console.log(error)
    }
  }

  static forgetPasswordVerify = async (req, res) => {
    try {
      const { email } = req.body;
      const userdata = await UserModel.findOne({ email: email })
      //console.log(userdata)
      if (userdata) {
        const randomString = randomstring.generate();
        //console.log(randomString)
        await UserModel.updateOne(
          { email: email },
          { $set: { token: randomString } }
        )
        this.sendEmail(userdata.name,userdata.email, randomString)
        req.flash("success", "Plz Check Your mail to reset Your Password!")
        res.redirect("/")
      } else {
        req.flash("error", "You are not a registerd Email")
        res.redirect("forgotPassword")
      }
    } catch (error) {
      console.log(error)
    }
  }

  static sendEmail = async (name, email, token) => {
    //console.log(name, email, user_id);
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
      subject: "Reset Password", // Subject line
      text: "heelo", // plain text body
      html:
        "<p>Hii " +
        name +
        ',Please click here to <a href="http://localhost:3000/reset-password?token=' +
        token +
        '">Reset</a>Your mail</p>.',
    });
    //console.log(info);
  };

  static resetPassword = async (req,res)=>{
    try {
      const token = req.query.token;
      const tokenData = await UserModel.findOne({token:token})
      if(tokenData){
        res.render("reset-password",{user_id:tokenData._id});
     
      }
      else{
        res.render("404")
      }
    } catch (error) {
      console.log(error)
    }
  }

  static reset_Password1 = async (req,res)=>{
    try {
      const{ password,user_id}= req.body
      const newHashPassword = await bcrypt.hash(password,10);
      await UserModel.findByIdAndUpdate(user_id,{
        password: newHashPassword,
        token:"",
      })
      req.flash("success","Reset Password Updated Succesfully");
      res.redirect("/")
    } catch (error) {
      console.log(error)
    }
  }

}
module.exports = FrontController