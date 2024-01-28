const playerValidation = {
    name : {
        notEmpty : {
            errorMessage : "Name is Required"
        },
        isLength : {
            errorMessage : "name should be alteast 3 characters"
        }
    },
    role : {
        notEmpty : {
            errorMessage : "Role is required"
        }
    },
    nationality : {
        notEmpty : {
            errorMessage : "Country is required"
        }
    },
    pic : {
        custom : {
            options : async (value,{req}) =>{
                if(!req.file){
                    throw new Error("Please upload an image")
                }
                const allowedType = ["image/avif"]
                if(!allowedType.includes(req.file.mimetype)){
                    throw new Error('Only AVIF images are allowed')
                }
                const maxSizeInBytes = 3 * 1024 * 1024; // 3MB
                if (req.file.size > maxSizeInBytes) {
                    throw new Error('Image size exceeds 3MB limit')
                }
            }
        }
    }
}

module.exports =  playerValidation