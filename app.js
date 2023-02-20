var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
const cors = require('cors')

var Membership = require('./models/Membership')

var app = express();


// Login and Register 
require('./auth/auth');
const login = require('./routes/login')
const loggedInPage = require('./routes/loggedInUser');
// ----------------------------------------------------

const bookingRoute = require('./routes/routeSelection')

var registerRouter = require('./routes/register');
var routeMembership = require('./routes/routeMembership');
var routeTransaction = require('./routes/routeTransaction');
var routePayment = require('./routes/routePayment');
var tokenRouter = require('./routes/tokenRouter.js')
var adminRouter = require('./routes/adminRoutes')
var getUserRouter = require('./routes/getUserRoutes')
//--------------------------------------------------------


//DB Config
const DB_URL = require('./config/keys').MongoURI;

//connect to mongo
//---------------------------------------------
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connected to MongoDB")

        // let membership = 
        //     // {
        //     //     name: "Basic",
        //     //     month: 4.99,
        //     //     annual: 4.5,
        //     //     bids: 50,
        //     //     skills: 50,
        //     //     rewards: true,
        //     //     freeSealed: true,
        //     //     eligible: true,
        //     //     coverPhoto: true,
        //     //     highlighted: false,
        //     //     extensions: false
        //     // }
        //     // {
        //     //     name: "Plus",
        //     //     month: 9.99,
        //     //     annual: 8.9,
        //     //     bids: 50,
        //     //     skills: 50,
        //     //     rewards: true,
        //     //     freeSealed: true,
        //     //     eligible: true,
        //     //     coverPhoto: true,
        //     //     highlighted: true,
        //     //     extensions: true
        //     // }
        //     // {
        //     //     name: "Professional",
        //     //     month: 49.0,
        //     //     annual: 39.9,
        //     //     bids: 50,
        //     //     skills: 50,
        //     //     rewards: true,
        //     //     freeSealed: true,
        //     //     eligible: true,
        //     //     coverPhoto: true,
        //     //     highlighted: false,
        //     //     extensions: false
        //     // }
        //     {
        //         name: "Premier",
        //         month: 99.0,
        //         annual: 79.9,
        //         bids: 50,
        //         skills: 50,
        //         rewards: true,
        //         freeSealed: true,
        //         eligible: true,
        //         coverPhoto: true,
        //         highlighted: true,
        //         extensions: true
        //     }
        
        // let newUser = new Membership(membership)
        // // console.log(newUser)
        // newUser.save((err, reslut) => {
        //     if (err) console.log(err)
        //     // else res.status(201).json(reslut)
        // })
    })
    .catch(err => {
        throw err
    })
//---------------------------------------------


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({origin:'*'}));
app.use('/', login);
app.use('/booking', bookingRoute);
app.use('/register', registerRouter);  // To register page 
app.use('/user', passport.authenticate('jwt', { session: false }), loggedInPage); //To Secure Route
app.use('/get-user',getUserRouter)
app.use('/membership', routeMembership);  // To register page 
app.use('/payment', routePayment)
app.use('/transaction', routeTransaction)
app.use('/token',tokenRouter)
app.use('/admin',adminRouter)

module.exports = app;
