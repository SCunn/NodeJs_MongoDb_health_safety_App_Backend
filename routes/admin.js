const express = require('express');
const router = express.Router();

var AuthController = require('../controllers/authentication'), 
passportService = require('../config/passport'); 

// Bring in the Admin model
let Admin = require('../models/user');

var requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});


// View the list of admin details               x   x
router.get('/viewall',  requireAuth, AuthController.roleAuthorization(['institute']), function(req, res){

    Admin.find({}, 'name email adminDetails employment', function(err, admin){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
              });
        }
            res.json(admin)
        
    })
    .populate('employment.my_employer', 'name instituteDetails.photo_id instituteDetails.firstname instituteDetails.lastname instituteDetails.status' )
    // .populate('employment.employees', 'name employeeDetails.photo_id')
    .where('role').equals('admin')
});

// Route and endpoint to view indidual Admin data           x       x   
router.get('/details/:id', requireAuth, AuthController.roleAuthorization(['institute']), function (req, res) {
    user = req.user
    Admin.findById(req.params.id, 'name email adminDetails employment followed', function(err, details){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
              });
        }
        res.json(details);
        
    })
    .populate('employment.my_employer', 'name role instituteDetails.company_logo instituteDetails.company_name' )
    .populate('employment.employer', 'name role instituteDetails.company_logo instituteDetails.company_name')
    .populate('followed.following', 'name role employerDetails.company_name employerDetails.company_logo employeeDetails.photo_id employeeDetails.status employment.my_employer')
    .populate('followed.follower', 'name role')
    .populate('followed.requester', 'name role')
    .populate('followed.recipient', 'name role employerDetails.company_name')
    .where('employment.my_employer').equals(user.id)
});

// Route and endpoint to view indidual Admin data           x       x   
router.get('/My_details/:id', requireAuth, AuthController.roleAuthorization(['admin']), AuthController.isUser(), function (req, res) {

    Admin.findById(req.params.id, 'name email adminDetails employment followed', function(err, details){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
              });
        }
        res.json(details);
        
    })
    .populate('employment.my_employer', 'name role instituteDetails.company_logo instituteDetails.company_name' )
    .populate('employment.employer', 'name role instituteDetails.company_logo instituteDetails.company_name')
    .populate('followed.following', 'name role employerDetails.company_name employerDetails.company_logo employeeDetails.photo_id employeeDetails.status employment.my_employer')
    .populate('followed.follower', 'name role')
    .populate('followed.requester', 'name role')
    .populate('followed.recipient', 'name role employerDetails.company_name')
});



// Add New Admin Details                                    x   x

router.put('/add/:id', requireAuth, AuthController.roleAuthorization(['admin']), AuthController.isUser(), function(req, res, next){

    let sampleFile = req.files.sampleFile;
    profile_image = sampleFile.name;

    sampleFile.mv('./public/user_docs/' + profile_image, function (err) {

        if (err)

            return res.status(500).send(err);
        console.log("Image you are uploading is " + profile_image)
        // res.redirect('/');
    });

    Admin.findById( req.params.id, 'adminDetails updated',
        function (err, details) {
            if(err){
                res.status(500).json({
                    error: 'Error reading post: ' + err,
                  });
                  return next (err)
            }
                details.adminDetails.push({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                profile_image: profile_image
            });
            details.updated = Date.now();
            details.save(function (err, details){
                 
                // if (!details) {
                //     return res.status(404).end();
                // }
                res.status(200).json(details); 
            });  
        }
        );
});

// Edit Admin data in Admin collection                                          x
router.put('/edit/:id/:docID', requireAuth, AuthController.roleAuthorization(['admin']), AuthController.isUser(), function(req, res){
    
    Admin.findById(req.params.id, 'adminDetails', function(err, details){   
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
              });
        } 
        var subDoc = details.adminDetails.id(req.params.docID);
        if(!subDoc){
            res.status(422).json({error: 'No Admin Details found.'});
                
         } else {
        // details.first_name: req.body.first_name,
        // details.last_name: req.body.last_name,

            subDoc.set(req.body)

            details.save().then(function(savedReview){
                res.json(subDoc);
            }).catch(function(err){
                res.status(500).send(err);
            });
        }
    });

});


 // Update company_logo image                                       x
 router.put('/updatePhoto/:id/:docID', requireAuth, AuthController.roleAuthorization(['admin']), AuthController.isUser(), function(req, res){

    let sampleFile = req.files.sampleFile;
    profile_image = sampleFile.name;

    sampleFile.mv('./public/user_docs/' + profile_image, function (err) {

        if (err)

            return res.status(500).send(err);
        console.log("Image you are uploading is " + profile_image)

    })

    Admin.findById(req.params.id, 'adminDetails', function(err, details){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
              });
        }    
        var subDoc = details.adminDetails.id(req.params.docID);
        if(!subDoc){
            res.status(422).json({error: 'No Admin Details found.'});
                
         } else {
        subDoc.set({
            profile_image: profile_image   // use sampleFile instead of company_logo on the client-side form, eg. name="sampleFile" type="file" 
           });

        details.save().then(function(savedReview){
            res.json(subDoc);
        }).catch(function(err){
            res.status(500).send(err);
        });
        }
    });

 });


// Remove Admin details by Id                                       x
router.put('/delete/:id/:docID', requireAuth, AuthController.roleAuthorization(['admin']), AuthController.isUser(), function(req, res){

    Admin.update(
        {_id: req.params.id},
        { $pull: {adminDetails: {_id: req.params.docID} } },
        
        function(err, details) {
            if(err){
                console.log(err)
            }
            res.json(details);
           
        }
   )
});

module.exports = router;
