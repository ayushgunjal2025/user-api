const {MongoClient}=require('mongodb');

let dbConnection;

const uri='mongodb+srv://ayushgunjal2025:ayushgunjal@cluster0.tyxfs.mongodb.net/Login?retryWrites=true&w=majority';

module.exports={
    connectToDb:(callback)=>{
        MongoClient.connect(uri)
        .then((client)=>{
            dbConnection=client.db();
            return callback();
        })
        .catch((err)=>{
            console.log(err);
            return callback();
        })
    },
    getDb:()=>dbConnection
}