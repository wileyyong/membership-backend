var express = require('express');
var router = express.Router();
var User = require('../models/User')
var bcrypt = require('bcrypt');
var moment = require('moment');
var bodyParser = require('body-parser')
const Web3 = require('web3')
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545')
var Membership = require('../models/Membership')



router.get('/', (req, res) => {
    res.send("Register Here")
});

//Body-Parser
var jsonParser = bodyParser.json()

router.post('/', jsonParser, async (req, res) => {
    //Hash Password 
    const hashPassword = await bcrypt.hash(req.body.password, 10)

    const account = web3.eth.accounts.create()

    //You will store the above account in your database
    console.log(account)

    let user = {
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
        mobile: req.body.mobile,
        gender: req.body.gender,
        dob: moment(req.body.dob).format('YYYY-MM-DD'),
        dop: null,
        membership: null,
        publicKey:account.address,
	    privateKey:account.privateKey,
        tokenAmount:0
    }
    let newUser = new User(user)
    // console.log(newUser)
    newUser.save((err, reslut) => {
        if (err) console.log(err)
        else res.status(201).json(reslut)
    })


});



module.exports = router;
