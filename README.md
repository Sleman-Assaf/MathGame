 Math Game API

This is a simple math game built using Node.js and MongoDB. Players solve dynamically generated math questions based on a selected difficulty level.

---

 How to Run the Project

Open terminal and navigate to the project directory:
  
   cd your-project-folder 
   
 Install dependencies: npm install,

  Start the server: node index.js,

Server will run at:

http://localhost:3000

API Endpoints

 Start a New Game 
 
 POST /game/start 
 
 Request Body:

 
 {
  "name": "YourName",
  
  "difficltNumber": 1 // choose difficulty from 1 to 4
}

-------------------

 Submit an Answer
 
POST /game/:gameId/submet
 
 Replace :gameId with the actual game ID -.
 
 Request Body:
 
{
  "answer": 8
  
}

---------------
 End the Game

GET /game/:gameId/end

Replace :gameId with the actual game ID.

 ------------------------
 ## Tips
 
 Always start the game using /game/start before submitting any answers.
 
 Use the submit_url returned in each response to continue submitting answers.
 
You cannot submit answers after the game has ended using /game/:gameId/end.

 Notes:
 
  ## Difficulty levels:

1 → Easy (1-digit numbers)

2 → Medium (2-digit numbers)

3 → Hard (3-digit numbers)

4 → Expert (4-digit numbers)

## Tech Stack :

Node.js

Express.js

MongoDB 

##  Postman Collection

You can find a ready-to-test Postman collection here:  
 [Click to open in Postman](https://www.postman.com/orange-zodiac-924456/workspace/circa-task/collection/43363050-cbe05142-76c6-4c5c-8bfe-42a47cfdd890?action=share&creator=43363050)


 
