const { isBoolean } = require("lodash")

const arr = [
    {
        "_id": "6585a79db4a2a0f61cf1aa04",
        "name": "Virat Kohli",
        "role": "bat",
        "score": [],
        "C": false,
        "VC": false,
        "pic": ".png",
        "nationality": "IND",
      }
]

const roles = ["bat","bowl","all","wk"]
console.log(arr.every(ele => ele._id && ele.name.trim().length > 3 && roles.includes(ele.role) && Array.isArray(ele.score) && isBoolean(ele.C) && isBoolean(ele.VC) && ele.pic.trim().slice(-4) == ".png" && ele.nationality.trim().length > 1))


console.log("Virat Kohli.png".slice(-3))