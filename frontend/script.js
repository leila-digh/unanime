// DOM Elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");
const timerBar = document.getElementById("timer");
const showAnswersBtn = document.getElementById("show-answers-btn");
const nextBtn = document.getElementById("next-question-btn");

const numQuestionsInput = document.getElementById("num-questions");
const numSecondsInput = document.getElementById("num-seconds");

let timePerQuestion =  parseInt(numSecondsInput.value); // seconds
let timeLeft;
let timerInterval;


// Quiz questions
let quizQuestions = [];
let allQuestions = [];

async function loadQuestions() {
    try {
        const response = await fetch("questions.json");
        if (!response.ok) throw new Error("Failed to load questions");
        allQuestions = await response.json();

        
        // maxScoreSpan.textContent = quizQuestions.length;
    } catch (err) {
        console.error(err);
        alert("Could not load quiz questions.");
    }
}

function getRandomQuestions(allQuestions, numQuestions) {
    // Shuffle the array
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    // Return the first N items
    return shuffled.slice(0, numQuestions);
}



let currentQuestionIndex = 0;



// Event listeners
startButton.addEventListener("click", startQuiz)
restartButton.addEventListener("click", restartQuiz)

async function startQuiz(){
    await loadQuestions();

    let numQuestions = parseInt(numQuestionsInput.value) || 5;

    quizQuestions = getRandomQuestions(allQuestions, numQuestions);
    totalQuestionsSpan.textContent = quizQuestions.length;

    //reset
    console.log("quiz started")
    currentQuestionIndex = 0;

    startScreen.classList.remove("active");
    quizScreen.classList.add("active");

    showQuestion();
}




function showQuestion(){
    answersContainer.innerHTML = "";

    const currentQuestion = quizQuestions[currentQuestionIndex];
    currentQuestionSpan.textContent = currentQuestionIndex + 1;

    questionText.textContent = currentQuestion.question
    // Hide buttons until ready
    showAnswersBtn.style.display = "none";
    nextBtn.style.display = "none";


    startTimer();
}


function startTimer() {
    clearInterval(timerInterval);
    timePerQuestion = parseInt(numSecondsInput.value);
    timeLeft = timePerQuestion;
    timerBar.style.width = "100%";

    timerInterval = setInterval(() => {
        timeLeft--;
        const percent = (timeLeft / timePerQuestion) * 100;
        timerBar.style.width = percent + "%";

        console.log("Time left:", timeLeft);

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showAnswersBtn.style.display = "inline-block"; 
        }
    }, 1000);
}

function showResult() {
    quizScreen.classList.remove("active");
    resultScreen.classList.add("active");

    resultMessage.textContent = "Fin";
}

showAnswersBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    const currentQuestion = quizQuestions[currentQuestionIndex];
    answersContainer.innerHTML = "";

    currentQuestion.sample_answers.forEach(answer => {
      const btn = document.createElement("button");
      btn.textContent = answer;
      btn.classList.add("answer-btn");
      answersContainer.appendChild(btn);
    });

    showAnswersBtn.style.display = "none";
    nextBtn.style.display = "inline-block";
});

nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if(currentQuestionIndex < quizQuestions.length){
        showQuestion();
    } else {
        showResult();
    }
});

function restartQuiz(){
    resultScreen.classList.remove("active")

    startQuiz();
}
