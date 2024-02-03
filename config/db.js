const mongoose = require("mongoose")

// const configdb = async () =>{
//     try{
//         mongoose.connect("mongodb://127.0.0.1:27017/practice")
//         console.log("database is connected successfully")
//     }catch(e){
//         console.log("error connecting database")
//     }
// }

const configdb = async () =>{
    try{
        mongoose.connect(process.env.MONGO_DB)
        console.log("database is connected successfully")
    }catch(e){
        console.log("error connecting database") 
    } 
} 
 
module.exports = configdb

