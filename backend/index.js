const express = require("express");
const mongodb = require("mongodb");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require('jsonwebtoken');
let env  = require('dotenv');
env.config();
const app = express();
let nodemailer = require('nodemailer');
const objectId = mongodb.ObjectID;
const mongoClient = mongodb.MongoClient;

const dburl = process.env.DB_URL;
const port = process.env.PORT || 4200;

app.use(express.json());
app.use(cors());

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'raishwarya344@gmail.com',
    pass: process.env.mail_pass
  }
});

  
app.post("/signup",async(req,res) =>{
    let clientInfo;
    try{
      clientInfo = await mongoClient.connect(dburl);
      let db = clientInfo.db("User_DB");
      let found = await db.collection("users").findOne({email : req.body.email});
  
      if(found){
        res.status(200).json({message :"User already exists"});
      }
      else{
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(req.body.password,salt);
        req.body.password = hash;
        req.body.task = [];
        await db.collection("users").insertOne(req.body);
        res.status(200).json({message :"User registered"});
  

      }
     
    }
    catch(error){
      console.log(error);
    }
    clientInfo.close()
})


app.post("/login",async(req,res) =>{
    let clientInfo;
    try{
      clientInfo = await mongoClient.connect(dburl);
      let db = clientInfo.db("User_DB");
      let data = await db.collection("users").findOne({email : req.body.email});
      
      if(data){
        let isValid = await bcrypt.compare(req.body.password, data.password);
        if(isValid){
          let token = await jwt.sign({user_id : data._id},process.env.JWT_KEY);
          
          res.status(200).json({message : "Login successful", token : token, email: data.email});
        }else{
          res.status(200).json({message : "Login Unsuccessful"});
        }
      
      }
      else{
        res.status(200).json({message :"User is not registered"});
      }
      
    }
    catch(error){
      console.log(error);
    }
    clientInfo.close()
})

app.put("/addtask",authentication,async(req,res)=>{
  let clientInfo;
    try{
      clientInfo = await mongoClient.connect(dburl);
      let db = clientInfo.db("User_DB");
      let id = res.locals.user_id;
      req.body.date = new Date( req.body.date );
      req.body.createdAt = new Date();
  
      await db.collection('users').findOneAndUpdate({_id: objectId(id)},{ $push: { task : req.body}});
      return res.send("Task added");
    }
    catch(error){
      console.log(error)
    }
    clientInfo.close();
})

app.get("/gettask/:type",authentication,async(req,res)=>{
  let clientInfo;
    try{
      clientInfo = await mongoClient.connect(dburl);
      let db = clientInfo.db("User_DB");
      let id = res.locals.user_id;
      let type = req.params.type;
      let data = await db.collection('users').findOne({ _id: objectId(id) });
      let { task } = data;

      if(type === "All Tasks"){
        return res.status(200).json(task);
      }
      var arr = task.filter((item)=>{
        return (item.type === type);
      })  
      
      res.status(200).json(arr);
    }
    catch(error){
      console.log(error)
    }
    clientInfo.close();
})


app.put("/deletetask/:date",authentication,async(req,res) =>{
  let clientInfo;
  try{
    
    clientInfo = await mongoClient.connect(dburl);
    let db = clientInfo.db("User_DB");
    let id = res.locals.user_id;
    let date = new Date(req.params.date);
    // let found = await db.collection("users").findOne({email : req.body.email});
    let data = await db.collection("users").findOne({_id:objectId(id)});  
    let { task } = data;
    let index=-1;
    task.forEach((element,ind) => {
      if(element.createdAt === date){
        index = ind
      }
    });
    task.splice(index,1)  
    await db.collection("users").updateOne({_id:objectId(id)}, {$set : {task : task}});
    res.status(200).json({message : "Task deleted"});
  }
  catch(error){
    console.log(error);
  }
  clientInfo.close()
})

  

async function authentication(req,res,next){
    try{
      
      if(req.headers.authorization!==undefined){
        let decode = await jwt.verify(req.headers.authorization, process.env.JWT_KEY);
        
  
        if(decode !== undefined){
          res.locals.user_id = decode.user_id ;
          next();
        }
        else{
          res.status(401).json({message : "Invalid token"})
        }
      }
      else{
        res.status(401).json({message : "No token in header"})
      }
      
    }catch(error){
      console.log(error);
    }
}
  


app.listen(port,()=>{
    console.log("Server Running in port : ",port);
})