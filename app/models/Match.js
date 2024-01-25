
const mongoose = require('mongoose')

const {Schema,model} = mongoose

const matchSchema = new Schema({
    team1: String,
    team1logo: String,
    team1players : [],
    team2 : String,
    team2logo: String,
    team2players: [],
    deadline: Date,
    tournament: String,
    isCompleted : {
        type : Boolean,
        default : false
    },
    message : String
},{timestamps : true})
 
const Match = model("Match",matchSchema)
 
module.exports = Match

        