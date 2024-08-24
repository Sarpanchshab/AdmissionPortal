const mongoose = require('mongoose')
const localurl = 'mongodb://127.0.0.1:27017/AdmissionPortal';
const live_url = 'mongodb+srv://monu1999june:monu1234@cluster0.m4jdf.mongodb.net/AdmissionPortal?retryWrites=true&w=majority&appName=Cluster0'

const connectDB = () => {
    return mongoose.connect(live_url)
        .then(() => {
            console.log('connecting succesfully')
        })
        .catch((error) => {
            console.log(error)
        });
};

module.exports=connectDB