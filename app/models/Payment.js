const mongoose = require("mongoose")
const {Schema , model} = mongoose

const paymentSchema = new Schema({
    userId : Schema.Types.ObjectId,
    amount : Number,
    date : String,
    paymentType : String,
    transaction_Id : String
})

const Payment = model("Payment",paymentSchema)

module.exports = Payment