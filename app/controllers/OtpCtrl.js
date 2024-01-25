const OTPctrl = {}
const _ = require("lodash")
const bcryptjs = require('bcryptjs')
const nodemailer = require("nodemailer")
const User = require("../models/User")


OTPctrl.genOTP = async (req,res) =>{
    const body = _.pick(req.body,["email"])
    const number = Math.floor(Math.random() * 90000) + 10000 + ""
    try{

        const salt = await bcryptjs.genSalt()
        const encryptedOTP = await bcryptjs.hash(number,salt)
        const user = await User.findOneAndUpdate({email : body.email},{OTP : encryptedOTP})
        if(!user){
            return res.json({message  : "email is not registered with us"})
        }
        

        let mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'avcodes701@gmail.com',
                pass: 'hfpc snwc bxgd xfcx'
            }
        });
        
        let mailDetails = {
            from: 'avcodes701@gmail.com',
            to: `${user.email}`,
            subject: 'Fantasy 11',
            text: `otp - ${number} , do not share this otp with anyone`
        };
        
        mailTransporter.sendMail(mailDetails, function(err, data) {
            if(err) {
                console.log('Error Occurs');
            } else {
                console.log('Email sent successfully');
                res.json({message : "opt sent successfully"})
            }
        });
        
        
    }catch(e){
        console.log(e)
        res.status(500).json(e)
    }
}


module.exports = OTPctrl