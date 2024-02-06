const { isBoolean } = require("lodash")

const teamValidations = {
    team : {
        custom : {
            options : async (value) =>{
                const roles = ["bat","bowl","wk","all"]
                const team = value.every(ele => ele._id && ele.name.trim().length > 3 && roles.includes(ele.role) && Array.isArray(ele.score) && isBoolean(ele.C) && isBoolean(ele.VC) && ele.pic.trim().slice(-4) == ".png" && ele.nationality.trim().length > 1)
                if(team){
                    if(value.length !== 11){
                        throw new Error("please select 11 players")
                    }
                    if(value.filter(ele => ele.role == "wk").length < 1){
                        throw new Error("please select atleast one wicket keeper")
                    }
                    if(value.filter(ele => ele.role == "bat").length < 3){
                        throw new Error("please select atleast one wicket keeper")
                    }
                    if(value.filter(ele => ele.role == "all").length < 1){
                        throw new Error("please select atleast one wicket keeper")
                    }
                    if(value.filter(ele => ele.role == "bowl").length < 3){
                        throw new Error("please select atleast one wicket keeper")
                    }
                }else{
                    throw new Error("Error in creating team")
                }

                return true
            }
        }
    }
}

module.exports = {
    teamValidation : teamValidations
}