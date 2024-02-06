const _ = require("lodash")
const Team = require("../models/Team")
const User = require("../models/User")
const { validationResult } = require("express-validator")
const Match = require("../models/Match")

const teamCtrl = {}

teamCtrl.createTeam = async (req,res) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()})
    }
    const body = _.pick(req.body,["team"])
    const id = req.params.matchid
    
    try{
        const match = await Match.findById(id)
        if(new Date(match.deadline) < new Date()){
            return res.status(400).json("match deadline has passed")
        }
        const team = new Team(body)
        team.matchId = id
        team.userId =  req.user.id
        await team.save()
        await User.findByIdAndUpdate(req.user.id,{$push : {matches : id}})
        res.status(201).json(team)
    }catch(e){
        res.status(500).json(e)
        console.log(e)
    }   
}   

teamCtrl.getTeam = async (req,res) =>{
    const matchId = req.params.matchid
    try{
        const team = await Team.findOne({userId : req.user.id , matchId : matchId})
        res.status(200).json(team)
    }catch(e){
       
        res.status(500).json(e)
    }
}

teamCtrl.updateTeam = async (req,res) =>{
    const matchid = req.params.matchid
    const match = await Match.findById(matchid)
    if(new Date(match.deadline) < new Date()){
        return res.status(400).json("match deadline has passed")
    }
    try{
        const team = await Team.findOneAndUpdate({userId : req.user.id , matchId : matchid},req.body)
        res.status(200).json(team)
    }catch(e){
        res.status(500).json(e)
    }
}

module.exports = teamCtrl 
