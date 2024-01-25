const mongoose = require("mongoose")
const {Schema , model} = mongoose

const notificationSchema = new Schema({
    userId : Schema.Types.ObjectId,
    text : String,
    matchId : {
        type : Schema.Types.ObjectId,
        ref : "Match"
    },
    date : Date
})

const Notification = model("Notification",notificationSchema)

module.exports = Notification