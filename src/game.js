async function fetchQuiz() {
  const quiz = await fetch(
    "https://opentdb.com/api.php?amount=12&category=22&difficulty=easy&type=multiple"
  )
    .then((response) => response.json())
    .then((data) => data.results)
    .catch((error) => console.log(error));
  return quiz;
}

async function getData() {
  const quiz = await fetchQuiz();
  let questions = [],
    answers = [];
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
    choices.push(crct);
    for (let i = 0; i < incrct.length; i++) {
      choices.push(incrct[i]);
    }
    choices = Object.assign({}, choices);
    answers.push(choices);
  }
  return { questions, answers };
}

getData().then(
  (res) => console.log(res),
  (err) => console.log(err)
);
