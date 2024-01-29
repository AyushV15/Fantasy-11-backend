
const name = {
    notEmpty : {
        errorMessage : "Name is Required"
    },
    isLength : {
        errorMessage : "name should be alteast 3 characters"
    }
}

const role = {
    notEmpty : {
        errorMessage : "Role is required"
    }
}

const nationality = {
    notEmpty : {
        errorMessage : "Country is required"
    }
}

const pic = {
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

const updatePic = {
    custom : {
        options : async (value,{req}) =>{
            if(req.file){
                const allowedType = ["image/avif"]
                if(!allowedType.includes(req.file.mimetype)){
                    throw new Error('Only AVIF images are allowed')
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
}


const playerValidation = {
    name : name ,
    role : role ,
    nationality : nationality ,
    pic : pic
}

const updatePlayerValidation = {
    name : name ,
    role : role ,
    nationality : nationality ,
    pic : updatePic
}

module.exports =  {
    playerValidation : playerValidation,
    updatePlayerValidation : updatePlayerValidation
}