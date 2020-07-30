var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


let employerSchema = require('./employer');
let insurSchema = require('./insuredocs');
let assetSchema = require('./assets');
let certSchema = require('./certificate');
let safeSchema = require('./safedoc');

let employeeSchema = require('./employee');
let empCertsSchema = require('./employeeCert');

let adminSchema = require('./administration');

let instituteSchema = require('./institute');
let e_LearnSchema = require('./e_Learn');

let followSchema = require('./follow');
let workersSchema = require('./worker');

//////////////////////////////


var UserSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },    
    role: {
        type: String,
        enum: ['admin', 'employer', 'employee', 'institute'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    followed: [followSchema],
    employment:[workersSchema],
    

    employeeDetails:[employeeSchema],
    employeeCerts:[empCertsSchema],

    employerDetails:[employerSchema],
    insurance:[insurSchema],

    assets:[assetSchema]
    ,
    assetCerts:[certSchema]
    ,
    safety_statements:[safeSchema],
    
    adminDetails:[adminSchema],

    instituteDetails:[instituteSchema],
    e_learning:[e_LearnSchema]


});

UserSchema.pre('save', function(next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function(err, isMatch){
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};




// var User = mongoose.model('User', UserSchema);
module.exports = mongoose.model('User', UserSchema);