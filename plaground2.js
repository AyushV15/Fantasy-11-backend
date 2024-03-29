const teams = [
    { name: "team1", score: 90 },
    { name: "team2", score: 90 },
    { name: "team3", score: 70 }

];

const prizeBreakup = [
    { rank: 1, prize: 90 },
    { rank: 2, prize: 40 }
];

const duplicate = () => {
    const obj = {};
    const duplicates = [];

    teams.forEach((team) => {
        const score = team.score;
        if (!obj[score]) {
            obj[score] = [team];
        } else {
            obj[score].push(team);
        }
    });
    
    for (const key in obj) {
        duplicates.push(obj[key]);
    }

    return duplicates.sort((a, b) => b[0].score - a[0].score);
};

const duplicatesArray = duplicate();

if (duplicatesArray.every(ele => ele.length === 1)) {
    duplicatesArray.forEach((ele, i) => {
        prizeBreakup.forEach(e => {
            if (e.rank === i + 1) {
                ele[0].prize = e.prize;
            }
        });
    });
} else {
    let previousLength = 0; //2
    duplicatesArray.forEach((ele,) => {
        const length = ele.length; //2
        let prize = 0; //0,90,130
        for (let i = 0; i < length; i++) {
            prize += prizeBreakup[i + previousLength]?.prize || 0;
        }
        const averagePrize = prize / length; 65

        ele.forEach((team) => {
            team.prize = averagePrize;
        });

        previousLength += length;
    });
}

console.log(duplicatesArray)