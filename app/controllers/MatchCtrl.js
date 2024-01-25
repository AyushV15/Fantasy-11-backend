const { validationResult } = require("express-validator")
const _ = require('lodash')
const Match = require("../models/Match")
const Team = require("../models/Team")
const Contest = require("../models/Contest")
const User = require("../models/User")
const Notification = require("../models/Notification")
const Wallet = require("../models/Wallet")
const { getIOInstance } = require("../../config/socketConfig")
const jwt = require('jsonwebtoken')



const matchCtrl = {}

matchCtrl.listMatches = async (req,res) =>{
    try{
        const matches = await Match.find()
        res.status(200).json(matches)
    }catch(e){
        res.status(500).json(e)
    }
}

matchCtrl.listMatches = async (req,res) =>{
    try{
        const matches = await Match.find()
        res.status(200).json(matches)
    }catch(e){
        res.status(500).json(e)
    }
}

matchCtrl.createMatch = async (req,res) =>{
   
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()})
    }
    const body = _.pick(req.body,["team1","team2",'tournament',"deadline","team1logo","team2logo","team1players","team2players"])
    const team1 = JSON.parse(body.team1players)
    const team2 = JSON.parse(body.team2players)
    console.log(req.files)
   
    body.team1logo = req.files.team1logo[0].originalname
    body.team2logo = req.files.team2logo[0].originalname
    try{ 
        const match = new Match(body)
        // match.team1players = team1
        // match.team2players = team2
        match.team1players = team1.map(ele =>{
            return {...ele , team : body.team1}
        })
        match.team2players = team2.map(ele =>{
            return {...ele , team : body.team2}
        })
        await match.save()
        res.status(201).json(match) 
    }catch(e){
        res.status(500).json(e)
        console.log(e)
    }
}  

matchCtrl.upcomingMatches = async (req,res) =>{

    const page = req.query.page || 1
    const skip = (page - 1) * 2

    try{
        const match = await Match.find({ deadline: { $gt: new Date() } }).sort({deadline : 1}).skip(skip).limit(2)
        
        res.status(200).json(match)
    }catch(e){
        res.status(500).json(e)
    } 
} 

matchCtrl.oneMatch = async (req,res) =>{
    const id = req.params.id
    try{
        const match = await Match.findById(id)
        res.status(200).json(match)
    }catch(e){
        res.status(500).json(e)
    }
}


matchCtrl.scoreUpdates = async (req,res)=>{
    const id = req.params.matchid
    const io = await getIOInstance()
    try{
        const match = await Match.findByIdAndUpdate(id,req.body,{new : true}) 
        const players = [...match.team1players,...match.team2players]

        const Teams = await Team.find({matchId : id})   

        Teams.map(async(ele) =>{
            const t = []
            ele.team.map(e =>{
               players.forEach(p =>{
                if(p._id == e._id){
                    t.push({...e , score : p.score})
                }
               })
            })
            await Team.findByIdAndUpdate(ele._id,{team : t},{new :true})
        })
        io.to(`${id}`).emit("update",[...match.team1players,...match.team2players])

        res.status(200).json(match)
    }catch(e){
        res.status(500).json(e)
        console.log(e)
    }
}


matchCtrl.generateResults = async (req,res) =>{
    const id = req.params.matchid
    try {
        const contests = await Contest.find({matchid : id}).populate('teams')
        console.log(contests)
        contests.map(async (ele) =>{
            const sort = ele.teams.sort((a,b)=>{
                const t1 = a.team.reduce((acc,cv)=>{
                  return acc +=cv.score
                },0)
                const t2 = b.team.reduce((acc,cv)=>{
                  return acc +=cv.score
                },0)
                return t2 - t1
              })
              await Contest.findByIdAndUpdate(ele._id,{teams : sort})
        })
        res.json("hi")
    }catch(e){
        res.json(e)
    }
}

matchCtrl.declareResults = async (req,res) =>{

    const matchid = req.params.matchid
    try{
        const match = await Match.findById(matchid)
        if(match.isCompleted){
           return res.status(400).json("results have been aldready declared")
        }

        const contests = await Contest.find({matchid : matchid}).populate('teams')
        console.log(contests)
        contests.map(async (ele) =>{
            await Wallet.findByIdAndUpdate("659ad4e347e16abda2bd5c7b",{$inc: { amount : -ele.totalPrize}})
            ele.teams.forEach((e,i) =>{
                ele.prizeBreakup.forEach( async (prize) =>{
                    if(prize.rank == i + 1){
                        await Wallet.findOneAndUpdate({userId : e.userId},{$inc: { amount : prize.prize }})
                        const body = {
                            userId : e.userId,
                            text : `🏆 Congratulations you won Rs ${prize.prize} in ${match.team1} vs ${match.team2}`,
                            date : new Date()
                        }
                        const notification = new Notification(body)
                        console.log(notification)
                        await notification.save()
                    }
                })
            })
        })
        await Match.findByIdAndUpdate(req.params.matchid,{isCompleted : true})
        res.json("results declared successfully")
    }catch(e){
        res.json(e)
    } 
}

matchCtrl.cancelMatch =  async (req,res) =>{
    const contest = await Contest.find({matchid : req.params.matchid}).populate('teams')
    try{

        contest.forEach(async (ele) => {
            ele.teams.forEach(async(e) => {
                await Wallet.findOneAndUpdate({userId : e.userId},{$inc : {amount : ele.entryFee}})
                await User.findByIdAndUpdate(e.userId,{$pull : {contests : ele._id , teams : e._id}})
                await Team.findByIdAndDelete(e._id)
            })
            await Contest.findByIdAndDelete(ele._id)
        })
        await Match.findByIdAndDelete(req.params.matchid)
    }catch(e){
        res.status(500).json(e)
    }
    const io = await getIOInstance()
    io.to(`${req.params.matchid}`).emit("cancel"," ❌ match has been cancelled, if u had joined any contest , ur money will be refunded")
}

matchCtrl.extendDeadline = async (req,res) =>{
    const id = req.params.matchid
    const {deadline,message} = req.body
  
    try{
        const match = await Match.findByIdAndUpdate(id,{deadline : deadline,message : message},{new : true})
        const io = await getIOInstance()
        io.to(`${req.params.matchid}`).emit("extended",match)
        res.status(200).json(match)
    }catch(e){
        console.log(e)
    }
}

module.exports = matchCtrl       