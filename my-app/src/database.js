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
  state:{type: String}
});

const MatchSchema =mongoose.Schema({
  board: [{ type: Array, required: true }],
  player1: { type: mongoose.Schema.Types.ObjectId ,ref:'User',required: true },
  player2: { type: mongoose.Schema.Types.ObjectId ,ref:'User',required: true },
  startingTime:{ type: String, required: true },
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

const updateBoard=async(matchId,player,x,y)=>{
  
}

//done: return match document if found,else null
const queueUser=async(user,action)=>{
  if (action=='queue'){
    const waiting=await User.findOne({state:"in queue"});
    if (waiting){
      const dateTime=Date();
      var bd=newBoard();
      const p2=await User.findOne({username:user});
      const match=Match.create({
        player1: waiting._id,
        player2: p2._id,
        startingTime:dateTime,
        board:bd
      });
      await User.updateOne({_id:waiting._id},{$set:{state:""}});
      return match;
    }
    else{
    await User.updateOne({username:user},{$set:{state:"in queue"}});
    return null;
  }
  }
  else if (action=='dequeue'){
    await User.updateOne({username:user},{$set:{state:""}});
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
module.exports={queueUser};

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
        state: state
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
 
app.post('/test',(req,res)=>{
  console.log(queueUser('abc','queue'));
  res.send('done');
})

app.post('/test2',(req,res)=>{
  console.log(queueUser('def','queue'));
  res.send('done'); 
})
// handle ALL requests
app.all('/*', (req, res) => {
  // send this to client
  res.status(404).send('Page not found');
});
})

app.get('/user/matches', (req, res) => {
  const username = req.query.username; // get the username from the request query parameters
  User.findOne({ username: username })
    .populate('matches')
    .exec((err, user) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(user.matches);
      }
    });
});

// listen to port 3000
const server = app.listen(3000);


