let User = require('../models/user');
const Follow = require('../models/follow');


var _ = require('lodash');
let errorHandler = require('../helpers/dbErrorHandler');

// exports.userByID = (req, res, next, id) => {
//     User.findById(id)
//       .populate('following', '_id')
//       .populate('followers', '_id')
//       .exec((err, user) => {
//       if (err || !user) return res.status('400').json({
//         error: "user not found"
//       })
//       req.profile = user
//       next()
//     })
//   }


exports.pushToRequster = (req, res, next) => {

  User.findOneAndUpdate(
    { _id: req.params.UserA },
    { $push: { followed: {recipient: req.params.UserB, status: 'requested' } }},

    function(err, result){
      if (err){
      return res.status(500).send(err);
     }
  
      // res.json(result);
      next()
    }
  )
  
}

exports.pushToRecipient = (req, res) => {

User.findOneAndUpdate(
    { _id: req.params.UserB },
    // { $push: { followed: req.params.UserA }},

    { $push: { followed: {requester: req.params.UserA, status: 'pending' } } },


    function(err, result){
      if (err){
      return res.status(500).send(err);
     }
  
      res.json(result);
      // next()
    }
)

}



exports.acceptRequest_AB = (req, res, next) => {
  User.findOneAndUpdate(
    // { requester: req.params.UserA, recipient: req.params.UserB },
    { _id: req.params.UserA },
    // set status to 'connected'
    { $addToSet: { followed: {following: req.params.UserB, status: 'connected', createdAt: Date.now() } }},
    // { $set: { status: 3 }},
    { upsert: true, new: true },

    function(err, result){
      if (err){
      return res.status(500).send(err);
     }
      // res.json(result);
      next()
    }
  )
}

exports.updateA = (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.params.UserA },
    { $pull: { followed: { recipient: req.params.UserB }}},

    function(err, result){
      if (err){
      return res.status(500).send(err);
     }
  
      // res.json(result);
      next()
    }
  )
}



exports.acceptRequest_BA = (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.params.UserB },
    // set status to 'connected'
    { $addToSet: { followed: {follower: req.params.UserA, status: 'connected', createdAt: Date.now() } }},
    
    { upsert: true, new: true },

    function(err, result){
      if (err){
      return res.status(500).send(err);
     }
      // res.json(result);
      next()
    }
  )
}

exports.updateB = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.UserB },
    { $pull: { followed: { requester: req.params.UserA } }},

    function(err, result){
      if (err){
      return res.status(500).send(err);
     }
  
      res.json(result);
      // next()
    }
  )
  
}




exports.remove1 = (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.params.UserA },
    { $pull: { followed: { following: req.params.UserB }}},


    function(err, result){
      if (err){
      return res.status(500).send(err);
     }
  
      // res.json(result);
      next()
    }
  )
}

exports.remove2 = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.UserB },
    { $pull: { followed: { follower: req.params.UserA }}},

    function(err, result){
      if (err){
      return res.status(500).send(err);
     }
  
      res.json(result);
      // next()
    }
  )
}



exports.reject1 = (req, res, next) => {
  Follow.findOneAndRemove(
    { requester: req.params.UserA, recipient: req.params.UserB },
    function(err, result){
      if (err){
      return res.status(500).send(err);
     }
  
      // res.json(result);
      next()
    }
  )
}

exports.reject2 = (req, res, next) => {
  Follow.findOneAndRemove(
    { recipient: req.params.UserA, requester: req.params.UserB },
    function(err, result){
      if (err){
      return res.status(500).send(err);
     }
  
      // res.json(result);
      next()
    }
  )
}





// Begining of Add Employer/ Employee Logic

exports.pushToEmployer = (req, res, next) => {

  User.findOneAndUpdate(
    { _id: req.params.Employee },
    { $push: { employment: {employer: req.params.Employer, status: 'pending' } }},

    function(err, result){
      if (err){
      return res.status(500).send(err);
     }
  
      // res.json(result);
      next()
    }
  )
  
}

exports.pushToEmployees = (req, res) => {

User.findOneAndUpdate(
    { _id: req.params.Employer },
    { $push: { employment: {employees: req.params.Employee, status: 'requested' } } },


    function(err, result){
      if (err){
      return res.status(500).send(err);
     }
  
      res.json(result);
      // next()
    }
)

}

exports.accept_AB = (req, res, next) => {
  User.findOneAndUpdate(
    // { requester: req.params.UserA, recipient: req.params.UserB },
    { _id: req.params.Employee },
    // set status to 'connected'
    { $addToSet: { employment: {my_employer: req.params.Employer, status: 'connected', createdAt: Date.now() } }},
    // { $set: { status: 3 }},
    { upsert: true, new: true },

    function(err, result){
      if (err){
      return res.status(500).send(err);
     }
      // res.json(result);
      next()
    }
  )
}

exports.update_Employee = (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.params.Employee },
    { $pull: { employment: { employer: req.params.Employer }}},

    function(err, result){
      if (err){
      return res.status(500).send(err);
     }
  
      // res.json(result);
      next()
    }
  )
}



exports.accept_BA = (req, res, next) => {
  User.findOneAndUpdate(
    // { recipient: req.params.UserA, requester: req.params.UserB },

    { _id: req.params.Employer },
    // set status to 'connected'
    { $addToSet: { employment: {my_employee: req.params.Employee, status: 'connected', createdAt: Date.now() } }},
    // { $set: { status: 3 }},
    { upsert: true, new: true },

    function(err, result){
      if (err){
      return res.status(500).send(err);
     }
      // res.json(result);
      next()
    }
  )
}

exports.update_Employer = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.Employer },
    { $pull: { employment: { employees: req.params.Employee } }},

    function(err, result){
      if (err){
      return res.status(500).send(err);
     }
  
      res.json(result);
      // next()
    }
  )
  
}



exports.drop1 = (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.params.UserA },
    { $pull: { employment: { my_employer: req.params.UserB }}},


    function(err, result){
      if (err){
      return res.status(500).send(err);
     }
  
      // res.json(result);
      next()
    }
  )
}

exports.drop2 = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.UserB },
    { $pull: { employment: { my_employee: req.params.UserA }}},

    function(err, result){
      if (err){
      return res.status(500).send(err);
     }
  
      res.json(result);
      // next()
    }
  )
}



exports.deny1 = (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.params.Employee },
    { $pull: { employment: { employer: req.params.Employer }}},
    // { employees: req.params.Employee, employer: req.params.Employer },
    function(err, result){
      if (err){
      return res.status(500).send(err);
     }
  
      // res.json(result);
       next()
    }
  )
}

exports.deny2 = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.Employer },
    { $pull: { employment: { employees: req.params.Employee }}},
    // { employer: req.params.Employee, employees: req.params.Employer },
    function(err, result){
      if (err){
      return res.status(500).send(err);
     }
  
      res.json(result);
      // next()
    }
  )
}

// Begining of Share Asset Cert docID

exports.pushToAssetCert = (req, res, next) => {

  User.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { assetCerts: {shared: {recipient: req.params.docID, status: 'pending' } } } },

    function(err, result){
      if (err){
      return res.status(500).send(err);
     }
  
      // res.json(result);
      next()
    }
  )
  
}

exports.pushToUserID = (req, res) => {

  User.findById(req.params.id2, 'assetCerts' ,function(err, details){
        if(err){
          return res.status(500).json({
              error: 'Error reading user: ' + err,
            });
      } 
      var subDoc = details.assetCerts.id(req.params.docID); 

      if(!subDoc){
        res.status(422).json({error: 'No Employer Details found.'});
            
     } else {
       subDoc.push({
         shared: { 
           requester: req.params.id,
           status: 'requested'        
        }
       });

       details.save().then(function(savedReview){
        // res.json(subDoc);
      }).catch(function(err){
        res.status(500).send(err);
    });
     }
     res.status(200).json(details)
  })
}



exports.accept_1 = (req, res, next) => {
  User.findById(req.params.id, 'assetCerts' , function(err, details){
    if(err){
      return res.status(500).json({
        error: 'Error reading user: ' + err,
      });
    }
    
    var subDoc = details.assetCerts.id(req.params.doc1)
    
  if(!subDoc){
    res.status(422).json({error: 'No Employer Details found.'});
        
    } else {
        subDoc.set({
           shared: { 
             sharing: req.params.doc2,
             status: 'connected'        
          }
        });
      details.save().then(function(savedReview){
        // res.json(subDoc);
      }).catch(function(err){
      res.status(500).send(err);
      });
    }
    next()
  })
}


exports.update1 = (req, res, next) => {
  
  User.findById(req.params.id, 'assetCerts', function(err, details){
      if(err){
        res.status(500).json({
            error: 'Error reading user: ' + err,
          });
          
      }
      var subDoc = details.assetCerts.id(req.params.doc1)
      console.log("Flag:  " + req.params.doc1)
      if(!subDoc){
        res.status(422).json({error: 'No Details found.'});

      } else {
        subDoc.remove({
          shared:{
            recipient: req.params.doc2
          }
        });
        details.save().then(function(savedReview){
          res.json(subDoc);
        }).catch(function(err){
        res.status(500).send(err);
        });
      }
     
      next()
  })
  
}

exports.accept_2 = (req, res, next) => {
  User.findById(req.params.id2, 'assetCerts', function(err, details){
    if(err){
      return res.status(500).json({
          error: 'Error reading user: ' + err,
        });
    }
    var subDoc = details.assetCerts.id(req.params.doc2);
    if(!subDoc){
      res.status(422).json({error: 'No Employer Details found.'});
    } else {
      subDoc.set({
        shared: { 
          shared_to: req.params.id,
          status: 'connected'        
       }
      });
      details.save().then(function(savedReview){
        // res.json(subDoc);
      }).catch(function(err){
      res.status(500).send(err);
      });
    }
    next()
  })
}


exports.update2 = (req, res) => {

  User.findById(req.params.id2, 'assetCerts', function(err, details){
    if(err){
      return res.status(500).json({
          error: 'Error reading user: ' + err,
        });
    }
    var subDoc = details.assetCerts.id(req.params.doc2)
      if(!subDoc){
        res.status(422).json({error: 'No Details found.'});

      } else {
        subDoc.remove({       
          shared: { 
            requester: req.params.id 
         }
        });
        details.save().then(function(savedReview){
          res.json(subDoc);
        }).catch(function(err){
        res.status(500).send(err);
        });
      }
      // res.json(details);
  })
}