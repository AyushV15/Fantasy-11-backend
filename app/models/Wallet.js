const mongoose = require("mongoose")
const {Schema , model} = mongoose

const walletSchema = new Schema({
    userId : Schema.Types.ObjectId,
    amount : {
        type : Number,
        default : 0
    }
})

const Wallet = model("Wallet",walletSchema)

module.exports = Wallet