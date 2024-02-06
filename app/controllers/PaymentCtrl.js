const paymentCtrl = {}
const Wallet = require('../models/Wallet')
const Payment = require('../models/Payment')
const stripe = require('stripe')
(process.env.STRIPE_KEY)

// payment checkout route
paymentCtrl.checkout = async (req,res) =>{
    const {amount,name,id} =  req.body

    if(amount > 1000){
        res.status(400).json({message : "amount must be less than or equal to 1000"})
    }

    //adding line items (in this case the amount user has enetered)
    const lineItems = [{
        price_data : {
            currency : "inr",
            product_data : {
                name : "Add Money"
            },
            unit_amount : amount * 100
        },
        quantity : 1
    }]

    const customer = await stripe.customers.create({
        name: name,
        address: {
            line1: 'India',
            postal_code: '403001',
            city: 'Miramar',
            state: 'GA',
            country: 'US', 
        },
    })
 
    try{
        const session = await stripe.checkout.sessions.create({
            payment_method_types : ['card'],
            line_items : lineItems,
            mode : "payment",
            success_url : process.env.SUCCESS_URL,
            cancel_url : process.env.FAILURE_URL,
            customer : customer.id
        })
        //sending session id and url to frontend
        res.json({id : session.id , url : session.url })

        //creating payment model and keeping status as pending
        if(session.id){
            const payment = new Payment({
                userId : id,
                amount : amount,
                date : new Date(),
                paymentType : session.payment_method_types[0],
                transaction_Id : session.id
            })
            await payment.save()
        }

    }catch(e){
        res.status(500).json(e)
    }
}

paymentCtrl.updatePayment = async (req,res) =>{
    const {id} = req.body
    try{
        const payment = await Payment.findOneAndUpdate({transaction_Id : id},{status : "successfull"},{new : true})
        if(payment.status == "successfull"){
            await Wallet.findOneAndUpdate({userId : payment.userId},{$inc : {amount : payment.amount}})
        }
        res.status(200).json("payment success")
    }catch(e){
        res.status(500).json(e)
    }
}

paymentCtrl.deletePayment = async (req,res) =>{
    
    const id = req.params.id
    console.log(id)
    try{
        await Payment.findOneAndDelete({transaction_Id : id})
        res.status(200).json("payment failure")
    }catch(e){
        res.json(e)
    }
}




module.exports = paymentCtrl 