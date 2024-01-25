const jwt = require("jsonwebtoken")
const User = require("./app/models/User")

const authenticateUser = async (req,res,next) =>{
    const token = req.headers["authorization"]
    try{
        if(!token){
            return res.status(400).json({errors : "jwt token missing"})
        }
        const tokendata = await jwt.verify(token,process.env.JWT)
        req.user = {id : tokendata.id ,role : tokendata.role}
        const user = await User.findById(req.user.id)
        if(user.isActive){
            next()
        }else{
            res.status(400).json("ur account has been blocked , please contact the admin")
        }
    }catch(e){
        res.status(500).json(e)
    }    
}

const authoriseUser = (roles) =>{
    return (req,res,next) =>{
        if(roles.includes(req.user.role)){
            next()
        }
        else{
            res.status(401).json({message : "your are not authorised"})
        }
    }
    
}

module.exports = {
    authenticateUser,
    authoriseUser
}
