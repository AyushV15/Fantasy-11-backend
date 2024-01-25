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
    role : {
        notEmpty : {
            errorMessage : "Country is required"
        }
    },
    pic : {
        notEmpty : {
            errorMessage : "pic is required"
        }
    }
}

module.exports =  playerValidation