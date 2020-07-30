const express = require('express');
const router = express.Router();

// Bring in the User details model
let Userdetail = require('../models/userdetail');


// See all user details table
router.get('/viewall', function(req, res){

    // user details full table
    Userdetail.find({}, function(err, details){
        if(err){
            console.log(err);
        } else {
            res.json(details);
        }
    });
});

// view individual user details
router.get('/:id', function (req, res) {

    Userdetail.findById(req.params.id, function(err, details){

        res.json(details);
        
    })
    
});


// Add user details
router.get('/add/:id', function(req, res){
    res.send('add user details');
});

router.post('/add/:id', function(req, res){

    let sampleFile = req.files.sampleFile;
    company_logo = sampleFile.name;

    sampleFile.mv('./public/images/' + company_logo, function (err) {

        if (err)

            return res.status(500).send(err);
        console.log("Image you are uploading is " + company_logo)
        // res.redirect('/');
    });

    let details = new Userdetail();
    details.createdBy = req.params.id;
    details.company_name = req.body.company_name;
    details.business_type = req.body.business_type;
    details.company_logo = company_logo;
    details.business_email = req.body.business_email;
    details.phone = req.body.phone;
    details.address = req.body.address;


    details.save(function(err){
        if(err){
            console.log(err);
            return;
        } else {
            res.json(details);
        }
    });
});

// Edit User Details Get request
router.get('/edit/:id', function(req, res){
    res.send('add user details');
});

// Edit User Details Post request
router.post('/edit/:id/:createdBy', function(req, res){
    
    let sampleFile = req.files.sampleFile;
    company_logo = sampleFile.name;

    sampleFile.mv('./public/images/' + company_logo, function (err) {

        if (err)

            return res.status(500).send(err);
        console.log("Image you are uploading is " + company_logo)
        // res.redirect('/');
    });


    let details = {};
    details.createdBy = req.params.createdBy;
    details.company_name = req.body.company_name;
    details.business_type = req.body.business_type;
    details.company_logo = company_logo;
    details.business_email = req.body.business_email;
    details.phone = req.body.phone;
    details.address = req.body.address;

    let query = {_id:req.params.id}

    Userdetail.update(query, details, function(err){
        if(err){
            console.log(err);
            return;
        } else {
            res.json(details);
        }
    });
});

// Remove user details from database
router.get('/delete/:id', function(req, res, next){

    Userdetail.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('user details deleted');
    })
});

module.exports = router;