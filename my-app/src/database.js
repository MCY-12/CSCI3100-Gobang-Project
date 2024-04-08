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
  username: { type: String, required: true ,unique:false},
  password: { type: String, required: true},
  score:{type: Number},
  friends:[{type: mongoose.Schema.Types.ObjectId ,ref:'User'}],
  matches:[{type: mongoose.Schema.Types.ObjectId, ref:'Match'}],
  state:{type: Boolean}
  });

const MatchSchema =mongoose.Schema({
  matchId:{type: Number, required: true, unique: true},
  board: [{ type: String, required: true }],
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
      console.log("pw = ", pw);
      const user =  User.create({
        username: req.body.username,
        password: pw,
        score : 0
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
          console.log("token :", token);
          res.status(200).send({message:'Successful user login',token,user:user.username,});
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
 
// handle ALL requests
app.all('/*', (req, res) => {
  // send this to client
  res.status(404).send('Page not found');
});
})

// listen to port 3000
const server = app.listen(3000);