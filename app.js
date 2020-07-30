var express = require("express");  // call the express module 

 // var http = require('http');
var mongoose = require("mongoose");
var passport = require('passport');
var flash = require('connect-flash');

var bodyParser = require("body-parser");
var logger = require('morgan');


var mongoDB = 'mongodb://localhost:27017/rcwdb'
mongoose.connect(mongoDB, { useNewUrlParser: true, useCreateIndex: true });
let db = mongoose.connection;

// Check mongodb connection
db.once('open', function(){
    console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err){
    console.log(err);
});

const PORT = process.env.PORT || 5000;          // environment variables used in messsage and app listen + paypal sandbox
const IP = process.env.IP || "127.0.0.1";

// Init App
const app = express();

//// socket.io
// const server = http.createServer(app);
// const io = socketIO(server);


// require('./socket/friend')(io);

app.use(logger('dev'));

var fs = require('fs');  // The Node.js file system module allows you to work with the file system on your computer.
// body parser to get information
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("views"));// allows access to views folder
app.use(express.static("models"));// allows access to models folder
app.use(express.static("images")); // Allows access to the images folder
app.use(express.static("styles")); // Allows access to the styles folder
app.use(express.static("qr_tags")); // Allows access to the qr_tags folder
app.use(express.static("public")); // Allows access to the public folder



app.use(passport.initialize());


// Set the template engine
app.set('view engine', 'ejs'); //Tells the app that all pages will be rendered in the ejs syntax unless otherwise stated



// Initiate file uploader
const fileUpload = require('express-fileupload');
app.use(fileUpload());




//---------- Routes -----------


// Route Files
let auth = require('./routes/auth');
app.use('/auth', auth);

let users = require('./routes/users');
app.use('/users', users);

// let userdetails = require('./routes/userdetails');
// app.use('/userdetails', userdetails);

let employers = require('./routes/employers');
app.use('/employers', employers);

let asset = require('./routes/asset');
app.use('/asset', asset);

let employees = require('./routes/employees');
app.use('/employees', employees);

let institution = require('./routes/institution');
app.use('/institution', institution);

let employeeCerts = require('./routes/employeeCerts');
app.use('/employeeCerts', employeeCerts);

let certificates = require('./routes/certificates');
app.use('/certificates', certificates);

let e_learning = require('./routes/e_learning');
app.use('/e_learning', e_learning);

let safedocs = require('./routes/safedocs');
app.use('/safedocs', safedocs);

let insuredoc = require('./routes/insuredoc');
app.use('/insuredoc', insuredoc);

let admin = require('./routes/admin');
app.use('/admin', admin);



// this code provides the server port for our application to run on
app.listen(process.env.PORT || 5000, process.env.IP || "0.0.0.0", function() {
    console.log("localhost:"+ PORT +" is running");
      
});
