let mongoose = require('mongoose');

// var Schema = mongoose.Schema;

// const followSchema = new Schema({

let followSchema = mongoose.Schema({
    requester: { type: mongoose.Schema.ObjectId, ref: 'User'},
    recipient: { type: mongoose.Schema.ObjectId, ref: 'User'},
    following: { type: mongoose.Schema.ObjectId, ref: 'User'},
    follower: { type: mongoose.Schema.ObjectId, ref: 'User'},
    status: {
      type: String,
      enums: ['requested', 'pending', 'connected']
   
    }
  }, {timestamps: true})

  module.exports = followSchema;
  
  // module.exports =  mongoose.model('Follow', followSchema)