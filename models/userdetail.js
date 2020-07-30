let mongoose = require('mongoose');

// certificates Schema
let userDetailSchema = mongoose.Schema({
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    company_name:{
        type: String
    },
    business_type:{
        type: String
    },
    company_logo:{
        type: String
    },
    business_email:{
        type: Array
    },
    phone:{
        type: Array
    },
    address:{
        type: Array
    }
});

let Userdetail = module.exports = mongoose.model('Userdetail', userDetailSchema);