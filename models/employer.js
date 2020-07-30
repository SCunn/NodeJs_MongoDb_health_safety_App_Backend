let mongoose = require('mongoose');

// let insurSchema = require('./insuredocs');
// let assetSchema = require('./assets');
// let certSchema = require('./certificate');
// let followSchema = require('./follow');

// const FKHelper = require('../helpers/foreign-key-helper');


// let Statement = module.exports = mongoose.model('Statement', safeSchema);

// employer details Schema
let employerSchema = mongoose.Schema({
    
    company_name:{
        type: String
    },
    business_type:{
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
    company_logo:{
        type: String 
    },
    business_email:{
        type: String
    },
    phone:{
        type: String
    },
    address:{
        type: String
    }

});


module.exports = employerSchema;