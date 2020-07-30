let mongoose = require('mongoose');

let workersSchema = mongoose.Schema({
    employees:{type: mongoose.Schema.ObjectId, ref: 'User'},
    my_employee:{type: mongoose.Schema.ObjectId, ref: 'User'},

    employer:{type: mongoose.Schema.ObjectId, ref: 'User'},
    my_employer:{type: mongoose.Schema.ObjectId, ref: 'User'},
    
    status: {
        type: String,
        enums: ['requested', 'pending', 'connected']
    }
}, {timestamps: true})

module.exports = workersSchema;