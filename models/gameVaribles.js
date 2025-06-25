const mongoose=require("mongoose")
const schema=mongoose.schema

const gameVaribles=new mongoose.Schema({
    PlayerName:String,
    gameDifficult:Number,
   
    timeStarted:Date,
     isEnded: { type: Boolean, default: false },
     currentScore: { type: Number, default: 0 }, 

    Questions: [
  {
    question: String,
    correctAnswer: Number,
    userAnswer: Number,
    timeTaken: Number,
  timeStartedForQuestion: { type: Date, required: true }
  }
],

     totalQuestions: { type: Number, default: 0 }, 
     totalTimeSpent:{type:Number, default:0},
    TotalQuestionsAttempted:{type:Number,}

})
const gameVar=mongoose.model("gameVarible",gameVaribles)
module.exports=gameVar