const _ = require("lodash")
const Team = require("../models/Team")
const User = require("../models/User")

const teamCtrl = {}

teamCtrl.createTeam = async (req,res) =>{
    const body = _.pick(req.body,["team"])
    const id = req.params.matchid
    try{
        const team = new Team(body)
        team.matchId = id
        team.userId =  req.user.id
        await team.save()
        await User.findByIdAndUpdate(req.user.id,{$push : {matches : id}})
        res.status(201).json(team)
    }catch(e){
        res.status(500).json(e)
    }   
}   

teamCtrl.getTeam = async (req,res) =>{
    const matchId = req.params.matchid
    try{
        const team = await Team.findOne({userId : req.user.id , matchId : matchId})
        res.status(200).json(team)
    }catch(e){
        console.log(e)
        res.status(500).json(e)
    }
}

teamCtrl.updateTeam = async (req,res) =>{
    const matchid = req.params.matchid
    try{
        const team = await Team.findOneAndUpdate({userId : req.user.id , matchId : matchid},req.body)
        res.status(200).json(team)
        console.log(team)
    }catch(e){
        res.status(500).json(e)
    }
}

module.exports = teamCtrl 
