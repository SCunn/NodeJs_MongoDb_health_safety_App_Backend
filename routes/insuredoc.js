const express = require('express');
const router = express.Router();

var AuthController = require('../controllers/authentication');
passportService = require('../config/passport'); 

var requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});




// Bring in the certificate model
let Insuredoc = require('../models/user');


// view full insurance collection with employer id and company name                 x
router.get('/viewall', requireAuth, AuthController.roleAuthorization(['admin','employer', 'institute']), function (req, res) {
    user = req.user
    // statements table data
    Insuredoc.find({}, 'name employerDetails.company_name employerDetails.company_logo insurance', function(err, insure){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
              });
        } 
            res.json(insure);  
    })
    .where('role').equals('employer')
    .where('followed.follower').equals(user.id)
    ;
  
});

// View Insurance doc by employer Id                            X
router.get('/byEmployer/:id', requireAuth, AuthController.roleAuthorization(['admin','employer', 'institute']), AuthController.isFollowing(), function (req, res) {

    Insuredoc.findById(req.params.id, 'company_name company_logo insurance', function(err, insure){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
              });
        }
        res.json(insure);
        
    })
});

// View Insurance doc by employer Id                            X
router.get('/myDocs/:id', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function (req, res) {

    Insuredoc.findById(req.params.id, 'company_name company_logo insurance', function(err, insure){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
              });
        }
        res.json(insure);
        
    })
});


// View individual Insurance Documnet Data by insurance _id         x
router.get('/:id/:docID', requireAuth, AuthController.roleAuthorization(['admin','employer', 'institute']), AuthController.isFollowing(), function (req, res){

    Insuredoc.findById(req.params.id, 'insurance updated', function(err, employer){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
              });
        }
        var thisDoc = employer.insurance.id(req.params.docID);
        res.json(thisDoc);
    })
});

// View individual Insurance Documnet Data by insurance _id         x
router.get('/view_own/:id/:docID', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function (req, res){

    Insuredoc.findById(req.params.id, 'insurance updated', function(err, employer){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
              });
        }
        var thisDoc = employer.insurance.id(req.params.docID);
        res.json(thisDoc);
    })
});



// Add New safety statement to the Database collection
router.put('/add/:id', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function(req, res){

    let sampleFile = req.files.sampleFile;
    file_type = sampleFile.name;

    sampleFile.mv('./public/user_docs/' + file_type, function (err) {

        if (err)

            return res.status(500).json({
                error: 'Error reading post: ' + err,
              });
        console.log("Image you are uploading is " + file_type)
        // res.redirect('/');
    });
    

    Insuredoc.findById( req.params.id, 'insurance updated',
        function (err, employer) {
            if(err){
                return res.status(500).json({
                    error: 'Error reading post: ' + err,
                  });
            }
                employer.insurance.push({
                    file_name: req.body.file_name,
                    file_type: file_type,
                    issue_date: Date.parse(req.body.issue_date),
                    expiry_date: Date.parse(req.body.expiry_date),
                    createdBy: req.params.id  
                });
                employer.updated = Date.now();
                employer.save(function (err, employer){
                    if(err){
                        return res.status(500).json({
                            error: 'Error reading post: ' + err,
                          });
                    } 
                    if (!employer) {
                        return res.status(404).end();
                    }
                    res.status(200).json(employer);
                })
            
        }
    )

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
    Insuredoc.findById(req.params.id, 'insurance updated', function(err, details){   
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
            })
        }
        var subDoc = details.insurance.id(req.params.docID);
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

// Remove individual insurance from database by id                  x
router.put('/delete/:id/:docID', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function(req, res){
    
    Insuredoc.update(
        {_id: req.params.id},
        { $pull: {insurance: {_id: req.params.docID} } },

        function(err, employer) {
            if(err){
                console.log(err)
            }
            res.json(employer);
        }
    )
});

// edit document details
router.put('/editDoc/:id/:docID', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function(req, res){

    Insuredoc.findById(req.params.id, 'insurance updated', function(err, employer){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
            })
        }
        var subDoc = employer.insurance.id(req.params.docID);
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


// Update (file_name or status) field in a insurance document by id, pass status value as ['approved','pending','unapproved']

router.put('/review/:id/:docID', requireAuth, AuthController.roleAuthorization(['admin','employer', 'institute']), AuthController.isFollowing(), function(req, res){

    Insuredoc.findById(req.params.id, 'insurance updated', function(err, employer){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
            })
        }
        var subDoc = employer.insurance.id(req.params.docID);
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