const express = require('express');
const router = express.Router();
passport = require('passport');

var AuthController = require('../controllers/authentication');

var requireAuth = passport.authenticate('jwt', {session: false});
// Bring in the User Model
let User = require('../models/user');



// let errorHandler = require('../helpers/dbErrorHandler');
var userCtrl = require('../controllers/user.controller');


// userId parameter
// router.param('userId', userCtrl.userByID);


// make a requset to follow a user
router.put('/requestMake/:UserA/:UserB', requireAuth, userCtrl.pushToRequster, userCtrl.pushToRecipient);


// API to accept request

router.put('/addreQuest/:UserA/:UserB', requireAuth, userCtrl.acceptRequest_AB ,userCtrl.updateA, userCtrl.acceptRequest_BA, userCtrl.updateB);


// remove requester/following , recipient/follower
router.put('/remove/:UserA/:UserB', requireAuth, userCtrl.remove1, userCtrl.remove2  );

// reject follow request 
router.put('/reject/:UserA/:UserB', requireAuth, userCtrl.updateA, userCtrl.updateB );




// Begining of Add Employer/ Employee routes

// make a requset to follow an Employer
router.put('/followEmployer/:Employee/:Employer', requireAuth, userCtrl.pushToEmployer, userCtrl.pushToEmployees);

// Accept request from Employee
router.put('/accept/:Employee/:Employer', requireAuth, userCtrl.accept_AB ,userCtrl.update_Employee, userCtrl.accept_BA, userCtrl.update_Employer);

// Drop Employer, Employee Relationship
router.put('/drop/:UserA/:UserB', requireAuth, userCtrl.drop1, userCtrl.drop2);

// Reject Employee Request
router.put('/deny/:Employee/:Employer', requireAuth, userCtrl.deny1 , userCtrl.deny2 );


// Begining of Share Asset Cert docID

// make a requset for access to document
// router.put('/request_share_assetCert/:id/:id2/:docID' ,/* requireAuth, */ userCtrl.pushToAssetCert, userCtrl.pushToUserID);

// // Accept request from User
// router.put('/accept_share_assetCert/:id/:id2/:doc1/:doc2' ,/* requireAuth, */ userCtrl.accept_1 ,userCtrl.update1, userCtrl.accept_2, userCtrl.update2);

// // Drop Sharing Relationship
// router.put('/drop_share_assetCert/:id/:id2/:docID' /*, requireAuth, userCtrl.drop1, userCtrl.drop2 */ );

// // Reject Sharing Request
// router.put('/deny_share_assetCert/:id/:id2/:docID' /*, requireAuth, userCtrl.deny1 , userCtrl.deny2 */ );




// Remove user from database
router.get('/delete_account/:id', requireAuth, AuthController.isUser(), function(req, res, next){

    User.findByIdAndRemove(req.params.id, function (err) {
        if (err){
            res.status(500).json({
                error: 'Error reading post: ' + err,
            });
            return next(err);
        }
        res.status(200).json({ message: 'Account Deleted ' }); 
    })
});





module.exports = router;