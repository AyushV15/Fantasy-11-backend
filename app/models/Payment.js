const mongoose = require("mongoose")
const {Schema , model} = mongoose

const paymentSchema = new Schema({
    userId : Schema.Types.ObjectId,
    amount : Number,
    date : String,
    status : {
        type : String,
        default : "pending",
        enum : ["pending","successfull"]
    },
    paymentType : String,
    transaction_Id : String
})

const Payment = model("Payment",paymentSchema)

module.exports = Payment