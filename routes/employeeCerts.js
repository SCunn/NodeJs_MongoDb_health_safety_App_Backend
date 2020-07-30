const express = require('express');
const router = express.Router();

var AuthController = require('../controllers/authentication'), 
passportService = require('../config/passport'); 

var requireAuth = passport.authenticate('jwt', {session: false});

// Bring in the certificate model
let EmployeeCert = require('../models/user');

// certificates collection
router.get('/viewall', requireAuth, AuthController.roleAuthorization(['admin','employer', 'institute']), function (req, res) {
    user = req.user
    // Certificates table data
    EmployeeCert.find({}, 'name email employeeCerts ' , function(err, certificate){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
              });
        }
            res.json(certificate);
             
        
    })
    .where('role').equals('employee')
    .where('followed.follower').equals(user.id)
    ;
});

// Route and endpoint to view indidual certificate data   X                     x
router.get('/viewCert/:id/:certID', requireAuth, AuthController.roleAuthorization(['admin','employer','institute']), AuthController.isFollowing(), function (req, res) {
    // user = req.user
    
    EmployeeCert.findById(req.params.id, 'employeeCerts', function(err, employee){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
              });
        }

        var thisDoc = employee.employeeCerts.id(req.params.certID);
        
        res.json(thisDoc);
      
    })
});

// Route and endpoint to view indidual certificate data   X                 x
router.get('/view_own/:id/:certID', requireAuth, AuthController.roleAuthorization(['employee']), AuthController.isUser(),function (req, res) {
    // user = req.user
    
    EmployeeCert.findById(req.params.id, 'employeeCerts', function(err, employee){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
              });
        }

        var thisDoc = employee.employeeCerts.id(req.params.certID);
        
        res.json(thisDoc);
      
    })
});


// Create a new employee certificate based on user and asset ID's
router.put('/add/:id', requireAuth, AuthController.roleAuthorization(['employee']), AuthController.isUser(), function(req, res){

    let sampleFile = req.files.sampleFile;
    file_cert = sampleFile.name;

    sampleFile.mv('./public/images/' + file_cert, function (err) {

        if (err)
            return res.status(500).json({
            error: 'Error reading user: ' + err,
          });
        // console.log("Image you are uploading is " + file_cert)
        // res.redirect('/');
    });

    EmployeeCert.findById( req.params.id, 'employeeCerts updated',function (err, employee) {
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
              });
        } 
        employee.employeeCerts.push({
 
            // Cert types, refer to file models/employeeCert.js for required enum values related to each field
            water_section: req.body.water_section,
            roads_section: req.body.roads_section,
            environment_section: req.body.environment_section,
            equipment_certification: req.body.equipment_certification,
            construction_section: req.body.construction_section,
            quarying_section: req.body.quarying_section,
            administration_section: req.body.administration_section,
            agricultural_section: req.body.agricultural_section,
            automotive_section: req.body.automotive_section,
            fishing_section: req.body.fishing_section,
            oil_and_gas_section: req.body.oil_and_gas_section,
            pharmaceutical_section: req.body.pharmaceutical_section,
            retail_and_hospitality: req.body.retail_and_hospitality,
            haulage_transportation: req.body.haulage_transportation,
            security_section: req.body.security_section,
            healthcare_section: req.body.healthcare_section,
            childcare_section: req.body.childcare_section,
            forestry_operations: req.body.forestry_operations,
            

            expiry_date:  Date.parse(req.body.expiry_date), // use a calender input in frontend, Date.parse will convert the string into a number value
            issue_date:  Date.parse(req.body.issue_date),
            file_cert: file_cert                            // use sampleFile in form, name="sampleFile"
        });
        employee.updated = Date.now();
        employee.save(function (err, employer){
            if(err){
                return res.status(500).json({
                    error: 'Error reading post: ' + err,
                  });
            } 
            if (!employee) {
                return res.status(404).end();
            }
            res.status(200).json(employee);
        })
    })
});


// Route '/delete/:id/:docID'  
    // Removes the employee cert                                    x
    router.put('/delete/:id/:docID', requireAuth, AuthController.roleAuthorization(['employee']), AuthController.isUser(), function(req, res){
    
        EmployeeCert.update(
                 {_id: req.params.id},
                 { $pull: {employeeCerts: {_id: req.params.docID} } },
                 
                 function(err, employer) {
                     if(err){
                         console.log(err)
                     }
                     res.json(employer);
                    
                 }
            )
     });


      // Upload/ update file_cert                                       x
    router.put('/updateFile/:id/:docID', requireAuth, AuthController.roleAuthorization(['employee']), AuthController.isUser(), function(req, res){

        let sampleFile = req.files.sampleFile;
        file_cert = sampleFile.name;
    
        sampleFile.mv('./public/images/' + file_cert, function (err) {
    
            if (err)
    
                return res.status(500).json({
                    error: 'Error reading user: ' + err,
                })
            console.log("Image you are uploading is " + file_cert)
            // res.redirect('/');
           
        });

        EmployeeCert.findById(req.params.id, 'employeeCerts', function(err, details){   
            if(err){
                return res.status(500).json({
                    error: 'Error reading user: ' + err,
                })
            }
            var subDoc = details.employeeCerts.id(req.params.docID);
            if(!subDoc){
                res.status(422).json({error: 'No Certificate Details found.'});
            } else {
            subDoc.set({
                file_cert: file_cert   // use sampleFile instead of photo_id on the client-side form, eg. name="sampleFile" type="file" 
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

    //  edit cert information     x
    router.put('/edit/:id/:docID', requireAuth, AuthController.roleAuthorization(['employee']), AuthController.isUser(), function(req, res){
     
       EmployeeCert.findById(req.params.id, 'employeeCerts updated', function(err, cert){
            if(err){
                return res.status(500).json({
                    error: 'Error reading user: ' + err,
                })
            }
            // Cert types, refer to file models/employeeCert.js for required enum values related to each field
           // water_section: req.body.water_section,
           // roads_section: req.body.roads_section,
           // environment_section: req.body.environment_section,
           // equipment_certification: req.body.equipment_certification,
           // construction_section: req.body.construction_section,
           // quarying_section: req.body.quarying_section,
           // administration_section: req.body.administration_section,
           // agricultural_section: req.body.agricultural_section,
           // automotive_section: req.body.automotive_section,
           // fishing_section: req.body.fishing_section,
           // oil_and_gas_section: req.body.oil_and_gas_section,
           // pharmaceutical_section: req.body.pharmaceutical_section,
           // retail_and_hospitality: req.body.retail_and_hospitality,
           // haulage_transportation: req.body.haulage_transportation,
           // security_section: req.body.security_section,
           // healthcare_section: req.body.healthcare_section,
           // childcare_section: req.body.childcare_section,
           // forestry_operations: req.body.forestry_operations

            var subDoc = cert.employeeCerts.id(req.params.docID);
            if(!subDoc){
                res.status(422).json({error: 'No Certificate Details found.'});
            } else {
                subDoc.set(req.body);
                
                cert.updated = Date.now();
                cert.save().then(function(savedReview){
                    res.json(subDoc);
                }).catch(function(err){
                    res.status(500).send(err);
                });
            }
        });
    
    });
     
    //  review cert information + add comment     x
    router.put('/review/:id/:docID', requireAuth, AuthController.roleAuthorization(['admin', 'employer','institute']), AuthController.isFollowing(), function(req, res){
    
       EmployeeCert.findById(req.params.id, 'employeeCerts updated', function(err, cert){
            if(err){
                return res.status(500).json({
                    error: 'Error reading user: ' + err,
                })
            }
            var subDoc = cert.employeeCerts.id(req.params.docID);
            if(!subDoc){
                res.status(422).json({error: 'No Certificate Details found.'});
            } else {
            subDoc.set(req.body);

            cert.updated = Date.now();
            cert.save().then(function(savedReview){
                res.json(subDoc);
            }).catch(function(err){
                res.status(500).send(err);
            });
            }
        });
    
    });

module.exports = router;