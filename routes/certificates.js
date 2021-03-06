const express = require('express');
const router = express.Router();

var AuthController = require('../controllers/authentication'), 
passportService = require('../config/passport'); 

var requireAuth = passport.authenticate('jwt', {session: false});



// Bring in the certificate model
let Cert = require('../models/user');


// certificates collection  view all certs by follower                                x
router.get('/viewall', requireAuth, AuthController.roleAuthorization(['admin','employer', 'institute']), function (req, res) {
    user = req.user
    // Certificates table data
    Cert.find({}, 
        'name employerDetails.company_name employerDetails.company_logo assetCerts' , 
    function(err, certificate){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
            })
        }
            res.json(certificate);
             
        
    })
    .where('role').equals('employer')
    .where('followed.follower').equals(user.id)
    ;
});

// Route and endpoint to view indidual certificate data   X
router.get('/:id/:certID', requireAuth, AuthController.roleAuthorization(['admin','employer', 'institute']), AuthController.isFollowing(), function (req, res) {

    Cert.findById(req.params.id, function(err, employer){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
            })
        }
        var thisDoc = employer.assetCerts.id(req.params.certID)
        if(!thisDoc){
            res.status(422).json({error: 'No Certificate Details found.'});
        }else{
            res.json(thisDoc);
        }
    })
    
});

// Route and endpoint to view own indidual certificate data   X
router.get('/myCert/:id/:certID', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function (req, res) {

    Cert.findById(req.params.id, function(err, employer){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
            })
        }
        var thisDoc = employer.assetCerts.id(req.params.certID)
        if(!thisDoc){
            res.status(422).json({error: 'No Certificate Details found.'});
        }else{
            res.json(thisDoc);
        }
    })
    
});


// View Certs Assets Id                                       x
router.get('/viewCerts/:id/:docID', requireAuth, AuthController.roleAuthorization(['admin','employer', 'institute']), AuthController.isFollowing(), function (req, res){
    
    Cert.findOne({'assetCerts.assetID': req.params.docID}, 'assetCerts', function(err, employer){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
            })
        }
            res.json(employer);
        
    })
    
    
});


// View My Certs Assets Id                                       x
router.get('/viewMyCerts/:id/:docID', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function (req, res){
    
    Cert.findOne({'assetCerts.assetID': req.params.docID}, 'assetCerts', function(err, employer){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
            })
        }
            res.json(employer);
        
    })
    
    
});


// Create a new asset certificate based on user and asset ID's                  x
router.put('/add/:id/:assetID', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function(req, res, next){
    console.log('REQUEST', req);
    let sampleFile = req.files.sampleFile;
    file_cert = sampleFile.name;

    sampleFile.mv('./public/images/' + file_cert, function (err) {

        if (err)

            return res.status(500).send(err);
        console.log("Image you are uploading is " + file_cert)
        // res.redirect('/');
    });

    Cert.findById( req.params.id, 'assetCerts updated',function (err, employer) {
        if(err){
            res.status(500).json({
                error: 'Error reading post: ' + err,
              });
              return next (err);
        }
        employer.assetCerts.push({
 
            assetID:  req.params.assetID,
            // category: req.body.category,
            // cert_name:  req.body.cert_name,

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
    })
    

});

   // Upload/ update file_cert                                       x
   router.put('/updateFile/:id/:docID', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function(req, res){

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

    Cert.findById(req.params.id, 'assetCerts updated', function(err, details){   
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
            })
        }
        var subDoc = details.assetCerts.id(req.params.docID);
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
router.put('/edit/:id/:docID', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function(req, res){
     
    Cert.findById(req.params.id, 'assetCerts updated', function(err, cert){
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

         var subDoc = cert.assetCerts.id(req.params.docID);
         if(!subDoc){
             res.status(422).json({error: 'No Certificate Details found.'});
         } else {
             subDoc.set(req.body);
             
             cert.updated = Date.now();
             cert.save().then(function(savedReview){
                 res.json(savedReview);
             }).catch(function(err){
                 res.status(500).send(err);
             });
         }
     });
 
 });


// Admin review asset certificate
// Update (cert_name, category or status) field in a cert document by id, pass status value as ['approved','pending','unapproved']        x

router.put('/review/:id/:docID', requireAuth, AuthController.roleAuthorization(['admin','employer', 'institute']), AuthController.isFollowing(), function (req, res){

        Cert.findById(req.params.id, 'assetCerts updated', function(err, employer){
            if(err){
                return res.status(500).json({
                    error: 'Error reading user: ' + err,
                })
            }
            var subDoc = employer.assetCerts.id(req.params.docID);
            if(!subDoc){
                res.status(422).json({error: 'No Certificate Details found.'});
            } else {
            subDoc.set(req.body);

            employer.updated = Date.now();              // Adds new date
            employer.save().then(function(savedReview){
                res.json(subDoc);
            }).catch(function(err){
                res.status(500).send(err);
        });
        }
    });

});


// Remove certificate from database                             x
router.put('/delete/:id/:docID', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function(req, res, next){

    Cert.update(
        {_id: req.params.id},
        { $pull: {assetCerts: {_id: req.params.docID} } },

        function(err, employer) {
            if(err){
                console.log(err)
            }
            res.json(employer);
        }
    )
});


module.exports = router;