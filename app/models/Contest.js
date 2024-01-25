const mongoose = require('mongoose')
const {Schema,model} = mongoose

const contestSchema = new Schema({
    matchid : {
        type : Schema.Types.ObjectId,
        ref : "Match"
    },
    entryFee : Number,
    totalPrize : Number,
    winners : Number,
    prizeBreakup : [
        {
           rank : Number,
           prize : Number
        }
    ],
    teams : [{
        type : Schema.Types.ObjectId,
        ref : "Team"
    }],
    slots : Number
})

const Contest = model("Contest",contestSchema)

module.exports = Contest

