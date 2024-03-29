const { validationResult } = require("express-validator")
const Player = require("../models/Players")
const _ = require("lodash")

playerCtrl = {}

//creating a player (admin)
playerCtrl.createPlayer = async (req,res) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    
    const body = _.pick(req.body,["name","role","nationality","pic"])
    try{
        const player = new Player(body)
        player.pic = req.file.originalname
        await player.save()
        res.status(201).json(player)
    }catch(e){
        res.status(500).json(e)
    }   
}   

//listing player (admin)
playerCtrl.listPlayers = async (req,res) =>{
    try{
        const Players = await Player.find()
        res.status(200).json(Players)
    }catch(e){
        res.status(500).json(e)
    }
}

//deleting player (admin)
playerCtrl.deletePlayer = async (req,res) =>{
    const id = req.params.id
    try{
        const player = await Player.findByIdAndDelete(id)
        res.status(200).json(player)
    }catch(e){
        res.status(500).json(e)
        console.log(e)
    }
}

//updating player (admin)
playerCtrl.editPlayer = async (req,res) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }

    const id = req.params.id
    const body = req.body
    if(req.file){
        body.pic = req.file.originalname
    }
    try{
        const player = await Player.findByIdAndUpdate(id,body,{new : true})
        res.status(200).json(player)
    }catch(e){
        res.status(500).json(e)
    }
}

module.exports = playerCtrl