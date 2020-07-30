const express = require('express');
const router = express.Router();

var AuthController = require('../controllers/authentication'), 
passportService = require('../config/passport'); 

var requireAuth = passport.authenticate('jwt', {session: false});


// Bring in the Institute details model
let Institute = require('../models/user');

// See all Institute details table                                                  x
router.get('/viewall', requireAuth, function(req, res, next){

    // Employer details full table
    Institute.find({}, 'name email instituteDetails', function(err, details){
        if(err){
            res.status(422).json({error: 'No Institute details found.'});
                return next (err);
        }
            res.json(details);
        
    })
    .where('role').equals('institute')
    ;
});

// view individual Institute details                                                 x
router.get('/view/:id', requireAuth, AuthController.roleAuthorization(['institute']), AuthController.isUser(), function (req, res, next) {

    Institute.findById(req.params.id, 'name email instituteDetails employment e_learning followed', function(err, details){
        if(err){
            res.status(422).json({error: 'No Institute details found.'});
                return next (err);
        }
        res.json(details);
        
    })
    .populate('employment.my_employee', 'name role adminDetails.profile_image' )
    .populate('employment.employees', 'name role adminDetails.profile_image')
    .populate('followed.following', 'name role employerDetails.company_name employerDetails.company_logo employeeDetails.photo_id employment.my_employer')
    .populate('followed.follower', 'name role')
    .populate('followed.requester', 'name role')
    .populate('followed.recipient', 'name role employerDetails.company_name')
    ;
});

// add Institute details                                            x
router.put('/add/:id', requireAuth, AuthController.roleAuthorization(['institute']), AuthController.isUser(), function(req, res, next){

    let sampleFile = req.files.sampleFile;
    company_logo = sampleFile.name;

    sampleFile.mv('./public/user_docs/' + company_logo, function (err) {

        if (err)

            return res.status(500).send(err);
        console.log("Image you are uploading is " + company_logo)
        // res.redirect('/');
    });

    Institute.findById( req.params.id, 'instituteDetails updated',
        function (err, details) {
            if(err){
                res.status(500).json({
                    error: 'Error reading post: ' + err,
                });
                    return next (err);
            
            }
                details.instituteDetails.push({
                    company_name: req.body.company_name,
                    business_type: req.body.business_type,
                    company_logo: company_logo,
                    business_email: req.body.business_email,
                    phone: req.body.phone,
                    address: req.body.address
            }); 
            details.updated = Date.now();
            details.save(function (err, details){
                if(err){
                    return res.status(500).json({
                        error: 'Error reading user: ' + err,
                      });
                }
                if (!details) {
                    return res.status(404).end();
                }
                res.status(200).json(details); 
            });
            }
        
        );
});

//  edit Institute information                                                   x
router.put('/edit/:id/:docID', requireAuth, AuthController.roleAuthorization(['institute']), AuthController.isUser(), function(req, res, next){
     
    Institute.findById(req.params.id, 'instituteDetails', function(err, details){  
        if(err){
            res.status(422).json({error: 'No Institute details found.'});
                return next (err);
        } 
         var subDoc = details.instituteDetails.id(req.params.docID);

         if(!subDoc){
            res.status(422).json({error: 'No Employer Details found.'});
        } else {
        //  subDoc.set({
        //     company_name: req.body.company_name,
        //     business_type: req.body.business_type,
        //     business_email: req.body.business_email,
        //     phone: req.body.phone,
        //     address: req.body.address
        //     });

        subDoc.set(req.body);

         details.save().then(function(savedReview){
             res.json(subDoc);
         }).catch(function(err){
             res.status(500).send(err);
         });
        }
     });
 
 });


 // Update company_logo image                                       x
 router.put('/updateLogo/:id/:docID', requireAuth, AuthController.roleAuthorization(['institute']), AuthController.isUser(), function(req, res, next){

    let sampleFile = req.files.sampleFile;
    company_logo = sampleFile.name;

    sampleFile.mv('./public/user_docs/' + company_logo, function (err) {

        if (err)

            return res.status(500).send(err);
        console.log("Image you are uploading is " + company_logo)

    })

    Institute.findById(req.params.id, 'instituteDetails', function(err, details){ 
        if(err){
            res.status(422).json({error: 'No Institute details found.'});
                return next (err);
        }   
        var subDoc = details.instituteDetails.id(req.params.docID);
        if(!subDoc){
            res.status(422).json({error: 'No Employer Details found.'});
        } else {
        subDoc.set({
           company_logo: company_logo   // use sampleFile instead of company_logo on the client-side form, eg. name="sampleFile" type="file" 
           });

        details.save().then(function(savedReview){
            res.json(subDoc);
        }).catch(function(err){
            res.status(500).send(err);
        });
    }
    });

 });

 // Remove Institution details from database                        x
router.put('/delete/:id/:docID', requireAuth, AuthController.roleAuthorization(['institute']), AuthController.isUser(), function(req, res){
    
    Institute.update(
        {_id: req.params.id},
        { $pull: {instituteDetails: {_id: req.params.docID} } },
        
        function(err, details) {
            if(err){
                console.log(err)
            }
            res.json(details);
           
        }
   )
});

module.exports = router;