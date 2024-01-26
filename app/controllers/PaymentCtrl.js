const paymentCtrl = {}
const Wallet = require('../models/Wallet')
const Payment = require('../models/Payment')
const stripe = require('stripe')
('sk_test_51OUVJySJWZzpdKdVBdU9whwMXkZuvOLanbivOpzlFVF158hISAl2bsAmGaPbhdynPynsW7lzlE8zeSbmEbnkPIXA007HKkoPXX')


paymentCtrl.checkout = async (req,res) =>{
    const {amount,name,id} =  req.body

    console.log(amount)

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
            success_url : `http://localhost:3000/success`,
            cancel_url : "http://localhost:3000/failure",
            customer : customer.id
        })
        res.json({id : session.id , url : session.url })

        if(session.id){
            const payment = new Payment({
                userId : id,
                amount : amount,
                date : new Date(),
                paymentType : session.payment_method_types[0],
                transaction_Id : session.id
            })
            payment.save()
        }

    }catch(e){
        console.log(e)
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
        res.json(e)
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

// paymentCtrl.webhook = async (req,res)=>{
//     console.log("webhook")
//     const endpoint = "whsec_19e79624790d1b932cb27072a517d107068fde707c04598b4589705b9d7c5baa"
//     const sig = req.headers['stripe-signature']
//     let event 
//     try{
//         event = stripe.webhooks.constructEvent(req.body,sig,endpoint)
//         console.log('webhook verified')
//     }catch(e){
//         console.log(`Webhook Error : ${e.message}`)
//         res.status(400).send(`Webhook Error : ${e.message}`)
//         return
//     }

//     //handle the event
//     if(event.type == "checkout.session.completed"){
//         console.log(event.data.object)

//         const {customer_details,amount_total,payment_method_types,payment_intent} = event.data.object

//         const paymentBody = {
//             userId : customer_details.name,
//             amount : amount_total / 100,
//             date : new Date(),
//             paymentType : payment_method_types[0],
//             transaction_Id : payment_intent
//         }

//         try
//         {
//             await Wallet.findOneAndUpdate({userId : customer_details.name},{$inc : {amount : amount_total/100}})  
//             const payment = new Payment(paymentBody)
//             console.log(payment)     
//             await payment.save()
//             res.status(201).json(payment)
//         }catch(e){
//             res.status(500).json(e)
//         }
//     }
//     res.send().end()
// }


module.exports = paymentCtrl 