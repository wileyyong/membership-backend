var express = require('express')
var router = express.Router()
var User = require('../models/User')
var bcrypt = require('bcrypt')
var moment = require('moment')
var bodyParser = require('body-parser')
var Transaction = require('../models/Transaction')
var Membership = require('../models/Membership')
const { default: Stripe } = require('stripe')

const contractAddress = require('../web3/JJT/contractAddress/contractAddress')
const contractABI = require('../web3/JJT/contractABI/contractABI.json')
const Web3 = require('web3');
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545')
const { BigNumber } = require('bignumber.js');



const stripe = require('stripe')(
  process.env.STRIPE_SECRETEKEY,
)

router.get('/', (req, res) => {
  res.send('Register Here')
})

//Body-Parser
var jsonParser = bodyParser.json()


router.post('/payment_v2', async (req, res) => {
  try {
    const {
      userId,
      membershipName,
      type,
      amount,
      cardNumber,
      expiryMonth,
      expiryYear,
      cvc,
    } = req.body

    console.log(userId,
      membershipName,
      type,
      amount,
      cardNumber,
      expiryMonth,
      expiryYear,
      cvc,);

    const token = await stripe.tokens.create({
      card: {
        number: cardNumber,
        exp_month: parseInt(expiryMonth),
        exp_year: parseInt(expiryYear),
        cvc: parseInt(cvc),
      },
    })

    const charge = await stripe.charges.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      source: token.id,
    })

  

    let newTransaction = {}
    newTransaction.ccType = charge.payment_method_details.card.brand;
    newTransaction.paidAmount = amount
    newTransaction.paymentMethod = charge
    newTransaction.user_id = userId
    newTransaction._createdAt = new Date()
    newTransaction._updatedAt = new Date()

    newTransaction.number = charge.id
    newTransaction.status = true

    const response = await Transaction.create(newTransaction)

    const value = Math.round((parseFloat(amount) / 100).toFixed(2) * 10000)

    const bigNumber = new BigNumber(value)

    const contractInstance = new web3.eth.Contract(contractABI, contractAddress)

    const getMember = await Membership.findOne({ name: membershipName })

    // console.log(getMember);

    const getUserAddress = await User.findById({ _id: userId })

    const AdminNonce = await web3.eth.getTransactionCount(
      process.env.ADMIN_ADDRESS,
      'pending',
    )

    console.log(contractAddress)

    const AdminSignTx = await web3.eth.accounts.signTransaction(
      {
        from: process.env.ADMIN_ADDRESS,
        to: contractAddress,
        gas: await contractInstance.methods
          .transfer(getUserAddress.publicKey, bigNumber)
          .estimateGas({
            //admin address
            from: process.env.ADMIN_ADDRESS,
          }),
        nonce: AdminNonce,
        data: await contractInstance.methods
          .transfer(getUserAddress.publicKey, bigNumber)
          .encodeABI(),
      },
      //adminprivatekey
      '0xc5718b7a510cb18411c9b1278a3f4ec7b5e28dd9ce0fec6474c6811628e9b498',
    )

    console.log(AdminSignTx, 'adminsign')
    await web3.eth.sendSignedTransaction(
      AdminSignTx.rawTransaction,
      async function (error, hash) {
        if (!error) {
         
          const updateTransaction = await Transaction.findOneAndUpdate(
            { number: charge?.id },
            {
              $set: {
                tokenTransactionHash: hash,
              },
            },
            { new: true },
          )

          const a = {
            renew:
              type === 'Monthly'
                ? moment(currentDate).add(1, 'M').format('YYYY-MM-DD')
                : moment(currentDate).add(1, 'Y').format('YYYY-MM-DD'),
            type: type,
          }

          console.log(a)
          var currentDate = moment().format('YYYY-MM-DD')
          console.log(amount)
          const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
              $set: {
                membership: getMember._id,
                dop: moment().format('YYYY-MM-DD'),
                renew:
                  type === 'Monthly'
                    ? moment(currentDate).add(1, 'M').format('YYYY-MM-DD')
                    : moment(currentDate).add(1, 'Y').format('YYYY-MM-DD'),
                type: type,
                isActive: true,
              },
            },
            { new: true },
          )

          const updatedValue = await User.findByIdAndUpdate(
            userId,
            {
              $inc: {
                token: parseFloat(amount) / 100,
                amount: parseFloat(amount),
              },
            },
            { new: true },
          )

          const userData = await User.findById({ _id: userId }).populate(
            'membership',
          )

          const sendData = {
            cardType:charge.payment_method_details.card.brand,
            paidAmount:amount,
            plan:membershipName,
            data:userData,
            transactionId:charge.id,
            transactionUrl:charge.receipt_url
          }

          res.status(200).json({ message: 'Payment successful', sendData })
        }
      },
    )
  } catch (err) {
    console.error(err.message,'message')
    res.status(503).send({message:err.message})
  }
})

module.exports = router
