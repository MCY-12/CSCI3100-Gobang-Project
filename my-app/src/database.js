const express = require('express');
const res = require('express/lib/response');
const app = express();
var mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const SECRET_KEY = 'logintoken3100'

const dbUri="mongodb://localhost:27017/"
mongoose.connect(dbUri);

const cors=require('cors');
app.use(cors());

const db = mongoose.connection;
// Upon connection failure
db.on('error', console.error.bind(console,'Connection error:'));
// Upon opening the database successfully
db.once('open', function () {
console.log("Connection is open...");

const UserSchema = mongoose.Schema({
  username: { type: String, required: true ,unique:true},
  password: { type: String, required: true},
  score:{type: Number},
  friends:[{type: mongoose.Schema.Types.ObjectId ,ref:'User'}],
  matches:[{type: mongoose.Schema.Types.ObjectId, ref:'Match'}],
  currentMatch:{type: mongoose.Schema.Types.ObjectId,ref:'Match'}
  });

const MatchSchema =mongoose.Schema({
  board: { type: Array},
  player1: { type: mongoose.Schema.Types.ObjectId ,ref:'User',required: true },
  player2: { type: mongoose.Schema.Types.ObjectId ,ref:'User' },
  startingTime:{ type: String},
  result: { type: String }
});

const User=mongoose.model('User',UserSchema);
const Match=mongoose.model('Match',MatchSchema);

// This module is for parsing the content in a request body (installed with npm)  
const bodyParser = require('body-parser');
// Use parser to obtain the content in the body of a request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function newBoard(){
  const arr = [];
  const n = 19;
  const m = 19;

for (let i = 0; i < n; i++) {
    arr.push(new Array(m).fill(0));
}
  return arr;
}

const matchingDone=async(matchId)=>{
  const match=await Match.findOne({_id:matchId});
  console.log(match.player1);
  if (match.player1){
    if(match.player2){
      console.log('t');
      return true;
    }
  }
  return false;
}

//done: return match document if found,else null
const queueUser=async(user,action)=>{
  if (action=='queue'){
    console.log(user);
    const waiting=await User.findOne({currentMatch:{$ne:null}});
    if (waiting){
      console.log('waiting');
      const roomKey=waiting.currentMatch;
      console.log(roomKey);
      const dateTime=Date();
      var bd=newBoard();
      const p2=await User.findOne({username:user});
      await Match.updateOne({_id:roomKey},{$set:{player2:p2._id}});
      await Match.updateOne({_id:roomKey},{$set:{startingTime:dateTime}});
      await Match.updateOne({_id:roomKey},{$set:{board:bd}});
      await User.updateOne({_id:p2._id},{$set:{currentMatch:roomKey}});
      return roomKey;
    }
    else{
      const p1= await User.findOne({username:user});
      const match= await Match.create({
        player1: p1._id,
      });
    await User.updateOne({username:user},{$set:{currentMatch:match._id}});
    return match._id;
  }
  }
  else if (action=='dequeue'){
    await User.updateOne({username:user},{$set:{currentMatch:null}});
  }
  return null;
}



function stringToHash(string) {

  let hash = 0;

  if (string.length == 0) return hash;

  for (i = 0; i < string.length; i++) {
      char = string.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
  }

  return hash;
}


//handle register
app.post('/register', async function(req,res){
  try {
    console.log("a");
    // check if the user exists
    const userExist = await User.findOne({ username: req.body.username });
    if (!userExist) {
      console.log("b");
      const pw = stringToHash(req.body.password);
      const state="";
      console.log("pw = ", pw);
      const user =  User.create({
        username: req.body.username,
        password: pw,
        score : 0,
      });
      console.log("user = ", user);
      res.status(201).send('Successful user registration');
    }
    else{
      console.log("c");
      res.status(400).json({ error: "This username is already used" });}
  } catch (error) {
    console.log("d");
    res.status(400).json({ error });
  }
});


//handle login
app.post('/login', async (req,res) => {
  //check if user exist
    try {
      const user = await User.findOne({ username: req.body.username });
      if (user) {
        //check if password matches
        const pw=stringToHash(req.body.password);
        const check = pw == user.password;
        console.log("check", check)
        if (check) {
          console.log("user.username :", user.username);
          console.log("pw :", pw);
          console.log("SECRET_KEY :", SECRET_KEY);
          const token = jwt.sign(
            {  name: user.username, password: pw },
            SECRET_KEY,
            { expiresIn: '3h' }
          )
          let buf=res.status(200).send({message:'Successful user login, redirect after 3 seconds',token,user:user.username,});
          console.log(buf.body);
        } else {
          console.log("b")
          res.status(400).json({ error: "Password doesn't match" });
        }
      } else {
        console.log("c")
        res.status(400).json({ error: "User doesn't exist" });
      }
    } catch (error) {
      res.status(400).json({ error });
    }
  })


app.post('/casual_matchmaking', async function(req,res){
  try {
      queueUser(req.body.username,req.body.action);
      const Id=await User.findOne({username:req.body.username});
      if(Id.currentMatch)
      {res.status(201).json({matchId:Id.currentMatch});}
      else{
      res.status(201).send("dequeued");}
      
    }
    
   catch (error) {
    console.log("d");
    res.status(400).json({ error });
  }
});

app.post('/searching',async function(req,res){
  try {
    let result;
    matchingDone(req.body.id).then((val)=>{
      result=val;
      console.log(result);
      console.log(val);    
    });      
    if (result){
    res.json({matched:"yes"});}
    else res.json({matched:"no"});
  }
 catch (error) {
  res.status(400).json({ error });
}
})


// handle ALL requests
app.all('/*', (req, res) => {
  // send this to client
  res.status(404).send('Page not found');
});
})


// listen to port 3000
const server = app.listen(3000);

