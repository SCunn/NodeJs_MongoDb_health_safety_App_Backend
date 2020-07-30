let mongoose = require('mongoose');

// certificates Schema
let adminSchema = mongoose.Schema({

    first_name:{
        type: String,
        required: true
    },
    last_name:{
        type: String,
        required: true
    },
    profile_image:{
        type: String,
        required: true
    }
});

// let Admin = module.exports = mongoose.model('Admin', adminSchema);

module.exports = adminSchema;