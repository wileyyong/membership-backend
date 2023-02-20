var express = require('express');
var router = express.Router();
var User = require('../models/User')
var bcrypt = require('bcrypt');
var moment = require('moment');
var bodyParser = require('body-parser')

var Membership = require('../models/Membership');
const { default: Stripe } = require('stripe');

const stripe = require("stripe")("sk_test_51MbfzNLlfbjWJ6bQJKql2RRTkphGHBNOm8TeNw5UYvKDgiv1uNMllnKRmGFg0zlSw2Wt2lCFUfrZhErsTBVQ9dmc000iekoB3L");


router.get('/', (req, res) => {
    res.send("Register Here")
});

//Body-Parser
var jsonParser = bodyParser.json()

router.post('/', jsonParser, async (req, res) => {
	//Hash Password 
	// console.log(req.body)
	let { amount, id } = req.body;
    
	try {
const body = req.body;

    const options = {
    ...body,
      amount: 1000,
      currency: 'usd',
      description: 'Software development services',
    };
  
    const payment = await stripe.paymentIntents.create(options);

    // const payment = await stripe.paymentIntents.create({
    //   amount: parseInt(amount),
    //   currency: "usd",
    //   payment_method_types: ['card'],
    //   confirm: true,
    // });



    // const payment =  await stripe.checkout.sessions.create({
    //   payment_method_types: ["card"],
    
    //   line_items: [
    //     {
    //       price_data: {
    //         currency: "usd",
    //         product_data: {
    //           name: "T-shirt",
    //         },
    //         unit_amount: 40000,
    //       },
    //       quantity: 1,
    //     },
    //   ],
    //   mode: "payment",
    //   success_url: "http://localhost:3000/stripepaymentsuccess",
    //   cancel_url: "http://localhost:3000/stripepaymentcancel",
    // });
    console.log(payment);
    // console.log("stripe-routes.js 19 | payment", payment);
    res.json({
      message: "Payment Successful",
      success: true,
    });
  } catch (error) {
    console.log(error.message,'error');
    // console.log("stripe-routes.js 17 | error", error);
    res.json({
      message: "Payment Failed",
      success: false,
    });
  }


});


router.post('/create',async(req,res)=>{
  try {

    let body = req.body;
    
  
    const options = {
      ...body,
      currency:'INR',
      description: 'Token development services',
    };



    const paymentIntent = await stripe.paymentIntents.create(options);
    
    res.json(paymentIntent);
  } catch (error) {
    res.json({
      message: "Payment Failed",
      success: false,
    });
  }
})


router.post('/process-payment',async(req,res)=>{
  try {

    const {paymentMethodId,amount,currency} = req.body

    console.log(paymentMethodId,amount,currency);

  

    // Create a new customer and attach the payment method to it
    const customer = await stripe.customers.create();
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id
    });
console.log(customer);
    const paymentIntent = await stripe.paymentIntents.create({
      payment_method: paymentMethodId,
      amount,
      currency,
      customer:customer.id,
      confirm: true
    });

    stripe.charges.create({
      amount: 1000, // The amount in cents
      currency: 'usd',
      customer:customer.id, // The ID of a payment source, such as a card token or source object
    }, (err, charge) => {
      if (err) {
        console.log(err);
        // Handle the error appropriately
      } else {
        res.json(charge)
        // The charge ID (transaction ID) is accessible in the 'id' field of the charge object
      }
    });

  

  } catch (error) {
    res.json({
      status:false,
      message:error.message
    })
  }
})

module.exports = router;
