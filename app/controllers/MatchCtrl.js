const { validationResult } = require("express-validator")
const _ = require('lodash')
const Match = require("../models/Match")
const Team = require("../models/Team")
const Contest = require("../models/Contest")
const User = require("../models/User")
const Notification = require("../models/Notification")
const Wallet = require("../models/Wallet")
const { getIOInstance } = require("../../config/socketConfig")
const { default: mongoose } = require("mongoose")



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
   
    body.team1logo = req.files.team1logo[0].originalname
    body.team2logo = req.files.team2logo[0].originalname
    try{ 
        const match = new Match(body)
        match.team1players = team1.map(ele =>{
            return {...ele , team : body.team1}
        })
        match.team2players = team2.map(ele =>{
            return {...ele , team : body.team2}
        })
        await match.save()
        await User.findOneAndUpdate({role : "admin"},{$push : {matches : match._id}})
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
        // const match await Match.find().skip().limit()
        
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
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    try{
        const body = _.pick(req.body , ["team1players","team2players"])
        console.log(body)
        // const match = await Match.findByIdAndUpdate(id,req.body,{new : true}) 
        const match = await Match.findByIdAndUpdate(id,{team1players : body.team1players,team2players : body.team2players },{new : true}) 
        const players = [...match.team1players,...match.team2players]
        const Teams = await Team.find({matchId : id})   
        
        Teams.map(async(ele,i) =>{ 
            const t = []
            ele.team.map(e =>{
               players.forEach(p =>{
                if(p._id == e._id){
                    t.push({...e , score : p.score})
                }
               })
            })
            
            totalpoints = t.reduce((acc,cv)=>{
                console.log(cv , "player 1")
                if(cv.C){
                    console.log("captain")
                    acc += 2 * cv.score.reduce((c,ce)=>c+=ce.points,0)
                }else if(cv.VC){
                    console.log("vice captain")
                    acc += 1.5 * cv.score.reduce((c,ce)=>c +=ce.points,0)
                }
                else{
                    console.log("normal")
                    acc += cv.score.reduce((c,ce)=>c +=ce.points,0)
                }
                return acc 
            },0)
            
            
            await Team.findByIdAndUpdate(ele._id,{team : t,totalPoints : totalpoints},{new :true})
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
                return b.totalPoints - a.totalPoints
              })
              await Contest.findByIdAndUpdate(ele._id,{teams : sort})
        })
        res.status(200).json("rank calculated successfully")
    }catch(e){ 
        res.json(e)
    }
}

matchCtrl.declareResults = async (req,res) =>{

    const io = await getIOInstance()
    const matchid = req.params.matchid
    try{
        const match = await Match.findById(matchid)
        if(match.isCompleted){
           return res.status(400).json("results have been aldready declared")
        }

        const contests = await Contest.find({matchid : matchid}).populate('teams')
        const totalPrize = contests.reduce((acc,cv)=> acc+= cv.totalPrize,0)
        console.log(totalPrize,"sadf")

        const wallet = await Wallet.findById(process.env.ADMIN_WALLET)
        console.log(wallet)

        if(wallet.amount < totalPrize){
            return res.status(400).json("Low wallet Balance")
        }

        contests.map(async (ele) =>{
            await Wallet.findByIdAndUpdate(process.env.ADMIN_WALLET,{$inc: { amount : -ele.totalPrize}})
            //checking teams with same scores
            const duplicate = () => {
                const obj = {};
                const duplicates = [];
            
                ele.teams.forEach((team) => {
                    const score = team.totalPoints;
                    if (!obj[score]) {
                        obj[score] = [team];
                    } else {
                        obj[score].push(team);
                    }
                });
            
                for (const key in obj) {
                    duplicates.push(obj[key]);
                }
            
                return duplicates.sort((a, b) => b[0].score - a[0].score);
            };
            
            const duplicatesArray = duplicate();
            const noDuplicates = duplicatesArray.every(ele => ele.length == 1)
           
            if(noDuplicates){
                ele.teams.forEach((e,i) =>{
                    ele.prizeBreakup.forEach( async (prize) =>{
                        if(prize.rank == i + 1){
                            await Wallet.findOneAndUpdate({userId : e.userId},{$inc: { amount : prize.prize }})
                            const body = {
                                userId : e.userId,
                                text : `🏆 Congratulations you won Rs ${prize.prize} in ${match.team1} vs ${match.team2}`,
                                date : new Date()
                            }
                            e.prize = prize.prize
                            console.log(e.prize)
                            const notification = new Notification(body)
                            console.log(notification)
                            await notification.save()
                            io.to(`${e.userId}`).emit("notification","hi")
                        }
                    })
                })
               
            }else{
                console.log(duplicatesArray)
                let previousLength = 0
                duplicatesArray.forEach((teams)=>{
                    const length = teams.length
                    let prize = 0
                    for (let i = 0; i < length; i++) {
                        prize += ele.prizeBreakup[i + previousLength]?.prize || 0;
                    }
                    const averagePrize = prize / length
                    teams.forEach(async (team) => {
                        if(averagePrize > 0){
                        team.prize = averagePrize
                        await Wallet.findOneAndUpdate({userId : team.userId},{$inc: { amount : averagePrize }})
                        const body = {
                            userId : team.userId,
                            text : `🏆 Congratulations you won Rs ${averagePrize} in ${match.team1} vs ${match.team2}`,
                            date : new Date()
                        }
                        const notification = new Notification(body)
                        await notification.save()
                            io.to(`${team.userId}`).emit("notification","hi")
                           
                        }
                    })
                    previousLength += length
                })
            }
        })
        io.to(matchid).emit("matchEnded","results for this match have been declared")
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
    const body = _.pick(req.body , ["deadline","message"])
    try{
        const match = await Match.findByIdAndUpdate(id,{deadline : body.deadline,message : body.message},{new : true})
        const io = await getIOInstance()
        io.to(`${req.params.matchid}`).emit("extended",match)
        res.status(200).json(match)
    }catch(e){
        res.status(500).json(e)
    }
}

matchCtrl.stats = async (req,res) =>{

    const query = req.query.sort || "deadline" 
    const order = req.query.order || "true"
    console.log(order)
    console.log(query)
    try{
        const stats = await Match.aggregate([
            //getting the users u have joined the a match
            {
                $lookup : {
                    from : "users",
                    localField : "_id",
                    foreignField : "matches",
                    as : "users"
                }
            },
            //getting all the contests of that match
            {
                $lookup : { 
                    from : "contests",
                    localField : "_id",
                    foreignField : "matchid",
                    as : "contests"
                }
            },
            {
                $addFields : {
                    users : {$size : "$users"}, // users count
                    contest : {$size : "$contests"}, // contest count
                    revenue: {
                        $map: {
                            input: "$contests", //array
                            as: "contest", //each element
                            in: { $multiply: ["$$contest.entryFee", { $size: "$$contest.teams" }] }  //operation
                        }
                    },
                    profit : {
                        $map: {
                            input: "$contests",
                            as: "contest",
                            in: { $multiply: ["$$contest.entryFee", { $size: "$$contest.teams" } , 0.10 ] }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    team1: 1,
                    team2: 1,
                    users : 1,
                    contest : 1,
                    deadline: 1,
                    revenue : {
                        $sum : "$revenue"
                    },
                    profit : {
                        $sum : "$profit"
                    }
                }
            }
        ]).sort({[query] : order == "true" ? 1 : -1})
        res.status(200).json(stats)
    }catch(e){
        console.log(e)
    }
}
module.exports = matchCtrl       