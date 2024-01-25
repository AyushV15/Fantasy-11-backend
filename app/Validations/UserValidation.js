const User = require("../models/User")

const userValidationSchema = {
    username : {
        notEmpty : {
            errorMessage : "required"
        },
        isLength : {
            errorMessage : "min 3 characters",
            options : {min : 3}
        },
        custom : {
            options : async (value) =>{
                const user = await User.findOne({username : value})
                if(user){
                    throw new Error("username aldready present")
                }else{
                    return true
                }
            }
        }
    },
    email : {
        notEmpty : {
            errorMessage : "required"
        },
        isEmail : {
            errorMessage : "enter valid email"
        },
        custom : {
            options : async (value) =>{
                const user = await User.findOne({email : value})
                if(user){
                    throw new Error("email aldready present")
                }else{
                    return true
                }
            }
        }
    },
    mobile : {
        notEmpty : {
            errorMessage : "required"
        },
        isLength : {
            errorMessage : "mobile should be 10 digit",
            options : {min : 10, max : 10}
        },
        custom : {
            options : async (value) =>{
                const user = await User.findOne({mobile : value})
                if(user){
                    throw new Error('mobile number aldready registered')
                }else{
                    return true
                }
            }
        }
    },
    password : {
        notEmpty : {
            errorMessage : "required"
        },
        isLength : {
            errorMessage : "password should be between 8 to 128 characters",
            options : {min : 8 ,max : 128}
        }
    }
}

const userloginValidation = {
    email : {
        notEmpty : {
            errorMessage : "required"
        },
        isEmail : {
            errorMessage : "enter valid email"
        }
    },
    password : {
        notEmpty : {
            errorMessage : "required"
        },
        isLength : {
            errorMessage : "password should be between 8 to 128 characters",
            options : {min : 8 ,max : 128}
        }
    }
}

const userloginOTPValidation = {
    email : {
        notEmpty : {
            errorMessage : "required"
        },
        isEmail : {
            errorMessage : "enter valid email"
        }
    },
    OTP : {
        notEmpty : {
            errorMessage : "required"
        }
    }
}

module.exports = {
    registerSchema : userValidationSchema,
    loginSchema : userloginValidation,
    loginOTPschema : userloginOTPValidation
}