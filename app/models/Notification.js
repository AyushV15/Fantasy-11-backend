const mongoose = require("mongoose")
const {Schema , model} = mongoose

const notificationSchema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        required : true
    },
    text : {
        type : String ,
        required : true
    },
    matchId : {
        type : Schema.Types.ObjectId,
        ref : "Match",
        required : true
    },
    date : {
        type : Date,
        required : true
    }
})

const Notification = model("Notification",notificationSchema)

module.exports = Notification