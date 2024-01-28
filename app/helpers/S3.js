const multers3 = require('multer-s3')
const {S3Client} = require('@aws-sdk/client-s3')
const multer = require("multer")


const client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY ,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
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
        }
    })
})

module.exports = {
    userUpload : userUpload,
    client : client,
    matchUpload : matchUpload,
    playerUpload : playerUpload
}
