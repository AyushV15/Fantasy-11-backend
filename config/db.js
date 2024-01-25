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
        mongoose.connect("mongodb+srv://Ayush56:ayush56@fantasy11.o1xyblo.mongodb.net/Fantasy11?retryWrites=true&w=majority")
        console.log("database is connected successfully")
    }catch(e){
        console.log("error connecting database") 
    } 
} 
 
module.exports = configdb

