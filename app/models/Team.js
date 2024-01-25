const mongoose = require('mongoose')
const {Schema,model} = mongoose

const matchSchema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    matchId : Schema.Types.ObjectId,
    team : []
},{timestamps : true})

const Team = model("Team",matchSchema)

module.exports = Team