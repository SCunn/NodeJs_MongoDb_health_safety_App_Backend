const express = require('express');
const router = express.Router();

var AuthController = require('../controllers/authentication'), 
passportService = require('../config/passport'); 

var requireAuth = passport.authenticate('jwt', {session: false});



// Bring in the e-learning subdoc in the user model
let E_Learn = require('../models/user');

// articles/ e-learning collection from db                          x
router.get('/viewall', function (req, res, next) {
    
    // E-Learning table data
    E_Learn.find({}, 'instituteDetails.company_name instituteDetails.company_logo employerDetails.company_name employerDetails.company_logo role e_learning', function(err, e_learn){
        if(err){
            res.status(422).json({error: 'No details found.'});
                return next (err);
        }
            res.json(e_learn);
        
    })
    .where('role').in(['institute','employer'])
    
    ;
});

// Route and endpoint to view indidual e-learning data              x
router.get('/:id/:certID', function(req, res, next){

    E_Learn.findById(req.params.id, 'e_learning', function(err, e_learn){
        if(err){
            res.status(422).json({error: 'No details found.'});
                return next (err);
        }
        var thisDoc = e_learn.e_learning.id(req.params.certID);
        res.json(thisDoc);
        
    });
});


// Route and endpoint to view indidual e-learning data              x
router.get('/learner/:id/:certID', requireAuth, AuthController.roleAuthorization(['employee']), AuthController.isFollowing(), function(req, res, next){

    E_Learn.findById(req.params.id, 'e_learning', function(err, e_learn){
        if(err){
            res.status(422).json({error: 'No details found.'});
                return next (err);
        }
        var thisDoc = e_learn.e_learning.id(req.params.certID);
        res.json(thisDoc);
        
    });
});

// Add New e-learning to the Database articles collection           x
router.put('/add/:id', requireAuth, AuthController.roleAuthorization(['employer', 'institute']), AuthController.isUser(), function(req, res, next){

    let sampleFile = req.files.sampleFile;
    media_type = sampleFile.name;

    sampleFile.mv('./public/e_learning/' + media_type, function (err) {

        if (err)
            return res.status(500).send(err);
        console.log("Image you are uploading is " + media_type)
        // res.redirect('/');
    });
    
    E_Learn.findById( req.params.id, 'e_learning updated',function (err, e_learn) {
        if(err){
            res.status(422).json({error: 'No details found.'});
                return next (err);
        }

        e_learn.e_learning.push({
            media_type: media_type,
            subject: req.body.subject,
            description: req.body.description
        });
        e_learn.updated = Date.now();
        e_learn.save(function (err, employer){
            if(err){
                return res.status(500).json({
                    error: 'Error reading post: ' + err,
                  });
            } 
            if (!e_learn) {
                return res.status(404).end();
            }
            res.status(200).json(e_learn);
        })

    })

});


// Remove e-learning data from database                             x
router.put('/delete/:id/:docID', requireAuth, AuthController.roleAuthorization(['employer', 'institute']), AuthController.isUser(), function(req, res){

    E_Learn.update(
        {_id: req.params.id},
        { $pull: {e_learning: {_id: req.params.docID} } },
        
        function(err, e_learn) {
            if(err){
                console.log(err)
            }
            res.json(e_learn);
           
        }
   )
});


// Edit e-learning data (subject, description)                                  x
router.put('/update/:id/:docID', requireAuth, AuthController.roleAuthorization(['employer', 'institute']), AuthController.isUser(), function (req, res, next){

    E_Learn.findById(req.params.id, 'e_learning', function(err, details){
        if(err){
            res.status(422).json({error: 'No Institute details found.'});
                return next (err);
        }

        var subDoc = details.e_learning.id(req.params.docID);

        if(!subDoc){
            res.status(422).json({error: 'No Certificate Details found.'});
        } else { 
        
        // e_learn.subject  = req.body.subject;
        // e_learn.description = req.body.description;

        subDoc.set(req.body)

        details.save().then(function(savedReview){
            res.json(subDoc);
        }).catch(function(err){
            res.status(500).send(err);
        });
    }
    })
});

// Edit e-learning data (subject, description)                                  x
router.put('/admin_update/:id/:docID',  requireAuth, AuthController.roleAuthorization(['admin']), AuthController.isFollowing(), function (req, res, next){

    E_Learn.findById(req.params.id, 'e_learning', function(err, details){
        if(err){
            res.status(422).json({error: 'No Institute details found.'});
                return next (err);
        }

        var subDoc = details.e_learning.id(req.params.docID);

        if(!subDoc){
            res.status(422).json({error: 'No Certificate Details found.'});
        } else { 
        
        // e_learn.subject  = req.body.subject;
        // e_learn.description = req.body.description;

        subDoc.set(req.body)

        details.save().then(function(savedReview){
            res.json(subDoc);
        }).catch(function(err){
            res.status(500).send(err);
        });
    }
    })
});

// Update E-Learning File, Upload new file                                          x
router.put('/updatefile/:id/:docID', requireAuth, AuthController.roleAuthorization(['employer', 'institute']), AuthController.isUser(), function(req, res, next){

    let sampleFile = req.files.sampleFile;
    media_type = sampleFile.name;

    sampleFile.mv('./public/e_learning/' + media_type, function (err) {

        if (err)

            return res.status(500).send(err);
        console.log("The File you are uploading is " + media_type)

    })

    E_Learn.findById(req.params.id, 'e_learning', function(err, details){   
        if(err){
            res.status(422).json({error: 'No Institute details found.'});
                return next (err);
        }
        var subDoc = details.e_learning.id(req.params.docID);
        if(!subDoc){
            res.status(422).json({error: 'No Certificate Details found.'});
        } else {

        subDoc.set({
            media_type: media_type   // use sampleFile instead of media_type on the client-side form, eg. name="sampleFile" type="file" 
           });

        details.save().then(function(savedReview){
            res.json(subDoc);
        }).catch(function(err){
            res.status(500).send(err);
        });
        }
    });

 });

 // Update E-Learning File, Upload new file                                          x
router.put('/admin_updatefile/:id/:docID',  requireAuth, AuthController.roleAuthorization(['admin']), AuthController.isFollowing(), function(req, res, next){

    let sampleFile = req.files.sampleFile;
    media_type = sampleFile.name;

    sampleFile.mv('./public/e_learning/' + media_type, function (err) {

        if (err)

            return res.status(500).send(err);
        console.log("The File you are uploading is " + media_type)

    })

    E_Learn.findById(req.params.id, 'e_learning', function(err, details){   
        if(err){
            res.status(422).json({error: 'No Institute details found.'});
                return next (err);
        }
        var subDoc = details.e_learning.id(req.params.docID);
        if(!subDoc){
            res.status(422).json({error: 'No Certificate Details found.'});
        } else {

        subDoc.set({
            media_type: media_type   // use sampleFile instead of media_type on the client-side form, eg. name="sampleFile" type="file" 
           });

        details.save().then(function(savedReview){
            res.json(subDoc);
        }).catch(function(err){
            res.status(500).send(err);
        });
        }
    });

 });




module.exports = router;