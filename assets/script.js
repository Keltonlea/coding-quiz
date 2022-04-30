var viewHighscoresButton = document.querySelector(".highscore-button");
var startButton = document.querySelector(".start-button");
var playAgainButton = document.querySelector(".play-again");
var timerEl = document.querySelector(".timer");
var questionContainerEl = document.querySelector("#quiz");
var welcome = document.querySelector("#welcome");
var gameOver = document.querySelector("#gameover");
var highscores = document.querySelector("#highscores");
var clearScores = document.querySelector(".clear-scores");
var questionEl = document.querySelector(".question-heading");
var choicesEl = document.querySelector(".choices");
var answerButtonEl = document.getElementById('answer');
var submitScoresEl = document.querySelector(".score-button");
var highscoresEl = document.querySelector(".highscores-list");


var sections = ["welcome", "quiz", "gameover", "highscores"];
var current = "welcome";
var questionIndex = 0;
var score;
var timeLeft;
var questions;



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
    for (var i = 0; i < highscores.length; i++)
    var highscoreObject = highscores[i];
    //create element to render on highscores page
    var listItem = document.createElement ("li");
    listItem.innerText = highscoreObject.name + " - " + highscoreObject.highscore;
    highscoresEl.appendChild(listItem);
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
                "Alan Turing",
                "Bill Gates",
                "Donald Knuth",
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
            question: 'How is the following expression evaluated in JavaScript:\n"2" + "2" - "2"',
            choices: [
                '"2"',
                '"20"',
                "2",
                "20",
            ],
            answer: "20",
        },
        {
            question: 'How is the following expression evaluated in JavaScript:\n"23" === 23',
            choices: [
                "true",
                "false",
            ],
            answer: "false",
        },
        {
            question: "How is the following expression evaluated in JavaScript:\n.1 + .2 !== .3",
            choices: [
                "true",
                "false",
            ],
            answer: "true",
        },
        {
            question: "How do you create a function in JavaScript?",
            choices: [
                "function foo()",
                "function:foo()",
                "function = foo()",
            ],
            answer: "function foo()",
        },
        {
            question: "JavaScript is the same as Java?",
            choices: [
                "true",
                "false",
            ],
            answer: "false",
        },
        {
            question: "When declaring a variable what's the difference between the 'let' and 'var' keywords?",
            choices: [
                "No difference",
                "'let' limits the variable scope to block statements, while 'var' doesn't",
                "let doesn't exist in JavaScript",
            ],
            answer: "'let' limits the variable scope to block statements, while 'var' doesn't",
        },
        {
            question: "Is JavaScript case-sensitive?",
            choices: [
                "Yes",
                "No",
            ],
            answer: "Yes",
        },
    ];
}




//event listener to start button to call startQuiz function on click 
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
        renderHighscores();
    });
    

startButton.addEventListener("click", startQuiz);
playAgainButton.addEventListener("click", function(){
    location.href= "https://keltonlea.github.io/uw-homework-4/"
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