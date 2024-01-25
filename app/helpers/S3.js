const multers3 = require('multer-s3')
const {S3Client} = require('@aws-sdk/client-s3')
const multer = require("multer")


const client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: "AKIA2UC2747F5FDPGEWT",
        secretAccessKey: "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"
    }
})


const userUpload = multer({
    storage : multers3({
        s3 : client, 
        bucket : "fantasy11",
        acl : "public-read",
        contentType : multers3.AUTO_CONTENT_TYPE,
        key : function (req,file,cb){
            cb(null, "users/" + file.originalname)
            console.log(file)
        }
    })
})


const matchUpload = multer({
    storage : multers3({
        s3 : client, 
        bucket : "fantasy11",
        acl : "public-read",
        contentType : multers3.AUTO_CONTENT_TYPE,
        key : function (req,file,cb){
            cb(null, "matches/" + file.originalname)
            console.log(file)
        }
    })
})

const playerUpload = multer({
    storage : multers3({
        s3 : client, 
        bucket : "fantasy11",
        acl : "public-read",
        contentType : multers3.AUTO_CONTENT_TYPE,
        key : function (req,file,cb){
            cb(null, "players/" + file.originalname)
            console.log(file)
        }
    })
})

module.exports = {
    userUpload : userUpload,
    client : client,
    matchUpload : matchUpload,
    playerUpload : playerUpload
}
