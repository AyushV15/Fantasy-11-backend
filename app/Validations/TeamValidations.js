const teamValidations = {
    team : {
        custom : {
            options : async (value) =>{
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
                return true
            }
        }
    }
}

module.exports = {
    teamValidation : teamValidations
}