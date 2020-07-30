const express = require('express');
var passport = require('passport');
const router = express.Router();


var AuthController = require('../controllers/authentication'), 
passportService = require('../config/passport'); 

var requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});

// Bring in the Employer details model
let Employer = require('../models/user');


// See all Employer details table                               x               x
router.get('/viewall', requireAuth, function(req, res){

    // Employer details full table              
    Employer.find({}, 'name employerDetails', function(err, details){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
              });
        }
            res.json(details);
        
    })
    .where('role').equals('employer')
    ;
});

// view individual Employer details          x                          x
router.get('/view/:id', requireAuth, AuthController.isFollowing(), AuthController.roleAuthorization(['admin','employer','institute']),  function (req, res, next) {

    Employer.findById(req.params.id, 'name email employerDetails employment followed', function(err, details){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
              });
        } 

        res.json(details);
        
    })
    .populate('employment.my_employee', 'name employeeDetails.photo_id employeeDetails.firstname employeeDetails.lastname employeeDetails.status' )
    .populate('employment.employees', 'name employeeDetails.photo_id')
    .populate('followed.following', 'name role')
    .populate('followed.follower', 'name role')
    .where('role').equals('employer')
    ;
    
    
});


// view individual Employer details          x                         
router.get('/view_own/:id', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function (req, res, next) {

    Employer.findById(req.params.id, 'name email employerDetails employment followed', function(err, details){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
              });
        } 
        res.json(details);
        
    })
    .populate('employment.my_employee', 'name employeeDetails.photo_id employeeDetails.firstname employeeDetails.lastname employeeDetails.status' )
    .populate('employment.employees', 'name employeeDetails.photo_id')
    .populate('followed.following', 'name role')
    .populate('followed.follower', 'name role')
    ;
    
    
});


// Add Employer details                x
router.put('/add/:id', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function(req, res, next){

    let sampleFile = req.files.sampleFile;
    company_logo = sampleFile.name;

    sampleFile.mv('./public/user_docs/' + company_logo, function (err) {

        if (err)

            return res.status(500).json({
                error: 'Error reading user: ' + err,
              });
        console.log("Image you are uploading is " + company_logo)
        // res.redirect('/');
    });

    Employer.findById( req.params.id, 'employerDetails updated',
        function (err, details) {
            if(err){
                res.status(500).json({
                    error: 'Error reading post: ' + err,
                  });
                  return next (err);
            }
                details.employerDetails.push({
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

//  edit Employer information                    x                            x
router.put('/edit/:id/:docID', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function(req, res){
     
    Employer.findById(req.params.id, 'employerDetails', function(err, details){  
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
              });
        } 
        
         var subDoc = details.employerDetails.id(req.params.docID);

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


 // Update company_logo image                                                   x
 router.put('/updateLogo/:id/:docID', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function(req, res){

    let sampleFile = req.files.sampleFile;
    company_logo = sampleFile.name;

    sampleFile.mv('./public/user_docs/' + company_logo, function (err) {

        if (err)

            return res.status(500).send(err);
        console.log("Image you are uploading is " + company_logo)

    })

    Employer.findById(req.params.id, 'employerDetails', function(err, details){ 
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
              });
        }  
        var subDoc = details.employerDetails.id(req.params.docID);

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


// Remove user details from database                   x                             x
router.put('/delete/:id/:docID', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function(req, res){

    Employer.update(
        {_id: req.params.id},
        { $pull: {employerDetails: {_id: req.params.docID} } },
        
        function(err, details) {
            if(err){
                console.log(err)
            }
            res.json(details);
           
        }
   )
});

module.exports = router;