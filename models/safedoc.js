let mongoose = require('mongoose');


//  Schema  for Safety Statements
let safeSchema = mongoose.Schema({

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

// let Statement = module.exports = mongoose.model('Statement', safeSchema);
module.exports = safeSchema;