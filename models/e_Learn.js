let mongoose = require('mongoose');

// Article Schema  for E-Learning Data
let e_LearnSchema = mongoose.Schema({

    media_type:{
        type: String,
        required: true
    },
    subject:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    }
});

module.exports = e_LearnSchema;