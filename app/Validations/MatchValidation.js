const matchValidation = {
    team1 : {
        notEmpty : {
            errorMessage : "team1 name is required"
        }
    },
    team2 : {
        notEmpty : {
            errorMessage : "team2 name is required"
        }
    },
    team1players : {
        custom : {
            options : (value) =>{
                if(JSON.parse(value).length < 11){
                    throw new Error("team 1 must contain 11 players ")
                }else{
                    return true
                }
            }
        },
        custom : {
            options : (value,{req}) =>{
                try{
                    JSON.parse(value).forEach(ele =>{
                        if(JSON.parse(req.body.team2players).some(e => e._id == ele._id)){
                            throw new Error("duplicate players found")
                        }
                    })
                    return true
                }catch(e){
                    console.log(e)
                }
            }
        }
    },
    team2players : {
        custom : {
            options : (value) =>{
                if(JSON.parse(value).length < 11){
                    throw new Error("team 2 must contain 11 players ")
                }else{
                    return true
                }
            }
        },
    },
    tournament : {
        notEmpty : {
            errorMessage : "tournament name is required"
        }
    },
    deadline : {
        notEmpty : {
            errorMessage : "date is required"
        },
        custom : {
            options : (value) =>{
                if(new Date(value) < new Date()){
                    throw new Error("deadline should be greater than now")
                }else{
                    return true
                }
            }
        }
    }
} 

module.exports = matchValidation