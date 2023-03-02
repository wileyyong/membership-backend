var express = require('express');
var router = express.Router();
var User = require('../models/User')
var bcrypt = require('bcrypt');
var moment = require('moment');
var bodyParser = require('body-parser')
const {contractAddress} = require('../web3/JJT/contractAddress/contractAddress')
const contractABI = require('../web3/JJT/contractABI/contractABI.json')
var Transaction = require('../models/Transaction')




router.post('/', async (req, res) => {
	try {

		const {user_id} = req.body

		const response = await Transaction.find({user_id:user_id}).sort({ createdAt: -1 })

		res.status(201).json(response)
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			message: "Internal server error"
		});
	}
});

//Body-Parser
var jsonParser = bodyParser.json()



router.post('/create', jsonParser, async (req, res) => {
	try {

		console.log(req.body);

		let newTransaction = req.body
		newTransaction._createdAt = new Date()
		newTransaction._updatedAt = new Date()
		
		newTransaction.number = req.body.paymentMethod.id
		newTransaction.status = true

		// Transaction(newTransaction).save(async(err, doc) => {
		// 	if (err) {} else {
		// 		if (!doc) {} else {
		// 			console.log('transaction create: ', doc)
		// 			res.status(200).json(doc)
		// 		}
		// 	}
		// })

		const response = await Transaction.create(newTransaction)

		res.status(200).json(response)


		
	} catch (e) {
		console.log(e);
      return res.status(500).json("Internal server error");
	}
});


router.post('/update', jsonParser, async (req, res) => {
	//Hash Password 
	const { userId, membershipName } = req.body;
		
	try {
		Membership.findOne({ name: membershipName }, async (err, doc) => {
			
			if (err) {} else {
				if (!doc) {} else {
					console.log('123123123123', doc);
					let setData = {};
					if (doc._id) {
						setData.membership = doc._id;
						setData.dop = moment().format('YYYY-MM-DD')
					}

					let updatedUser = await User.findByIdAndUpdate(userId, {
						$set: setData
					}, {
						new: true
					});

					console.log('123123123123', updatedUser);

					res.status(201).json(updatedUser)
				}
			}
		})
	} catch (error) {}


});



module.exports = router;
