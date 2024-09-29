const express = require('express');
const cors = require('cors');
const app = express();  // Moved above app.use(cors());

app.use(cors());  // Enable CORS

app.use(express.json());

// Continue with your database connection and routes

const {connectToDb,getDb}=require('./db');

let db;

connectToDb((err)=>{
    if(!err){
        app.listen(3001,()=>{
            console.log('connected to database');
        })
        db=getDb();
    }
})


//app.get request
app.get('/users',(req,res)=>{
    const page = req.query.p || 0;
    const userPerPage=10;
    let users=[];
    db.collection('users')
    .find()
    .sort({id:1})
    .skip(page*userPerPage)
    .limit(userPerPage)
    .forEach((user)=>users.push(user))
    .then(()=>{
        res.status(200).json(users);
    })
    .catch(()=>{
        res.status(500).json({message:'Error fetching users'});
    })
})

//app.get using id
app.get('/users/:id',(req,res)=>{
    const userID=parseInt(req.params.id);
    if(!isNaN(userID)){
        db.collection('users')
        .findOne({id:userID})
        .then((user)=>{
            if(user){
                res.status(200).json(user);
            }
            else{
                res.status(400).json({msg:'user not found'});
            }
        })
        .catch((err)=>{
            res.status(500).json({msg:'Error fetching user'});
        })
    }
    else{
        res.status(500).json({msg:'not a number'});
    }
})

//app.post request
app.post('/users', (req, res) => {
    const user = req.body;
    db.collection('users')
        .insertOne(user)
        .then((result) => {
            res.status(201).json(result);
        })
        .catch(() => {
            res.status(500).json({ message: 'Error creating user' });
        });
});


//app.patch
app.patch('/users/:id',(req,res)=>{
    let update = req.body;
    const userID=parseInt(req.params.id);
    if(!isNaN(userID)){
        db.collection('users')
        .updateOne({id:userID},{$set:update})
        .then((result)=>{
            res.status(200).json({result});
        })
        .catch(()=>{
            res.status(500).json({msg:'error in something'});
        })
    }
    else{
        res.status(500).json({msg:'not a number'});
    }
})


//app.delete
app.delete('/users/:id',(req,res)=>{
    const userID= parseInt(req.params.id);
    if(!isNaN(userID)){
        db.collection('users')
        .deleteOne({id:userID})
        .then((result)=>{
            res.status(200).json({result});
        })
        .catch(()=>{
            res.status(500).json({msg:'error in something'});
        })
    }
    else{
        res.status(500).json({msg:'not a number'});
    }
})


