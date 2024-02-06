const mongoose = require('mongoose')
const {Schema,model} = mongoose

const teamSchema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    matchId : Schema.Types.ObjectId,
    team : [{
        name : String,
        role : {
            type : String,
            enum : ["bat","bowl","wk","all"]
        },
        C : Boolean,
        VC : Boolean,
        nationality : String,
        pic : String,
        score : [],
        team : String
    }],
    totalPoints : {
        type : Number,
        default : 0
    }
},{timestamps : true})

const Team = model("Team",teamSchema)

module.exports = Team