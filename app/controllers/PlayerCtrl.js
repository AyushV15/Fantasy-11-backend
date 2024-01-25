const Player = require("../models/Players")
const _ = require("lodash")

playerCtrl = {}

playerCtrl.createPlayer = async (req,res) =>{
    const body = _.pick(req.body,["name","role","nationality"])
    try{
        const player = new Player(body)
        player.pic = req.file.originalname
        await player.save()
        res.status(201).json(player)
    }catch(e){
        res.status(500).json(e)
    }   
}   

playerCtrl.listPlayers = async (req,res) =>{
    try{
        const Players = await Player.find()
        res.status(200).json(Players)
    }catch(e){
        res.status(500).json(e)
    }
}

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

module.exports = playerCtrl