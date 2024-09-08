// Promise function to fetch quiz from the opentdb-api
async function fetchQuiz() {
  const quiz = await fetch(
    "https://opentdb.com/api.php?amount=12&category=22&difficulty=easy&type=multiple"
  )
    .then((response) => response.json())
    .then((data) => data.results)
    .catch((error) => console.log(error));
  return quiz;
}

// Promise function to extract the questions & answer choices from the quiz-api to make a new object { questions, answers }
async function getData() {
  const quiz = await fetchQuiz();
  let questions = [],
    answers = [],
    correct = [];
  for (let qnIndex = 0; qnIndex < quiz.length; qnIndex++) {
    const qns = quiz[qnIndex];
    const qstn = qns.question;
    questions.push(qstn);
  }
  for (let qnIndex = 0; qnIndex < quiz.length; qnIndex++) {
    let choices = [];
    const qns = quiz[qnIndex];
    const crct = qns.correct_answer;
    const incrct = qns.incorrect_answers;
    correct.push(crct);
    choices.push(crct);
    for (let i = 0; i < incrct.length; i++) {
      choices.push(incrct[i]);
    }
    choices = Object.assign({}, choices);
    answers.push(choices);
  }
  return { questions, answers, correct };
}

getData().then(
  (res) => {
    // CONSTANTS
    const CORRECT_BONUS = 5;
    const MAX_QUESTIONS = 12;

    let i = 0,
      score = 0;
    let question = document.querySelector("#game-question");
    const choices = document.querySelectorAll(".choices-text");
    const submit = document.querySelector(".submit-btn");
    question.innerHTML = `${i + 1}. ${res.questions[0]}`;
    let answerObj = res.answers[0];
    for (let j = 0; j < 4; j++) {
      choices.forEach((choice) => {
        choice.innerHTML = answerObj[j];
        j++;
      });
    }

    submit.addEventListener("click", () => {
      if (i < MAX_QUESTIONS - 1) {
        i++;
        do {
          question.innerHTML = `${i + 1}. ${res.questions[i]}`;
          let answerObj = res.answers[i];
          for (let j = 0; j < 4; j++) {
            choices.forEach((choice) => {
              choice.innerHTML = answerObj[j];
              j++;
            });
          }
        } while (i < 1);
      }
    });
  },
  (err) => console.log(err)
);
