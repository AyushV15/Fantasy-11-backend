const { validationResult } = require("express-validator")
const _ = require("lodash")
const User = require("../models/User")


const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Wallet = require("../models/Wallet")
const nodemailer = require("nodemailer")
const UserCtrl = {}

//listing all users (admin)
UserCtrl.listUsers = async (req,res) =>{
    try{
        const users = await User.find()
        res.status(200).json(users)
    }catch(e){
        res.status(500).json(e)
    } 
}

//activate/deactivate user (admin)
UserCtrl.controlUser = async (req,res) =>{
    const {id,status} = req.body
    try{
        const users = await User.findByIdAndUpdate(id,{isActive : !status},{new : true})
        res.status(200).json(users)
        console.log(users)
    }catch(e){
        res.status(500).json(e)
    }
}

// registering a user 
UserCtrl.register = async (req,res) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    const body = _.pick(req.body,["username","password","email","role","isActive","mobile"])
    try{
        const user = new User(body)
        const salt = await bcryptjs.genSalt()
        const encryptedPassword = await bcryptjs.hash(user.password,salt) // encrypting password with bycrpyt js
        user.password = encryptedPassword
        const userCount = await User.countDocuments()
        if(userCount == 0){
            user.role = "admin"
        }else{
            user.role = "user"
        }
        await user.save()
        const wallet = new Wallet({userId : user._id})
        wallet.save()
        res.json(user)
    }catch(e){
        res.status(500).json(e)
    }
}


//logging in a user 
UserCtrl.login = async (req,res) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    const body = _.pick(req.body,["email","password"])

    try{
        const user = await User.findOne({email : body.email})
    if(!user){
        return res.status(404).json("inavlid email or password")
    }
    const result = await bcryptjs.compare(body.password,user.password)

    if(!result){
        return res.status(404).json("invalid email or password")
    }

    if(user.isActive){
        const tokendata = {id : user._id,role : user.role}
        const token = jwt.sign(tokendata,process.env.JWT,{expiresIn : "7d"})
        res.status(200).json({token : token})
    }else{
        res.status(400).json("ur account has been blocked , please contact the admin")
    }

    }catch(e){
        res.status(500).json(e)
    }
}

// fetching users data 
UserCtrl.account = async (req,res)=>{
    try {
        const user = await User.findById(req.user.id).populate("matches")

        res.status(200).json(user)
        console.log()
    } catch(e){
        res.status(500).json(e)
        console.log(e)
    }
}

//updating user profile
UserCtrl.updateProfile = async (req,res) =>{
    const errors = validationResult(req)
    console.log(errors,"sadf")
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    const body = _.pick(req.body,["currentPassword","newPassword"])
    try{
        if(body.currentPassword){
            const user = await  User.findById(req.user.id)
            const password = await bcryptjs.compare(body.currentPassword,user.password)
            if(password){
                const salt = await bcryptjs.genSalt()
                const newPassword = await bcryptjs.hash(body.newPassword,salt)
                user.password = newPassword
                await user.save()
                return res.json(user)
            }else{
                return res.status(400).json("invalid current Password")
            }
        }
        
        const updateUser = await User.findByIdAndUpdate(req.user.id,{profilePic : req.file.originalname},{new : true})
        res.status(200).json(updateUser)
    }catch(e){
        res.status(500).json(e)
    } 
}

// fetching users wallet
UserCtrl.wallet = async (req,res) =>{
    try{
        const wallet = await Wallet.findOne({userId : req.user.id})
        res.status(200).json(wallet)
    }catch(e){
        res.status(500).json(e)
        console.log(e)
    }
}

// handling forgot password
UserCtrl.forgotPassword = async (req,res) =>{
        const {email} = req.query 
        console.log(email)

        try{
        const user = await User.findOne({email : email})
        if(user){
            let mailTransporter = nodemailer.createTransport({ 
                service: 'gmail',
                auth: {
                    user: process.env.NODEMAILER_EMAIL,
                    pass: process.env.NODEMAILER_PASSWORD
                }
            });

            const number = Math.floor(Math.random() * 90000) + 10000 // generating 5 digit random number
            const tokendata = {number : number , email : email} 
            const token = jwt.sign(tokendata,process.env.JWT,{expiresIn : "10min"})
            res.status(200).json({token : token})
            
            let mailDetails = { // sending email to the user for resetting password
                from: process.env.NODEMAILER_EMAIL,
                to: `${user.email}`,
                subject: 'Fantasy 11 (reset - password-link)',
                html : `<a href=http://localhost:3000/forgot-password?token=${token}>Click here to reset your password</a>
                <p>OTP for changing password - <b>${number}</b></p>
                <p>This link will be valid for only 10 minutes</p>`,
            };
            
            mailTransporter.sendMail(mailDetails, function(err, data) {
                if(err) {
                    console.log('Error Occurs');
                } else {
                    console.log('Email sent successfully');
                }
            })
        }else{
            res.status(404).json("email not found")
        }
    }catch(e){
        res.status(500).json(e)
    }
}

//resetting users password 
UserCtrl.resetPassword = async (req,res) =>{
    const {password ,email,token,otp} = req.body
    try{
        const tokendata = await jwt.verify(token,process.env.JWT)
    
        if(tokendata.number !== Number(otp)){
            return res.status(400).json("invalid otp") // verifying otp 
        }
        const salt = await bcryptjs.genSalt()
        const newPassword = await bcryptjs.hash(password,salt)
        await User.findOneAndUpdate({email : email},{password : newPassword})
        res.status(200).json("password reset successfull")

    }catch(e){
        res.status(500).json(e)
    }
}

module.exports = UserCtrl
