var express = require('express');
var router = express.Router();
const Web3 = require('web3')
var bodyParser = require('body-parser')
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545')
const contractAddress = require('../web3/JJT/contractAddress/contractAddress')
const contractABI = require('../web3/JJT/contractABI/contractABI.json')
const Admin = require('../models/admin')


var jsonParser = bodyParser.json()

router.post('/create',jsonParser,async(req,res)=>{
    try {


        const account = web3.eth.accounts.create()

        //You will store the above account in your database
        console.log(account)
    
        let user = {
            name:'admin',
            email: 'admin@letsbuild.com',
            dop: null,
            membership: null,
            publicKey:account.address,
            privateKey:account.privateKey,
            tokenAmount:0
        }

        const createAdmin = await Admin.create(user)

        
    } catch (error) {
        res.json({
            message:error.message,
            status:false
        })
    }
})

module.exports = router;