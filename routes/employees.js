var AuthController = require('../controllers/authentication'), 
passportService = require('../config/passport'); 
const express = require('express');
var passport = require('passport');

const router = express.Router();

var requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});


// Bring in the Employee model
let Employee = require('../models/user');


// // view all employees Table data X   x
router.get('/viewall', requireAuth, AuthController.roleAuthorization(['admin','employer', 'institute']), function (req, res) {
 
    Employee.find({},'name email employeeDetails employment')
    .populate('employment.my_employer', 'name employerDetails.company_name employerDetails.company_logo')
    .where('role').equals('employee')
    .exec(function(err, employee){
       
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
              });
        }
        
        res.json(employee);

    });

});



// Route and endpoint to view indidual employee data      X
router.get('/:id', requireAuth, AuthController.roleAuthorization(['admin','employer','institute']), AuthController.isFollowing(), function (req, res) { 
    
    Employee.findById(req.params.id, 'name email employeeDetails employment',  function(err, employee){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
              });
        } 
        res.json(employee);
        
    })
    .populate('employment.employer', 'name employerDetails.company_name employerDetails.company_logo')
    .populate('employment.my_employer', 'name employerDetails.company_name employerDetails.company_logo')
    .populate('followed.following', 'name role')
    .populate('followed.follower', 'name role')
});


// Route and endpoint for logged in employee to view indidual employee data      X          x
router.get('/view_own/:id', requireAuth, AuthController.roleAuthorization(['employee']), AuthController.isUser(),function (req, res) { 

    Employee.findById(req.params.id, 'name email employeeDetails employment',  function(err, employee){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
              });
        } 

        res.json(employee);
        
    })
    .populate('employment.employer', 'name employerDetails.company_name employerDetails.company_logo')
    .populate('employment.my_employer', 'name employerDetails.company_name employerDetails.company_logo')
    .populate('followed.following', 'name role e_learning')
    .populate('followed.follower', 'name role')
    
});




// Add New Employee Details                                 X

router.put('/add/:id', requireAuth, AuthController.roleAuthorization(['employee']), AuthController.isUser(), function(req, res, next){

        let sampleFile = req.files.sampleFile;
        photo_id = sampleFile.name;

        sampleFile.mv('./public/images/' + photo_id, function (err) {

            if (err)

                return res.status(500).send(err);
            console.log("Image you are uploading is " + photo_id)
            // res.redirect('/');
        });


        Employee.findById( req.params.id, 'employeeDetails updated',
            function (err, details) { 
                if(err){
                    res.status(422).json({error: 'No Employee details found.'});
                    return next (err);
                }
                    details.employeeDetails.push({
                        firstname: req.body.firstname,
                        lastname : req.body.lastname,
                        mobile_phone : req.body.mobile_phone,
                        photo_id : photo_id
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


// Edit Employee in employees collection                                        X
router.put('/edit/:id/:docID', requireAuth, AuthController.roleAuthorization(['employee']), AuthController.isUser(), function (req, res, next) {

    Employee.findById(req.params.id, 'employeeDetails', function(err, details){ 
        if(err){
             res.status(500).json({
                error: 'Error reading user: ' + err,
              });
              return next (err);
        }   
        var subDoc = details.employeeDetails.id(req.params.docID);
        
        if(!subDoc){
            res.status(422).json({error: 'No Employer Details found.'});
        } else {
        // firstname = req.body.firstname;
        // lastname = req.body.lastname;
        // mobile_phone = req.body.mobile_phone;
        // email = req.body.email;

        subDoc.set(req.body)

        details.save().then(function(savedReview){
            res.json(subDoc);
        }).catch(function(err){
            res.status(500).send(err);
        });
        
        }

    });
});

 // Update photo_id image                                       x
 router.put('/updatePhoto/:id/:docID',requireAuth, AuthController.roleAuthorization(['employee']), AuthController.isUser(), function(req, res, next){

    let sampleFile = req.files.sampleFile;
    photo_id = sampleFile.name;

    sampleFile.mv('./public/images/' + photo_id, function (err) {

        if (err)

            return res.status(500).send(err);
        console.log("Image you are uploading is " + photo_id)

    })

    Employee.findById(req.params.id, 'employeeDetails', function(err, details){
        if(err){
            res.status(500).json({
               error: 'Error reading user: ' + err,
             });
             return next (err);
       }   
        var subDoc = details.employeeDetails.id(req.params.docID);

        if(!subDoc){
            res.status(422).json({error: 'No Employee Details found.'});
        } else {
        subDoc.set({
            photo_id: photo_id   // use sampleFile instead of photo_id on the client-side form, eg. name="sampleFile" type="file" 
           });

        details.save().then(function(savedReview){
            res.json(subDoc);
        }).catch(function(err){
            res.status(500).send(err);
        });
        }
    });

 });


// Add or Update QR Tag on existing Asset                           x
router.put('/add_QR_Tag/:id/:docID', requireAuth, AuthController.roleAuthorization(['employee']), AuthController.isUser(), function(req, res, next){

    let sampleFile = req.files.sampleFile;
    QR_Tag = sampleFile.name;
    sampleFile.mv('./public/qr_tags' + QR_Tag, function (err) {
        if (err)
            return res.status(500).send(err);
        // console.log("Image you are uploading is " + QR_Tag)
        // res.redirect('/');
    })

    Employee.findById(req.params.id, 'employeeDetails', function(err, details){ 
        if(err){
            res.status(500).json({
                error: 'Error reading post: ' + err,
              });
              return next();
        }  
        var subDoc = details.employeeDetails.id(req.params.docID);
        if(!subDoc){
            res.status(422).json({error: 'No Certificate Details found.'});
        } else {
        subDoc.set({
            QR_Tag: QR_Tag   // use sampleFile instead of QR_Tag on the client-side form, eg. name="sampleFile" type="file" 
           });

        details.save().then(function(savedReview){
            res.json(savedReview);
        }).catch(function(err){
            res.status(500).send(err);
        });
        }
    });

});


// Removes the employee details from the database                           x
router.put('/delete/:id/:docID', requireAuth, AuthController.roleAuthorization(['employee']), AuthController.isUser(), function(req,res){
    Employee.update({_id: req.params.id},
        {$pull: {employeeDetails: {_id: req.params.docID } } },
    
        function(err, details) {
            if(err){ 
                return next(err);
                // console.log(err)
            }
            res.json(details);
            
        }
    )
});


module.exports = router;

