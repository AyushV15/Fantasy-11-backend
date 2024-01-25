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