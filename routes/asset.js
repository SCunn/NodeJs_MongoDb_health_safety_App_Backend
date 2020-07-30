const express = require('express');
const router = express.Router();

var AuthController = require('../controllers/authentication');

var requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});

// Bring in the Asset model
let Asset = require('../models/user');

// Asset Table data by follower                                X
router.get('/viewall', requireAuth, AuthController.roleAuthorization(['admin','employer', 'institute']), function (req, res) {
    
    user = req.user
    // Assets Table Data
    Asset.find({}, 'name employerDetails.company_name employerDetails.company_logo assets', function(err, asset){
        if(err){
            return res.status(500).json({
                error: 'Error reading user: ' + err,
            })
        }
            res.json(asset);
                
    })
    .where('role').equals('employer')
    //.where('followed.follower').equals(user.id)
    ;

});



// Route and endpoint to view indidual employer asset/ equipment data                   x             
router.get('/byEmployer/:id', requireAuth, AuthController.roleAuthorization(['admin','employer', 'institute']), AuthController.isFollowing(), function (req, res) {

    Asset.findById(req.params.id, 'employerDetails.company_name employerDetails.company_logo assets assetCerts', function(err, employer){
       if(err){
           res.status(500).json({
            error: 'Error reading user: ' + err,
           });
       }
        res.json(employer);
        
    })
  
});

// Route and endpoint to view indidual employer asset/ equipment data                   x             
router.get('/myAsset/:id', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function (req, res) {

    Asset.findById(req.params.id, 'employerDetails.company_name employerDetails.company_logo assets assetCerts', function(err, employer){
       if(err){
           res.status(500).json({
            error: 'Error reading user: ' + err,
           });
       }
        res.json(employer);
        
    })
  
});

// View employee assets by employer Id
router.get('/view_my_employees/:id', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function(req, res, next){

    Asset.findById(req.params.id, 'assets followed.following employed', function(err, result){
        if(err){ 
            res.status(422).json({error: 'No user found.'});
            return next (err);
        }

        console.log(result);

        var employee = [];

        for(var i = 0; i < result.assets.length; i++){

            if(result.assets[i].asset_type == "Employee"){
                employee.push(result.assets[i])
            }
            
        }
        res.json({
            employee,
            result: result.followed
        });
    })
    .populate('followed.following', 'email employeeDetails')
    ;
});

// View employee assets by employer Id if isFollowing()
router.get('/view_employees/:id', requireAuth, AuthController.roleAuthorization(['admin','employer', 'institute']), AuthController.isFollowing(), function(req, res, next){

    Asset.findById(req.params.id, 'assets followed.following employed', function(err, result){
        if(err){ 
            res.status(422).json({error: 'No user found.'});
            return next (err);
        }

        console.log(result);

        var employee = [];

        for(var i = 0; i < result.assets.length; i++){

            if(result.assets[i].asset_type == "Employee"){
                employee.push(result.assets[i])
            }
            
        }
        res.json({
            employee,
            result: result.followed
        });
    })
    .populate('followed.following', 'email employeeDetails')
    ;
});

router.get('/view_my_equipment/:id', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function(req, res, next){

    Asset.findById(req.params.id, 'assets', function(err, result){
        if(err){ 
            res.status(422).json({error: 'No user found.'});
            return next (err);
        }

        var equipment = [];

        for(var i = 0; i < result.assets.length; i++){

            if(result.assets[i].asset_type !== "Employee"){
                equipment.push(result.assets[i])
            }
            
        }
        res.json(equipment);
    });
});

router.get('/view_equipment/:id', requireAuth, AuthController.roleAuthorization(['admin','employer', 'institute']), AuthController.isFollowing(), function(req, res, next){

    Asset.findById(req.params.id, 'assets', function(err, result){
        if(err){ 
            res.status(422).json({error: 'No user found.'});
            return next (err);
        }

        var equipment = [];

        for(var i = 0; i < result.assets.length; i++){

            if(result.assets[i].asset_type !== "Employee"){
                equipment.push(result.assets[i])
            }
            
        }
        res.json(equipment);
    });
});

// View Asset and related Certificate data
router.get('/viewAsset/:id/:docID', requireAuth, AuthController.roleAuthorization(['admin','employer', 'institute']), function (req, res, next) {

    Asset.findById(req.params.id, 'assets assetCerts', function(err, result){
        if(err){ 
            res.status(422).json({error: 'No user found.'});
            return next (err);
        }
        var asset = result.assets.id(req.params.docID);
        
        var certificates = [];

        for(var i = 0; i < result.assetCerts.length; i++){

            if(req.params.docID == result.assetCerts[i].assetID){
                certificates.push(result.assetCerts[i])
            }
        }

        res.json({
            // status: true,
            data: { 
                asset,
                certificates
            }
        });
    })
   
});
// View Asset and related Certificate data
router.get('/viewMyAsset/:id/:docID', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function (req, res, next) {

    Asset.findById(req.params.id, 'assets assetCerts', function(err, result){
        if(err){ 
            res.status(422).json({error: 'No user found.'});
            return next (err);
        }
        var asset = result.assets.id(req.params.docID);
        
        var certificates = [];

        for(var i = 0; i < result.assetCerts.length; i++){

            if(req.params.docID == result.assetCerts[i].assetID){
                certificates.push(result.assetCerts[i])
            }
        }
  
        res.json({
            // status: true,
            data: { 
                asset,
                certificates
            }
        });
    })
   
});

// add new asset/ equipment                                     x                      

router.put('/add/:id', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function(req, res, next){

    Asset.findById( req.params.id, 'assets updated',
        function (err, employer) {
            if(err){
                res.status(500).json({
                    error: 'Error reading post: ' + err,
                  });
                  return next (err);
            }
            employer.assets.push({
                asset_type: req.body.asset_type,
                // asset_image: asset_image,
                asset_name: req.body.asset_name,
                // status: req.body.status
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



// Add or Update Image on existing Asset                                x
router.put('/addImage/:id/:docID', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function(req, res, next){

    let sampleFile = req.files.sampleFile;
    asset_image = sampleFile.name;
    sampleFile.mv('./public/asset_images/' + asset_image, function (err) {
        if (err)
            res.status(500).send(err);
        console.log("Image you are uploading is " + asset_image)
        // res.redirect('/');
    })

    Asset.findById(req.params.id, 'assets', function(err, details){ 
        if(err){
            return res.status(500).json({
                error: 'Error reading post: ' + err,
              });
        }  
        var subDoc = details.assets.id(req.params.docID);
        if(!subDoc){
            res.status(422).json({error: 'No Certificate Details found.'});
        } else {
        subDoc.set({
            asset_image: asset_image   // use sampleFile instead of asset_image on the client-side form, eg. name="sampleFile" type="file" 
           });

        details.save().then(function(savedReview){
            res.json(subDoc);
        }).catch(function(err){
            res.status(500).send(err);
        });
        }
    });

});

// Add employee asset
router.put('/add_employee_asset/:id', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function(req, res, next){

    Asset.findById( req.params.id, 'assets updated',
        function (err, employer) {
            if(err){
                res.status(500).json({
                    error: 'Error reading post: ' + err,
                  });
                  return next (err);
            }
            employer.assets.push({
                asset_type: "Employee",
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                mobile_phone: req.body.mobile_phone,
                email: req.body.email,
                status: req.body.status
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


// Add or Update Image on existing Asset                                x
router.put('/add_profile_img/:id/:docID', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function(req, res, next){
    console.log('req', req);
    let sampleFile = req.files.sampleFile;
    photo_id = sampleFile.name;
    sampleFile.mv('./public/asset_images/' + photo_id, function (err) {
        if (err)
            res.status(500).send(err);
        console.log("Image you are uploading is " + photo_id)
        // res.redirect('/');
    })

    Asset.findById(req.params.id, 'assets', function(err, details){ 
        if(err){
            res.status(500).json({
                error: 'Error reading post: ' + err,
              });
              return next (err)
        }  
        var subDoc = details.assets.id(req.params.docID);
        if(!subDoc){
            res.status(422).json({error: 'No Certificate Details found.'});
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
router.put('/add_QR_Tag/:id/:docID', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function(req, res){

    let sampleFile = req.files.sampleFile;
    QR_Tag = sampleFile.name;
    sampleFile.mv('./public/qr_tags' + QR_Tag, function (err) {
        if (err)
            return res.status(500).send(err);
        // console.log("Image you are uploading is " + QR_Tag)
        // res.redirect('/');
    })

    Asset.findById(req.params.id, 'assets', function(err, details){ 
        if(err){
            return res.status(500).json({
                error: 'Error reading post: ' + err,
              });
        }  
        var subDoc = details.assets.id(req.params.docID);
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



// Route '/delete/:id/:docID'  Removes asset and the related asset certificate from the database    X
    // Removes the asset 
router.put('/delete/:id/:docID', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function(req, res, next){
    
   Asset.update(
            {_id: req.params.id},
            { $pull: {assets: {_id: req.params.docID} } },
            
            

            function(err, employer) {
                if(err){
                    console.log(err)
                }
                // res.json(employer);
                next()
            }

            
        )

});
// Removes the asset cert 
router.put('/delete/:id/:docID', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function(req,res){
Asset.update({_id: req.params.id},
    {$pull: {assetCerts: {assetID: req.params.docID } } },

    function(err, employer) {
        if(err){
            console.log(err)
        }
        res.json(employer);
        
    }

)
});

//  Update asset information (asset_type, asset_name, status )     x
router.put('/update/:id/:docID', requireAuth, AuthController.roleAuthorization(['employer']), AuthController.isUser(), function(req, res){

    Asset.findById(req.params.id, 'assets updated', function(err, employer){
        if(err){
            return res.status(500).json({
                error: 'Error reading post: ' + err,
              });
        } 
        var subDoc = employer.assets.id(req.params.docID);
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