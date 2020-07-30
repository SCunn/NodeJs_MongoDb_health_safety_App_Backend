let mongoose = require('mongoose');

// let certSchema = require('./certificate');

// assets Schema
let assetSchema = mongoose.Schema({
    asset_type:{
        type: String,
        enum:[
            'Water',
            'Roads',
            'Environment',
            'Construction',
            'Quarying',
            'Administration',
            'Agricultural Services & Products',
            'Automotive',
            'Fishing',
            'Oil & Gas',
            'Pharmaceutical',
            'Retail and Hospitality',
            'Haulage & Transportation',
            'Security',
            'Healthcare',
            'Childcare',
            'Forestry',
            'Employee'
        ],
        required: true
    },
    status:{
        type:String,
        enum:['Active','Inactive'],
        default:'Inactive'
    },
    asset_image:{
        type: String
    },
    QR_Tag:{
        type: String
    },
    asset_name:{
        type: String
    },


    firstname:{
        type: String
    },
    lastname:{
        type: String
    },
    mobile_phone:{
        type: String
    },
    photo_id:{
        type: String
    },
    email:{
        type: String
    }
});

// let Asset = module.exports = mongoose.model('Asset', assetSchema);
module.exports = assetSchema;