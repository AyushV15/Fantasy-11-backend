const { validationResult } = require("express-validator")
const Contest = require("../models/Contest")
const Wallet = require("../models/Wallet")
const Notification = require("../models/Notification")
const { getIOInstance } = require("../../config/socketConfig")


const contestCtrl = {}

contestCtrl.listContest = async (req,res) =>{
    const id = req.params.matchid
    try{
        const contest = await Contest.find({matchid : id})
        res.json(contest)
    }catch(e){
        console.log(e)
    }
}


contestCtrl.createContest = async (req,res) =>{

    const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()})
        }
    
    const body = req.body
    try{
        const contest = new Contest(body)
        contest.matchid = req.params.matchid
        await contest.save()
        res.status(201).json(contest)
    }catch(e){
        res.status(500).json(e)
        console.log(e)
    }   
}
 
contestCtrl.joinContest = async (req,res) =>{

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    const id = req.params.contestid
    const body = req.body
    try{
        const contest = await Contest.findByIdAndUpdate(id,{$push : {teams : body}})
        await Wallet.findByIdAndUpdate("659ad4e347e16abda2bd5c7b",{ $inc: { amount: contest.entryFee }})
        await Wallet.findOneAndUpdate({userId : req.user.id},{ $inc: { amount: -contest.entryFee }})
        res.status(201).json(contest)
    }catch(e){
        res.status(500).json(e)
        console.log(e) 
    }
}

contestCtrl.userContest = async (req,res) =>{
    const matchid = req.params.matchid
   
    const contest = await Contest.find({matchid : matchid}).populate({
        path : "teams",
        populate : [
            {path : "userId" , model : "User"}
        ]
    })

      const matchingContest = contest.filter(contest => {
            if(contest.teams.some(team => team.userId._id == req.user.id )){
                return contest
            }
      })

    res.json(matchingContest)
}

contestCtrl.cancelContests = async (req,res) =>{
    const id = req.params.matchid
    const io = await getIOInstance()
    try{
        const contests = await Contest.find({matchid : id}).populate('teams')
        const unfilledContests = contests.filter(ele =>{
            return ele.teams.length < ele.slots
        })
        if(unfilledContests.length === 0){
            return res.status(400).json("No Unfilled Contests Found")
        }
        
        unfilledContests.forEach(async(contest) =>{
            contest.teams.forEach(async (team) =>{
                await Wallet.findOneAndUpdate({userId : team.userId},{$inc : {amount : contest.entryFee}})
                const notification = new Notification({
                    userId : team.userId,
                    text : "Your Contest didnt fill up , we have initiated a refund",
                    date : new Date()
                })
                await notification.save()
            })
            await Contest.findByIdAndDelete(contest._id)
        })
    }catch(e){
        console.log(e)
    }
}


module.exports = contestCtrl 