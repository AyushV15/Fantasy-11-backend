const { default: mongoose } = require("mongoose");

const {Schema,model} = mongoose
const UserRegistrationSchema = new Schema ({
    username : String,
    email : String,
    mobile : String,
    password : String,
    profilePic : String,
    role : {
        type : String,
        default : "user"
    },
    isActive : {
        type : Boolean,
        default : true
    },
    matches : [
        {
            type : Schema.Types.ObjectId,
            ref : "Match"
        }
    ]
    // teams : [{
    //     type : Schema.Types.ObjectId,
    //     ref : "Team"
    // }],
    // contests : [{
    //     type : Schema.Types.ObjectId,
    //     ref : "Contest"
    // }]
})
  
const User = model("User",UserRegistrationSchema)

module.exports = User


