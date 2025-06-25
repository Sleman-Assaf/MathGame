const express=require("express")
const mongoose=require("mongoose")
const app= express();
app.use(express.json());

let Startdate=""
const gamevar=require("./models/gameVaribles") // database conetx

mongoose.connect("mongodb+srv://nanodes159:GdvbLmx5tVcrQjvt@midgame.65mijxx.mongodb.net/?retryWrites=true&w=majority&appName=midGame") 
.then(function(){
console.log("conncet with database is done !")
})
.catch(function(){
console.log("can't conncet with database!")
})


//metod to make a eqution

function makeAQuestion(gameDifficult){
const op=["+","-","*","/"]
let randomNumber=[];
if (gameDifficult === 1) {
  let min = 0;
  let max = 9;
 

  for (let i = 0; i < 2; i++) {
    randomNumber[i] = Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const operator = op[Math.floor(Math.random() * op.length)];
  let question = `${randomNumber[0]} ${operator} ${randomNumber[1]}`;
  let answer = eval(question);

  return {
    question: question,
    answer: answer
  };
}


else if(gameDifficult===2){

let min = 10;
let max = 99;

for (let i =0;i<3;i++){
randomNumber[i] = Math.floor(Math.random() * (max - min + 1)) + min;

}



let Question=`${randomNumber[0]} ${op[Math.floor(Math.random() * op.length)]} ${randomNumber[1]} ${op[Math.floor(Math.random() * op.length)]} ${randomNumber[2]}`


console.log(eval(Question)) // عشان اخذ الجواب واقارنه بعدين 




return {
  question: Question,
  answer: eval(Question)
};



}

else if(gameDifficult===3){

let min = 100;
let max = 999;

for (let i =0;i<4;i++){
randomNumber[i] = Math.floor(Math.random() * (max - min + 1)) + min;

}



let Question=`${randomNumber[0]} ${op[Math.floor(Math.random() * op.length)]} ${randomNumber[1]} ${op[Math.floor(Math.random() * op.length)]} ${randomNumber[2]} ${op[Math.floor(Math.random() * op.length)]}  ${randomNumber[3]}`


console.log(eval(Question)) // عشان اخذ الجواب واقارنه بعدين 




return {
  question: Question,
  answer: eval(Question)
};



}

else if(gameDifficult===4){

let min = 1000;
let max = 9999;

for (let i =0;i<5;i++){
randomNumber[i] = Math.floor(Math.random() * (max - min + 1)) + min;

}



let Question=`${randomNumber[0]} ${op[Math.floor(Math.random() * op.length)]} ${randomNumber[1]} ${op[Math.floor(Math.random() * op.length)]} ${randomNumber[2]} ${op[Math.floor(Math.random() * op.length)]}  ${randomNumber[3]} ${op[Math.floor(Math.random() * op.length)]} ${randomNumber[4]}`


console.log(eval(Question)) // عشان اخذ الجواب واقارنه بعدين 



return {
  question: Question,
  answer: eval(Question)
};


}

else {
   
    return null;



}
}


// هان لبداية اللعبة
app.post("/game/start",function(req,res){
  
    const name=req.body.name; 
const gamedifficulty = parseInt(req.body.difficltNumber);


 if (![1, 2, 3, 4].includes(gamedifficulty)) { // عشان نتاكد من المدخلات
  return res.status(400).json({
    error: "Difficulty must be one of: 1, 2, 3, or 4",
  });
}

if (!name || typeof name !== 'string' || name.trim().length === 0) {
  return res.status(400).json({
    error: "Enter your name!",
  });
}

 const newGameVarible=new gamevar() //database

newGameVarible.PlayerName=name
newGameVarible.gameDifficult=gamedifficulty

newGameVarible.timeStarted=Date.now()


const generated = makeAQuestion(newGameVarible.gameDifficult);



newGameVarible.Questions = [{
  question: generated.question,
  correctAnswer: generated.answer,
  userAnswer: null,
  timeTaken: null,
   timeStartedForQuestion: Date.now(),

}];






 newGameVarible.save().then(function(){
res.json({

message:`Hello ${newGameVarible.PlayerName},your game has started!`,

gamedifficulty:`your game diffuclut is: ${newGameVarible.gameDifficult}`,

timeStarted:`game started time: ${newGameVarible.timeStarted}`,

Question: `Question is ${generated.question}`,

submit_url: `/game/${newGameVarible._id}/submet`,

})


 })
 .catch(function(){
      res.status(500).send("Error saving game");

 })






})

// هان لارسال الجواب
app.post(`/game/:gameId/submet`, async function(req, res) {
  const gameid = req.params.gameId;
  const game = await gamevar.findById(gameid);

  if (!game || game.isEnded === true) {
    return res.status(404).json({ message: "Game not found or already ended." });
  }

  const userAnswer = req.body.answer;
  const lastQuestion = game.Questions[game.Questions.length - 1];

  
  const questionStart = lastQuestion.timeStartedForQuestion;
  if (!questionStart) {
    return res.status(400).json({ message: "Missing question start time." });
  }

  const timeTaken = Date.now() - questionStart;
  const timeInMin = Math.floor(timeTaken / 1000 / 60);

  lastQuestion.userAnswer = userAnswer;
  lastQuestion.timeTaken = timeTaken;
  if (!game.totalTimeSpent) {
  game.totalTimeSpent = 0;
}
  game.totalTimeSpent += timeTaken;


  const generated = makeAQuestion(game.gameDifficult);


   if (!generated || !generated.question || !generated.answer) {
  return res.status(500).json({ error: "Failed to generate a question. Please try again." });
}
  game.Questions.push({
    question: generated.question,
    correctAnswer: generated.answer,
    userAnswer: null,
    timeTaken: null,
    timeStartedForQuestion: Date.now() 
  });

  if (parseInt(lastQuestion.correctAnswer) === parseInt(userAnswer)) {
    ++game.currentScore;
  }

  await game.save();

  return res.json({
    message: parseInt(lastQuestion.correctAnswer) === parseInt(userAnswer)
      ? `Good job! ${game.PlayerName}, your answer is correct!`
      : `Sorry ${game.PlayerName}, your answer is incorrect.`,
    timeTaken: `${(timeTaken / 1000).toFixed(2)} seconds`,
    yourScore: `${game.currentScore}`,
    next_question: {
      question: generated.question,
      submit_url: `/game/${game._id}/submet`
    },
    TotalQuestionsAttempted: `${game.Questions.length - 1}`
  });
});


app.get("/game/:gameId/end",async function(req,res){
const gameid = req.params.gameId;

  const game = await gamevar.findById(gameid);

  if (!game) {
    return res.status(404).json({ message: "Game not found" });
  }

game.isEnded=true

await game.save();

let min = Infinity;
let fastestQuestion = "";
let answer=0;
for (let i = 0; i < game.Questions.length; i++) {


  const q = game.Questions[i];
  if (typeof q.timeTaken === "number" && !isNaN(q.timeTaken) && q.timeTaken < min) {
    min = q.timeTaken;
    fastestQuestion = q.question;
answer=q.userAnswer
  }
}


  res.json({
playerName:`${game.PlayerName}`,
difficulty: `${game.gameDifficult}`,
currentSscore: `correctAnswer: ${game.currentScore} -- total Qustions: ${game.Questions.length}`,
totalTimeSpent: `${(game.totalTimeSpent / 1000 / 60).toFixed(2)} minutes`,

bestScore: {
  question: fastestQuestion,
  answer:`${answer}`,
  time: `${(min / 1000).toFixed(2)} seconds`
},


history: game.Questions.map(elm => ({
  question: elm.question,
  userAnswer: elm.userAnswer,
  time:(elm.timeTaken/1000).toFixed(2)

}))


  })


})



app.listen(3000, function(){
    console.log("Serer Start !")
})