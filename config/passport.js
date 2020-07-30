var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var LocalStrategy = require('passport-local').Strategy;
// load up the user model
var User = require('../models/user');
var settings = require('../config/settings');   // get the settings file


    var localOptions = {
        usernameField: 'email'
    };

    var localLogin = new LocalStrategy(localOptions, function(email, password, done){

        User.findOne({
            email: email
        }, function(err, user){

            if(err){
                return done(err);
            }

            if(!user){
                return done(null, false, {error: 'Login failed. Please try again.'});
            }
            user.comparePassword(password, function(err, isMatch) {

                if(err){
                    return done(err);
                }
    
                if(!isMatch){
                    return done(null, false, {error: 'Login failed. Please try again.'});
                }
    
                return done(null, user);
        });
    });
});

passport.use(localLogin);


module.exports = function(passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    opts.secretOrKey = settings.secret;

    passport.use(
        new JwtStrategy(opts, function(jwt_payload, done) {

            User.findOne({_id: jwt_payload._id}, function(err, user) {
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            });
    }));
};

