const Notification = require("../models/Notification")

const notificationCtrl = {}

notificationCtrl.list = async (req,res) =>{
    try{
        const notification = await Notification.find({userId : req.user.id}).populate("matchId")
        res.status(200).json(notification)
    }catch(e){
        console.log(e)
    }
}

notificationCtrl.clear = async (req,res) =>{
    try{
        await Notification.deleteMany({userId : req.user.id})
        res.status(200).json({message : "cleared successfully"})
    }catch(e){
        res.status(500).json(e)
    }       
}

module.exports = notificationCtrl