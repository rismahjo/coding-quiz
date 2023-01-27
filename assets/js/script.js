// Welcome
const welcomeEl = document.querySelector("#welcome");
const startQuizBtnEl = document.querySelector("#startQuiz");

//Quiz
const quizEl = document.querySelector("#quiz");
const questionEl = document.querySelector("#question");
const answersEl = document.querySelector("#answers");

//Input Score
const inputScoreEl = document.querySelector("#inputScore");
const initialsEl = document.querySelector("#initials");
const submitInitialsBtnEl = document.querySelector("#submitInitials");
const userScoreEl = document.querySelector("#score");

//High Scores
const highScoresEl = document.querySelector("#highScores");
const scoresEl = document.querySelector("#scores");
const goBackBtnEl = document.querySelector("#goBack");
const clearScoresBtnEl = document.querySelector("#clearScores");

//Universal Variables
var score = 0;
var currentQuestion = 0;
var highScores = [];
var interval;
var timeGiven = 80;
var secondsElapsed = 0;
const timerEl = document.querySelector("#timer");
const viewHighScoresBtnEl = document.querySelector("#viewHighScores");


// ARRAY OF QUESTIONS
var questions = [
    {
        title: "Commonly used data types DO NOT include:",
        choices: ["strings", "booleans", "alerts", "numbers"],
        answer: "alerts"
    },
    {
        title: "The condition in an if / else statement is enclosed within ____.",
        choices: ["quotes", "curly brackets", "parentheses", "square brackets"],
        answer: "parentheses"
    },
    {
        title: "Which built-in method removes the last element from an array and returns that element?",
        choices: ["last()", "get()", "pop()", "None of the Above"],
        answer: "pop()"
    },
    {
        title: "Which built-in method returns the calling string value converted to lower case?",
        choices: ["toLowerCase()", "toLower()", "changeCase(case)", "None of the Above"],
        answer: "toLowerCase()"
    },
    {
        title: "Which of the following function of Number object returns the number's value",
        choices: ["toString()", "valueOf()", "toLocaleString()", "toPrecision()"],
        answer: "valueOf()"
    },
    {
        title: "Which of the following function of Array object joins all elements of an array into a string?",
        choices: ["concat()", "join()", "pop()", "map()"],
        answer: "join()"
    }
];


//Start timer
function startTimer() {
    timerEl.textContent = timeGiven;
    interval = setInterval(function () {
        secondsElapsed++;
        timerEl.textContent = timeGiven - secondsElapsed;
        if (secondsElapsed >= timeGiven) {
            currentQuestion = questions.length;
            nextQuestion();
        }
    }, 1000);
}

//Stop timer
function stopTimer() {
    clearInterval(interval);
}

//Clear current question and display next question. If last question it will diplay the score input screen. 
function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        renderQuestion();
    } else {
        stopTimer();
        if ((timeGiven - secondsElapsed) > 0)
            score += (timeGiven - secondsElapsed);
        userScoreEl.textContent = score;
        hide(quizEl);
        show(inputScoreEl);
        timerEl.textContent = 0;
    }
}

//Check your answer and update the score
function checkAnswer(answer) {
    if (questions[currentQuestion].answer == questions[currentQuestion].choices[answer.id]) {
        score += 5;
        displayMessage("Correct");
    }
    else {
        secondsElapsed += 10;
        displayMessage("Wrong");
    }
}

//Display a message if correct or wrong
function displayMessage(m) {
    let messageHr = document.createElement("hr");
    let messageEl = document.createElement("div");
    messageEl.textContent = m;
    document.querySelector(".jumbotron").appendChild(messageHr);
    document.querySelector(".jumbotron").appendChild(messageEl);
    setTimeout(function () {
        messageHr.remove();
        messageEl.remove();
    }, 2000);
}

//Hide an element
function hide(element) {
    element.style.display = "none";
}

//Show an element
function show(element) {
    element.style.display = "block";
}

//Reset variables
function reset() {
    score = 0;
    currentQuestion = 0;
    secondsElapsed = 0;
    timerEl.textContent = 0;
}


//Rendering the current question
function renderQuestion() {
    questionEl.textContent = questions[currentQuestion].title;
    for (i = 0; i < answersEl.children.length; i++) {
        answersEl.children[i].children[0].textContent = `${(i + 1)}: ${questions[currentQuestion].choices[i]}`;
    }
}

//Rendering high scores in local storage
function renderHighScores() {
    scoresEl.innerHTML = "";
    show(highScoresEl);
    highScores = JSON.parse(localStorage.getItem("scores"));
    console.log(highScores);
    for (let i = 0; i < highScores.length; i++) {
        let scoreItem = document.createElement("div");
        scoreItem.className += "row mb-3 p-2";
        console.log(scoreItem)
        scoreItem.setAttribute("style", "background-color:PaleTurquoise");
        scoreItem.textContent = `${(i + 1)}. ${highScores[i].username} - ${highScores[i].userScore}`;
        scoresEl.appendChild(scoreItem);
    }
}

//Display high scores
viewHighScoresBtnEl.addEventListener("click", function () {
    hide(welcomeEl);
    hide(quizEl);
    hide(inputScoreEl);
    renderHighScores();
    stopTimer();
    reset();
});

//Start the quiz
startQuizBtnEl.addEventListener("click", function () {
    hide(welcomeEl);
    startTimer();
    renderQuestion();
    show(quizEl);
});

//Checks answer clicked and then next question is displayed
answersEl.addEventListener("click", function (e) {
    if (e.target.matches("button")) {
        checkAnswer(e.target);
        nextQuestion();
    }
});

//Create user score and store in scores array and then display high scores
submitInitialsBtnEl.addEventListener("click", function () {
    let initValue = initialsEl.value;
    if (initValue) {
        let userScore = { username: initValue, userScore: score };
        initialsEl.value = '';
        highScores = JSON.parse(localStorage.getItem("scores")) || [];
        highScores.push(userScore);
        localStorage.setItem("scores", JSON.stringify(highScores));
        hide(inputScoreEl);
        renderHighScores();
        reset();
    }
});

//Returns to welcome page from high scores page
goBackBtnEl.addEventListener("click", function () {
    hide(highScoresEl);
    show(welcomeEl);
});

//Clear saved scores
clearScoresBtnEl.addEventListener("click", function () {
    highScores = [];
    localStorage.setItem("scores", JSON.stringify(highScores));
    renderHighScores();
});

