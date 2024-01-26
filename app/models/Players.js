const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')
const {Schema,model} = mongoose

const playerSchema = new Schema({
    name : String,
    pic : String,
    role : {
        type : String,
        enum : ["wk","bat","all","bowl"]
    },
    nationality : String,
    score : {
        type :Number,
        default : 0
    },
    C : {
        type :Boolean,
        default : false
    },
    VC : {
        type :Boolean,
        default : false
    }
},{timestamps : true})

const Player = model("Player",playerSchema)
 
module.exports = Player