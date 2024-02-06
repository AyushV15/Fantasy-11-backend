const { isBoolean } = require("lodash")

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
    team1logo : {
        custom : {
            options : async (value,{req}) =>{
            
                const file = req.files.team1logo[0]
                console.log(file)
                if(!file){
                    throw new Error("Please upload an image")
                }
                const allowedType = ["image/png","image/jpg","image/jpeg"]
                if(!allowedType.includes(file.mimetype)){
                    throw new Error('Only PNG/JPG/JPEG images are allowed')
                }
                const maxSizeInBytes = 3 * 1024 * 1024; // 3MB
                if (file.size > maxSizeInBytes) {
                    throw new Error('Image size exceeds 3MB limit')
                }
            }
        }
    },
    team2logo : {
        custom : {
            options : async (value,{req}) =>{
                const file = req.files.team2logo[0]
                if(!file){
                    throw new Error("Please upload an image")
                }
                const allowedType = ["image/png","image/jpg","image/jpeg","image/webp"]
                if(!allowedType.includes(file.mimetype)){
                    throw new Error('Only PNG/JPG/JPEG/webp images are allowed')
                }
                const maxSizeInBytes = 3 * 1024 * 1024; // 3MB
                if (file.size > maxSizeInBytes) {
                    throw new Error('Image size exceeds 3MB limit')
                }
            }
        }
    },
    team1players : {
        custom : {
            options : (value,{req}) =>{
                try{
                const team1Players = JSON.parse(value);
                const team2Players = JSON.parse(req.body.team2players);

                if (team1Players.length < 11) {
                    throw new Error("Team 1 must contain 11 players");
                }

                for (const ele of team1Players) {
                    if (team2Players.some(e => e._id === ele._id)) {
                        throw new Error("Duplicate players found");
                    }
                }

                const roles = ["bat","bowl","wk","all"]
                const team = team1Players.every(ele => ele.hasOwnProperty("_id" && "name" && "role" && "score" && "C" && "VC" && "pic" && "nationality") &&  ele._id && ele.name.trim().length > 3 && roles.includes(ele.role) && Array.isArray(ele.score) && isBoolean(ele.C) && isBoolean(ele.VC) && ele.pic.trim().slice(-4) == ".png" && ele.nationality.trim().length > 1)
                if(!team){
                    throw new Error("Error in team 1 players")
                }

                return true;
        
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
                }

                const roles = ["bat","bowl","wk","all"]
                const team = JSON.parse(value).every(ele => ele.hasOwnProperty("_id" && "name" && "role" && "score" && "C" && "VC" && "pic" && "nationality") &&  ele._id && ele.name.trim().length > 3 && roles.includes(ele.role) && Array.isArray(ele.score) && isBoolean(ele.C) && isBoolean(ele.VC) && ele.pic.trim().slice(-4) == ".png" && ele.nationality.trim().length > 1)
                if(!team){
                    throw new Error("Error in team 2 players")
                }
                 
                else{
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

const updateScoreValidation = {
    team1players : {
        custom : {
            options : (value) =>{
                const roles = ["bat","bowl","wk","all"]
                const team = value.every(ele => ele.hasOwnProperty("_id" && "name" && "role" && "score" && "C" && "VC" && "pic" && "nationality") &&  ele._id && ele.name.trim().length > 3 && roles.includes(ele.role) && Array.isArray(ele.score) && isBoolean(ele.C) && isBoolean(ele.VC) && ele.pic.trim().slice(-4) == ".png" && ele.nationality.trim().length > 1)

                if(!team){
                    throw new Error("Error in team1players")
                }else{
                    return true
                }
            }
        }
    },
    team2players : {
        custom : {
            options : (value) =>{
                const roles = ["bat","bowl","wk","all"]
                const team = value.every(ele => ele.hasOwnProperty("_id" && "name" && "role" && "score" && "C" && "VC" && "pic" && "nationality") &&  ele._id && ele.name.trim().length > 3 && roles.includes(ele.role) && Array.isArray(ele.score) && isBoolean(ele.C) && isBoolean(ele.VC) && ele.pic.trim().slice(-4) == ".png" && ele.nationality.trim().length > 1)

                if(!team){
                    throw new Error("Error in team2players")
                }else{
                    return true
                }
            }
        }
    }
}

module.exports = {
    matchValidation : matchValidation,
    updateScoreValidation : updateScoreValidation
}