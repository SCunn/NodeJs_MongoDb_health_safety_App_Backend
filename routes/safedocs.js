const express = require('express');
const router = express.Router();

var AuthController = require('../controllers/authentication'), 
passportService = require('../config/passport'); 

var requireAuth = passport.authenticate('jwt', {session: false});


// Bring in the certificate model
let Statement = require('../models/user');


// view full safety statement collection with employer id and company name where req.user is follower               x
router.get('/viewall', requireAuth, AuthController.roleAuthorization(['admin','employer', 'institute']), function (req, res) {
    user = req.user
    // statements table data
    Statement.find({}, 'name employerDetails.company_name employerDetails.company_logo safety_statements', function(err, safety){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
              });
        }
            res.json(safety);  
    })
    .where('role').equals('employer')
    .where('followed.follower').equals(user.id)
    ;
  
});

// Route and endpoint to view indidual employer safety statement data   x
router.get('/byEmployer/:id', requireAuth, AuthController.roleAuthorization(['admin','employer', 'institute']), AuthController.isFollowing(), function (req, res) {

    Statement.findById(req.params.id, 'name employerDetails.company_name employerDetails.company_logo  safety_statements', function(err, safety){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
              });
        }
        res.json(safety);
        
    })
});

// Route and endpoint to view indidual employer safety statement data   x
router.get('/myDocs/:id', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function (req, res) {

    Statement.findById(req.params.id, 'name employerDetails.company_name employerDetails.company_logo  safety_statements', function(err, safety){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
              });
        }
        res.json(safety);
        
    })
});

// Route and endpoint to view indidual safety statement data            x
router.get('/:id/:docID', requireAuth, AuthController.roleAuthorization(['admin','employer', 'institute']), AuthController.isFollowing(), function (req, res) {

    Statement.findById(req.params.id, 'safety_statements updated', function(err, employer){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
              });
        }

        var thisDoc = employer.safety_statements.id(req.params.docID);
        res.json(thisDoc);
        }
    )
})


// Route and endpoint to view own indidual safety statement data            x
router.get('/view_own/:id/:docID', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function (req, res) {

    Statement.findById(req.params.id, 'safety_statements updated', function(err, employer){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
              });
        }

        var thisDoc = employer.safety_statements.id(req.params.docID);
        res.json(thisDoc);
        }
    )
})



// Add New safety statement to the Database collection                  x
router.put('/add/:id', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function(req, res){

    let sampleFile = req.files.sampleFile;
    file_type = sampleFile.name;

    sampleFile.mv('./public/user_docs/' + file_type, function (err) {

        if (err){

        return res.status(500).json({
            error: 'Error reading post: ' + err,
          });
        }
        console.log("Image you are uploading is " + file_type)
        // res.redirect('/');
    });

    Statement.findById( req.params.id, 'safety_statements updated',
        function (err, employer) {
            if(err){
                return res.status(500).json({
                    error: 'Error reading user: ' + err,
                  });
            }
                employer.safety_statements.push({
                file_name: req.body.file_name,
                expiry_date:  Date.parse(req.body.expiry_date), // use a calender input in frontend, Date.parse will convert the string into a number value
                issue_date:  Date.parse(req.body.issue_date),
                file_type: file_type
            });
            employer.updated = Date.now();
            employer.save(function (err, employer){
                if(err){
                    return res.status(500).json({
                        error: 'Error reading post: ' + err,
                      });
                } else {
                console.log('Statement saved: ' + req.body.file_name);
                res.json(employer);
                
                }
            });
            
        }
        );

});

// edit document details
router.put('/edit/:id/:docID', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function(req, res){

    Statement.findById(req.params.id, 'safety_statements updated', function(err, employer){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
            })
        }
        var subDoc = employer.safety_statements.id(req.params.docID);
        if(!subDoc){
            res.status(422).json({error: 'No Certificate Details found.'});
        } else {
        subDoc.set(req.body);

        employer.updated = Date.now();
        employer.save().then(function(savedReview){
            res.json(subDoc);
        }).catch(function(err){
            res.status(500).send(err);
        });
        }
    });

});

   // Upload/ update file_cert                                       x
   router.put('/updateFile/:id/:docID', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function(req, res){
    let sampleFile = req.files.sampleFile;
    file_type = sampleFile.name;
    sampleFile.mv('./public/user_docs/' + file_type, function (err) {
        if (err)
            return res.status(500).json({
                error: 'Error reading user: ' + err,
            })
        console.log("Image you are uploading is " + file_type)
        // res.redirect('/');
         
    });
    Statement.findById(req.params.id, 'safety_statements', function(err, details){   
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
            })
        }
        var subDoc = details.safety_statements.id(req.params.docID);
        if(!subDoc){
            res.status(422).json({error: 'No Certificate Details found.'});
        } else {
        subDoc.set({
            file_type: file_type   // use sampleFile instead of photo_id on the client-side form, eg. name="sampleFile" type="file" 
        });

        details.save().then(function(savedReview){
            res.json(subDoc);
        }).catch(function(err){
            res.status(500).json({
                error: 'Error reading user: ' + err,
            })
        });
        }
    });

});

// Remove safety documnet from employer                         x
router.put('/delete/:id/:docID', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function (req, res) {

    Statement.update(
        {_id: req.params.id},
        { $pull: {safety_statements: {_id: req.params.docID} } },
       
        function(err, employer) {
                if (err) { 
                    console.log(err) 
                
                }
                res.json(employer);
        }
    
    )
});

// Update (file_name or status) field in a safety document by id, pass status value as ['valid', 'pending', 'invalid']
router.put('/review/:id/:docID', requireAuth, AuthController.roleAuthorization(['admin','employer', 'institute']), AuthController.isFollowing(), function(req, res){


    Statement.findById(req.params.id, 'safety_statements updated', function(err, employer){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
            })
        }

        var subDoc = employer.safety_statements.id(req.params.docID);
        if(!subDoc){
            res.status(422).json({error: 'No Certificate Details found.'});
        } else {
        subDoc.set(req.body);

        employer.updated = Date.now();
        employer.save().then(function(savedReview){
            res.json(subDoc);
        }).catch(function(err){
            res.status(500).send(err);
        });
        }
    });

});



module.exports = router;