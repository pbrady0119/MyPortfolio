const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName('choice-text'));
console.log(choices)
const questionCounterText = document.getElementById("questionCounter");
const scoreText = document.getElementById("score");



let currentQuestion = {};
let acceptingAnswers = true; // allow for a delay before next question
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch("questions.json").then(res => {
    return res.json();
})
.then(loadedQuestions => {
    questions = loadedQuestions;
    startGame();
});

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

startGame = () => {
    questionCounter = 0;
    availableQuestions = [...questions];
    getNewQuestion();
};

getNewQuestion = () => {

        if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
            localStorage.setItem('mostRecentScore', score);
            // go to the end page
            return window.location.assign("./end.html")
        }

    questionCounter++;
    questionCounterText.innerText = questionCounter + "/" + MAX_QUESTIONS;


    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach( choice => {
        const number = choice.dataset.number;
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);

    acceptingAnswers = true;


};

choices.forEach(choice => {
    choice.addEventListener('click', e =>{
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset.number;
       

        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

  
        if(classToApply === 'correct'){
            incrementScore(CORRECT_BONUS);
        } else {(swal("Incorrect, the correct answer is " + currentQuestion.anstext))}; // custom alert box



        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout( () => {

            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();

        }, 1000);

        
        
    });

});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};


