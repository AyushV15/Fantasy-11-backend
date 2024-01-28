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

const updateProfileValidation = {
    profilePic : {
        custom : {
            options : async (value, {req}) =>{
                if(req.file){
                    const allowedType = ["image/jpeg"]
                    console.log(req.file.mimetype)
                    if(!allowedType.includes(req.file.mimetype)){
                        throw new Error('Only JPEG images are allowed')
                    }
                    const maxSizeInBytes = 3 * 1024 * 1024; // 3MB
                    if (req.file.size > maxSizeInBytes) {
                    throw new Error('Image size exceeds 3MB limit')
                    }
                }else{
                    return true
                }
            }
        }
    },
    currentPassword : {
        custom : {
            options : async (value,{req}) =>{
                if(Object.keys(req.body).length > 0){
                    if(value.trim().length < 8){
                        console.log(value,"inside valid")
                        throw new Error("current Password should be between 8 to 128 characters")
                    }
                }else{
                    return true
                }
            }
        }
    },
    newPassword : {
        custom : {
            options : async (value,{req}) =>{
             
                if(Object.keys(req.body).length > 0){
                    if(value.trim().length < 8){
                        console.log("error")
                        throw new Error("new Password should be between 8 to 128 characters")
                    }
                }else{
                    return true
                }
            }
        }
    }
}

module.exports = {
    registerSchema : userValidationSchema,
    loginSchema : userloginValidation,
    updateProfile : updateProfileValidation
}