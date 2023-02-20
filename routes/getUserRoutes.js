const express = require('express');

const router = express.Router();
const User =require('../models/User')




router.post('/',async(req,res)=>{
    try {
    const {userId} = req.body
    const response = await User.findById({_id:userId}).populate('membership')

    // console.log(response,'response');
    
    res.json({data:response});
        
    } catch (error) {
        res.json({
            message:error.message,
                status:false
        })
    }
    })

    module.exports = router;