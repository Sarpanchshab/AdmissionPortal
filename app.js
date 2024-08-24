const express = require('express')
const app = express()
const port = 3000 
const web = require('./routes/web')
const connectDB = require('./db/connectdb')




const cookieParser =require('cookie-parser')
//token get hoga jo cookie me store hoga bo
app.use(cookieParser())

//temporary file store karne ke liye
const fileUpload= require("express-fileupload");
//Temp file uploader
app.use(fileUpload({useTempFiles: true}));

//connect flash and sessions
const session = require('express-session')
const flash = require('connect-flash')
//message
app.use(session({
    secret:'secret',
    cookie:{ maxAge: 60000},
    resave: false,
    saveUninitialized: false,
}));
//Flash message
app.use(flash());


 //mongodb ko connec karne ke liye
connectDB() //connect

//jo data aata hai bo simple language me hota to object me convert ke liye ye code use krege
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

//public html css link
app.use(express.static('public'))

//html css view
app.set('view engine', 'ejs')

//route load
app.use('/', web)



//server create
app.listen(port, ()=> {
    console.log(`Server Start localhost: ${port}`)
}) 