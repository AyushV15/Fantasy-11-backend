const Contest = require("../models/Contest")


const joinContestvalidation = {
    teams : {
        custom : {
            options : async (value,{req}) =>{
                const contest = await Contest.findOne({ _id : req.params.contestid})
                if(contest.slots == contest.teams.length){
                    throw new Error("contest full")
                }
                else{
                    return true
                }
            }
        }
    }  
}

const createContestValidations = {
    matchid : {
        notEmpty : {
            errorMessage : "matchid is required"
        },
        isMongoId : {
            errorMessage : "should be a valid mongo id"
        }
    },
    entryFee : {
        isNumeric : {
            errorMessage : "entryFee is should be a number"
        }
    },
    totalPrize : {
        isNumeric : {
            errorMessage : "totalPrize is should be a number"
        }
    },
    winners : {
        isNumeric : {
            errorMessage : "winners is should be a number"
        }
    },
    slots : {
        isNumeric : {
            errorMessage : "slots should be a number"
        }
    },
    prizeBreakup : {
        custom : {
            options: (value) => {
                try {
                    value.forEach(ele => {
                        if(typeof ele.rank !== "number" || typeof ele.prize !== "number") {
                            throw new Error("prizeBreakup is required and should be numbers");
                        }
                    });
                    return true;
                } catch (error) {
                    throw error;
                }
            }
        }
    }
}

module.exports = { 
    joinContestSchema : joinContestvalidation,
    createContestSchema : createContestValidations
}