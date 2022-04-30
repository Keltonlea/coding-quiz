// declare variables
var viewHighscoresButton
var startButton
var playAgainButton
var timerEl
var questionContainerEl
var welcome
var gameOver
var highscores
var clearScores
var questionEl
var choicesEl
var answerButtonEl
var submitScoresEl
var highscoresEl
var sections
var current
var questionIndex
var score;
var timeLeft;
var questions;

// init function, called when js file is loaded
function init() {
    viewHighscoresButton = document.querySelector(".highscore-button");
    startButton = document.querySelector(".start-button");
    playAgainButton = document.querySelector(".play-again");
    timerEl = document.querySelector(".timer");
    questionContainerEl = document.querySelector("#quiz");
    welcome = document.querySelector("#welcome");
    gameOver = document.querySelector("#gameover");
    highscores = document.querySelector("#highscores");
    clearScores = document.querySelector(".clear-scores");
    questionEl = document.querySelector(".question-heading");
    choicesEl = document.querySelector(".choices");
    // answerButtonEl = document.getElementById('answer');
    submitScoresEl = document.querySelector(".score-button");
    highscoresEl = document.querySelector(".highscores-list");


    sections = ["welcome", "quiz", "gameover", "highscores"];
    current = "welcome";

    // set all event listeners
    submitScoresEl.addEventListener("click", function(event) {
        event.preventDefault();
        let highscores = JSON.parse(localStorage.getItem("highscores"));

            if (highscores == null) {
                highscores = [];
            }

            highscores.push(
                {
                    name: document.querySelector("#name-input").value,
                    highscore: score,
                }
            );
            localStorage.setItem("highscores", JSON.stringify(highscores));
            // clear the name input field after
            document.querySelector("#name-input").textContent = "";
            renderHighscores();
    });
        

    startButton.addEventListener("click", startQuiz);
    playAgainButton.addEventListener("click", function(){
        renderSection('welcome');
    });

    viewHighscoresButton.addEventListener("click", renderHighscores);
    choicesEl.addEventListener("click", function(event) {
        // ignore if target isn't a button
        if (event.target.nodeName === "BUTTON") {
            checkAnswer(event.target);
        }
    });
    clearScores.addEventListener("click", function(event) {
        // clear all li elements
        document.querySelector(".highscores-list").innerHTML = "";
        // remove "highscores" from local storage
        localStorage.clear();
        renderHighscores();
    });
    
    // finally show the current section, which should be the welcome section assigned above
    renderSection(current);
}


function hideAllSections() {
    for (var i=0; i < sections.length; i++) {
        document.querySelector("#" + sections[i]).classList.add("hidden");
    }
}

function renderSection(section) {
    // hide everything else
    hideAllSections();

    // update the current section 
    current = section;

    // unhide the section we want to render
    document.querySelector("#" + section).classList.remove("hidden");
}

function renderHighscores() {
    viewHighscoresButton.disabled = true;
    timerEl.hidden = true;
   
    renderSection("highscores");
    // get name and score from local storage
    var highscores = JSON.parse(localStorage.getItem("highscores"));
    highscoresEl.innerHTML = "";
    for (var i = 0; i < highscores.length; i++) {
        var highscoreObject = highscores[i];
        //create element to render on highscores page
        var listItem = document.createElement ("li");
        listItem.innerText = highscoreObject.name + " - " + highscoreObject.highscore;
        highscoresEl.appendChild(listItem);
    }
}

function renderGameover() {
    timerEl.hidden = true;
    // Thanks for playing! You scored 50 points!
    document.querySelector(".final-score").innerText = "Thanks for playing! You scored " + score + " points!";
    renderSection("gameover");
}
   
function renderTimeLeft() {
    timerEl.hidden = false;
    timerEl.textContent = "Timer: " + timeLeft + " seconds";
}

function startQuiz() {
    score = 0;
    timeLeft = 60;
    questionIndex = 0;
    setQuestionsList();
    renderSection("quiz");
    renderTimeLeft();
    renderQuestion();
        
    let timerInterval = setInterval(function () {
        timeLeft--;

        // when time hits zero, show gamover section
        if (timeLeft <= 0) {
            renderGameover();
        }

        // stop timer interval if not in quiz or timeLeft is zero, otherwise render time left
        if (current !== "quiz" || timeLeft <= 0) {
            clearInterval(timerInterval);
        } else {
            renderTimeLeft();
        } 
    }, 1000);
}

function renderQuestion() {

    if (questionIndex < questions.length) {
        //get question object from array

        var questionObject = questions[questionIndex];
        var question = questionObject.question;
        questionEl.innerText = question;
     
        // get mult choices and fill them in our choices div
        var choices = questionObject.choices;
        choicesEl.innerHTML = "";

        for (var i = 0; i < choices.length; i++) {
            var choiceText = choices[i]
            var choiceButton = document.createElement("button");
            choiceButton.innerText = choiceText;
            choiceButton.classList.add("btn", "btn-info");
            choicesEl.appendChild(choiceButton);
        }
        //increment question index so that we ask next question in the list next time
        questionIndex++;
    } else {
        renderGameover();
    }
}

function checkAnswer(buttonEl) {
    var userChoice = buttonEl.innerText;

    // get the last question asked, and get it's answer property
    var questionObject = questions[questionIndex - 1]
    var actualAnswer = questionObject.answer;

    var responseEl = document.querySelector(".response");
    if (userChoice === actualAnswer) {
        score += 5;
        responseEl.innerText = "Correct!";
    } else {
        timeLeft -= 5;
        responseEl.innerText = "Wrong!";
    }

    renderQuestion();
}

function setQuestionsList() {
    questions = [
        {
            question: "Who is considered the first computer programmer?",
            choices: [
                "Ada Lovelace",
                "Guido van Rossum",
                "Bill Gates",
                "Richard Hendricks",
            ],
            answer: "Ada Lovelace",
        },
        {
            question: "What was JavaScript originally named?",
            choices: [
                "Mocha",
                "TypeScript",
                "ECMAScript",
            ],
            answer: "Mocha",
        },
        {
            question: "When was JavaScript invented?",
            choices: [
                "1995",
                "1989",
                "1998",
            ],
            answer: "1995",
        },
        {
            question: 'How is the following expression evaluated in JavaScript:\n"5" + "5" - "5"',
            choices: [
                '"5"',
                '"50"',
                "5",
                "50",
            ],
            answer: "50",
        },
        {
            question: 'How is the following expression evaluated in JavaScript:\n"50" === 50',
            choices: [
                "true",
                "false",
            ],
            answer: "false",
        },
        {
            question: "How long did it take to develop JavaScript?",
            choices: [
                "1 year",
                "10 days",
                "2 years",
                "63 days",
            ],
            answer: "10 days",
        },
        {
            question: "How do you create a function in JavaScript?",
            choices: [
                "function myFunction()",
                "function:myFunction()",
                "function = myFunction()",
            ],
            answer: "function myFunction()",
        },
        {
            question: "JavaScript is the same as Java",
            choices: [
                "true",
                "false",
            ],
            answer: "false",
        },
        {
            question: "Who invented the first ever JavaScript?",
            choices: [
                "Tim Cook",
                "Ada Lovelace",
                "Erlich Bachman",
                "Brendan Eich",

            ],
            answer: "Brendan Eich",
        },
        {
            question: "JavaScript is case-sensitive",
            choices: [
                "true",
                "false",
            ],
            answer: "true",
        },
    ];
}

// call init when the webpage loads the js file
init();
