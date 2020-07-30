var AuthenticationController = require('../controllers/authentication'),   
    express = require('express'),
    passportService = require('../config/passport'),
    passport = require('passport');
    const router  = express.Router();

var requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});


    router.post('/register', AuthenticationController.register);
    router.post('/login', requireLogin, AuthenticationController.login);

    router.get('/protected', requireAuth, function(req, res){
        res.send({ content: 'Success'});
    });

   


module.exports = router;
