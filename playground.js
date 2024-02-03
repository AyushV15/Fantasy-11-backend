const teams = [
    { name: "team1", score: 72 },
    { name: "team2", score: 72 },
    { name: "team3", score: 70 },
    { name: "team4", score: 70 },
    { name: "team5", score: 62 }
];

const prizeBreakup = [
    {rank : 1 , prize : 100},
    {rank : 2 , prize : 50},
    {rank : 3 , prize : 25}
]

const duplicate = () =>{
    const obj = {}
    const duplicates = []

    teams.forEach((team) => {
        const score = team.score;
        if (!obj[score]) {
            obj[score] = [team];
        } else {
            obj[score].push(team);
        }
    })

    for(const key in obj){
        duplicates.push(obj[key])
    }

    return duplicates.sort((a,b) => b[0].score - a[0].score )
}

if(duplicate().every(ele => ele.length === 1)){
    duplicate().forEach((ele,i) =>{
        prizeBreakup.forEach(e =>{
            if(e.rank === i + 1){
                ele[0].prize = e.prize
            }
        })
    })
}
else{
    const totalPrize = prizeBreakup.reduce((acc,cv)=> acc+= cv.prize,0)      
    let previouslength = 0
    duplicate().forEach((ele,index)=>{ 
        const length = ele.length 
        let prize = 0 
        for(let i = index ; i < index + length ; i++ ){  
            console.log(prizeBreakup[i]?.prize , "prize")
            prize += prizeBreakup[i + previouslength]?.prize  
        }
        ele.forEach(team => {
            team.prize = prize / length
        })
        console.log(prize , index)
        previouslength += length - 1

    })
}


console.log(duplicate())



 

 