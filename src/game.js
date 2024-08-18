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
    let question = document.querySelector("#game-question");
    const choice = document.querySelectorAll(".choices-text");
    question.innerHTML = res.questions[0];
    let i = 0;
    let answerObj = res.answers[0];
    while (i < 4) {
      choice.forEach((e) => {
        e.innerHTML = answerObj[i];
        i++;
      });
    }
  },
  (err) => console.log(err)
);
