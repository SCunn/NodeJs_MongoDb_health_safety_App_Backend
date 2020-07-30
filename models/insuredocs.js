let mongoose = require('mongoose');

//  Schema  for Insurance Documents
let insurSchema = mongoose.Schema({

    file_type:{
        type: String
    },
    file_name:{
        type: String
    },
    updated:{ 
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['approved','pending','unapproved'],
        default: 'pending'
    },
    comment:{
        type: String
    },
    // Sets up the issue and expiry dates of the document, for potential front-end plugin
    expiry_date:{
        type: String
         
    },
    issue_date:{
        type: String
        
    }
});

// let Insuredoc = module.exports = mongoose.model('Insuredoc', insurSchema);
module.exports = insurSchema;