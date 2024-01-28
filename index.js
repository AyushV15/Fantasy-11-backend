require("dotenv").config()
const express = require("express")
const configdb = require("./config/db")
const { checkSchema } = require("express-validator")
const { registerSchema, loginSchema,updateProfile} = require("./app/Validations/UserValidation")
const UserCtrl = require("./app/controllers/UserCtlr")
const port = process.env.PORT
const app = express()
const cors = require("cors")
const {authenticateUser, authoriseUser} = require("./auth")
const matchCtrl = require("./app/controllers/MatchCtrl")
const playerCtrl = require("./app/controllers/PlayerCtrl")
const teamCtrl = require("./app/controllers/TeamCtrl")
const path = require("path")
const contestCtrl = require("./app/controllers/ContestCtrl") 
const { joinContestSchema ,createContestSchema } = require("./app/Validations/ContestValidation")
const http = require('http');
const {Server} = require('socket.io')
const paymentCtrl = require("./app/controllers/PaymentCtrl")
const notificationCtrl = require("./app/controllers/NotificationCtrl")
const matchValidation = require("./app/Validations/MatchValidation")
const {userUpload ,matchUpload,playerUpload} = require("./app/helpers/S3")
const playerValidation = require("./app/Validations/PlayerValidation")

const server = http.createServer(app)
const io = new Server(server,{
    cors : {origin : "http://localhost:3000",methods : ["GET","POST"]}
})

require("./config/socketConfig")(io)

const multipleuploads = matchUpload.fields([{name : "team1logo",maxCount : 1},{name : "team2logo",maxCount : 1}])



app.use(cors())   
configdb() 

server.listen(port ,()=>{
    console.log('server is running on ', port)
})

app.use(express.json())
 
//admin routes
app.get("/api/users",authenticateUser,authoriseUser(["admin"]),UserCtrl.listUsers)
app.put("/api/users",authenticateUser,authoriseUser(["admin"]),UserCtrl.controlUser)
app.get("/api/matches",authenticateUser,authoriseUser(["admin"]),matchCtrl.listMatches) 


//user routes
app.post("/api/users/register",checkSchema(registerSchema),UserCtrl.register)
app.post("/api/users/login",checkSchema(loginSchema),UserCtrl.login)
app.get("/api/users/dashboard",authenticateUser,UserCtrl.account)
app.put("/api/users/update-profile",authenticateUser,userUpload.single('profilePic'),checkSchema(updateProfile),UserCtrl.updateProfile)


//match routes
app.post("/api/create-match",authenticateUser,authoriseUser(["admin"]),multipleuploads,checkSchema(matchValidation),matchCtrl.createMatch)
app.get("/api/upcoming-matches",authenticateUser,matchCtrl.upcomingMatches)
app.get("/api/match/:id",authenticateUser,matchCtrl.oneMatch)   
app.put('/api/match/:matchid/score-updates',authenticateUser,authoriseUser(['admin']),matchCtrl.scoreUpdates)
app.delete("/api/match/:matchid/cancel-match",authenticateUser,matchCtrl.cancelMatch)
app.put("/api/matches/:matchid",authenticateUser,authoriseUser(['admin']),matchCtrl.extendDeadline)
app.get('/api/stats',authenticateUser,authoriseUser(["admin"]),matchCtrl.stats)


//team routes
app.post("/api/match/:matchid/create-team",authenticateUser,teamCtrl.createTeam)
app.get("/api/match/:matchid/team",authenticateUser,teamCtrl.getTeam)
app.put("/api/match/:matchid/edit-team",authenticateUser,teamCtrl.updateTeam)  


//players routes
app.get("/api/players",authenticateUser,authoriseUser(["admin"]),playerCtrl.listPlayers)
app.post("/api/players",authenticateUser,playerUpload.single("pic"),checkSchema(playerValidation),playerCtrl.createPlayer)
app.delete("/api/players/:id",authenticateUser,authoriseUser(["admin"]),playerCtrl.deletePlayer)
app.put("/api/players/:id",authenticateUser,playerUpload.single("pic"),authoriseUser(["admin"]),checkSchema(playerValidation),playerCtrl.editPlayer)


//contest-routes
app.get("/api/match/:matchid/contest",authenticateUser,contestCtrl.listContest)
app.post("/api/match/:matchid/create-contest",checkSchema(createContestSchema),contestCtrl.createContest)
app.put("/api/contest/:contestid",authenticateUser,checkSchema(joinContestSchema),contestCtrl.joinContest)
app.get("/api/contest/:matchid",authenticateUser,contestCtrl.userContest)
app.delete("/api/match/:matchid/cancel-contests",authenticateUser,authoriseUser(["admin"]),contestCtrl.cancelContests)


//genreate results
app.put("/api/match/:matchid/generate-results",matchCtrl.generateResults)
app.put("/api/match/:matchid/declare-results",matchCtrl.declareResults)


//wallet routes
app.get("/api/users/wallet",authenticateUser,UserCtrl.wallet)


//payment routes
app.post('/api/checkout',authenticateUser,paymentCtrl.checkout)
app.put("/api/update-payment",authenticateUser,paymentCtrl.updatePayment)
app.delete("/api/delete-payment/:id",authenticateUser,paymentCtrl.deletePayment)


//notification routes
app.get('/api/users/notifications',authenticateUser,notificationCtrl.list)
app.delete('/api/users/notifications',authenticateUser,notificationCtrl.clear)


//forgot-password
app.get("/api/forgot-password",UserCtrl.forgotPassword)
app.post("/api/reset-password",UserCtrl.resetPassword)





 





