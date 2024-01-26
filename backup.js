const storage = multer.diskStorage({
    destination : (req,file,cb) =>{
        cb(null,"uploads/images")
    },
    filename : (req,file,cb)=>{
        cb(null, Date.now() + file.originalname)
    }
}) 

const upload = multer({storage : storage})


// io.on('connection', (socket) => {
//     console.log('A user connected');

//     socket.on('joinMatchRoom', (matchId) => {
//         socket.join(matchId);
//         console.log(`User joined room: ${matchId}`);
//     });

//     socket.on('disconnect', () => {
//         console.log('A user disconnected');
//     });
// })


const staticpath = path.join(__dirname , "/uploads")
app.use("/uploads",express.static(staticpath))



// matchCtrl.scoreUpdates = async (req,res) =>{
//     const id = req.params.matchid
//     try{
//         const match = await Match.findByIdAndUpdate(id,req.body,{new : true}) 
//         const players = [...match.team1players,...match.team2players]
//         const Teams = await Team.find({matchId : id})
//         Teams.map(async(ele) =>{
//             const team = ele.team.map(e =>{
//                 // return players.find(p => p._id == e._id)
//                 return players.find(p =>{
//                     if(p._id == e._id){
//                         return {...e , score : p.score}
//                     }else{
//                         return {...e}
//                     }
//                 })
//             })
            
//             await Team.findByIdAndUpdate(ele._id,{team : team},{new :true})
//         })
// //sockets
//         const message = "hi"
//         io.on("connection", (socket) => {
//             console.log(`a user connected ${socket.id}`);
//             socket.emit('update',message)
//           });
// //sockets
//         res.status(200).json(match)
//     }catch(e){
//         res.status(500).json(e)
//         console.log(e)
//     }

// }



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