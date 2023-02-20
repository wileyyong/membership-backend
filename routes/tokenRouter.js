var express = require('express');
var router = express.Router();
const Web3 = require('web3')
var bodyParser = require('body-parser')
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545')
const contractAddress = require('../web3/JJT/contractAddress/contractAddress')
const contractABI = require('../web3/JJT/contractABI/contractABI.json')


var jsonParser = bodyParser.json()

router.post('/balance',jsonParser,async(req,res)=>{
    try {


        const contractInstance = new web3.eth.Contract(
            contractABI,contractAddress
            )

        const {userAddress} = req.body;
        console.log(userAddress);

        const userTokenBalance = await contractInstance.methods
      .balanceOf(userAddress)
      .call({
        from: userAddress,
      })


      const balance =  userTokenBalance / 10000

      res.json({
        message:balance,
        status:true
      })
        
    } catch (error) {
        res.json({
            message:error.message,
            status:false
        })
    }
})

module.exports = router;