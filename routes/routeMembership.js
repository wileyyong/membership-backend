var express = require('express');
var router = express.Router();
var User = require('../models/User')
var bcrypt = require('bcrypt');
var moment = require('moment');
var bodyParser = require('body-parser')
const contractAddress = require('../web3/JJT/contractAddress/contractAddress')
const contractABI = require('../web3/JJT/contractABI/contractABI.json')
var Membership = require('../models/Membership')
const Web3 = require('web3');
const Transaction = require('../models/Transaction');
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545')
const { BigNumber } = require('bignumber.js');




router.get('/', (req, res) => {
    res.send("Register Here")
});

//Body-Parser
var jsonParser = bodyParser.json()

router.post('/update',jsonParser, async (req, res) => {
	//Hash Password 
	
		
	try {

		const { userId, membershipName,paymentMethod,type,amount } = req.body;

		const value = Math.round((parseFloat(amount)/1000).toFixed(2)*10000);

const bigNumber = new BigNumber(value);


		const contractInstance = new web3.eth.Contract(
			contractABI,contractAddress
			)


			
    const getMember = await Membership.findOne({name:membershipName});

	// console.log(getMember);

	const getUserAddress = await User.findById({_id:userId})


	const AdminNonce = await web3.eth.getTransactionCount(process.env.ADMIN_ADDRESS, 'pending')

	console.log(contractAddress);

	const AdminSignTx = await web3.eth.accounts.signTransaction(
		{
		  from: process.env.ADMIN_ADDRESS,
		  to: contractAddress,
		  gas: await contractInstance.methods.transfer(getUserAddress.publicKey,bigNumber)
			.estimateGas({
				//admin address
			  from: process.env.ADMIN_ADDRESS,
			}),
		  nonce: AdminNonce,
		  data:await contractInstance.methods.transfer(getUserAddress.publicKey,bigNumber).encodeABI()
		},
		//adminprivatekey
		"0xc5718b7a510cb18411c9b1278a3f4ec7b5e28dd9ce0fec6474c6811628e9b498",
	  )

	  console.log(AdminSignTx,'adminsign');
	  await web3.eth.sendSignedTransaction(
		AdminSignTx.rawTransaction,
		async function (error, hash) {
		  if (!error) {
console.log(hash,paymentMethod);
			const updateTransaction = await Transaction.findOneAndUpdate({number:paymentMethod?.id},{
				$set:{
					tokenTransactionHash:hash
				}
			},{new:true})

			const a = {
				renew:type==="Monthly"? ( moment(currentDate).add(1, 'M').format('YYYY-MM-DD')) : (moment(currentDate).add(1, 'Y').format('YYYY-MM-DD')),
                    type:type
			}

			console.log(a);
			var currentDate = moment().format('YYYY-MM-DD');
			console.log(amount);
			const updatedUser = await User.findByIdAndUpdate(userId,{
				$set:{
					membership:getMember._id,
					dop: moment().format('YYYY-MM-DD'),
					renew:type==="Monthly"? ( moment(currentDate).add(1, 'M').format('YYYY-MM-DD')) : (moment(currentDate).add(1, 'Y').format('YYYY-MM-DD')),
                    type:type,
 					isActive:true
				}
			},{new:true})

			const updatedValue = await User.findByIdAndUpdate(userId,{
				$inc:{
					token:parseFloat(amount)/100,
					amount:parseFloat(amount)
				}
				
			},{new:true})

			const userData = await User.findById({_id:userId}).populate('membership')
		
		
		
			res.status(200).json(userData)

		  }})



	} catch (error) {
		console.log(error);
	}

});


router.get('/transfer',async(req,res)=>{
	try {
		
		const value = Math.round(54*10000);

const bigNumber = new BigNumber(value);


		const contractInstance = new web3.eth.Contract(
			contractABI,contractAddress
			)


			const AdminNonced = await web3.eth.getTransactionCount("from address", 'pending')

	console.log(contractAddress);

	const AdminSignTxd = await web3.eth.accounts.signTransaction(
		{
		  from: "from address",
		  to: contractAddress,
		  gas: await contractInstance.methods.transfer("to address",bigNumber)
			.estimateGas({
				//admin address
			  from: "from address",
			}),
		  nonce: AdminNonced,
		  data:await contractInstance.methods.transfer("to address",bigNumber).encodeABI()
		},
		//adminprivatekey
		"from private key",
	  )

	  console.log(AdminSignTxd,'adminsign');
	  await web3.eth.sendSignedTransaction(
		AdminSignTxd.rawTransaction,
		async function (error, hash) {
		  if (!error) {

			res.json({hash});
		  }})

		  return;
	} catch (error) {
		res.json({error})
	}
})





module.exports = router;
