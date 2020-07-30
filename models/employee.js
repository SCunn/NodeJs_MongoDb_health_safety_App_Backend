let mongoose = require('mongoose');


// certificates Schema
let employeeSchema = mongoose.Schema({

    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    mobile_phone:{
        type: String,
        required: true
    },
    photo_id:{
        type: String,
        required: true
    },
    status:{
        type:String,
        enum:['Active','Inactive'],
        default: 'Inactive'
    },
    QR_Tag:{
        type: String
    }

});

//let Employee = module.exports = mongoose.model('Employee', employSchema);

module.exports = employeeSchema;