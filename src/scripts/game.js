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

// Promise function to extract the questions & answer choices
// from the quiz-api to make a new object { questions, answers, correct }
async function getData() {
  const quiz = await fetchQuiz();
  var questions = [],
    answers = [],
    correct = [];

  for (let qnIndex = 0; qnIndex < quiz.length; qnIndex++) {
    const qns = quiz[qnIndex];
    let qn = qns.question;
    questions.push(qn); // update "questions" array.
  }

  for (let qnIndex = 0; qnIndex < quiz.length; qnIndex++) {
    let availableChoices = [];

    const qns = quiz[qnIndex];
    let correctAns = qns.correct_answer;
    let incorrectAns = qns.incorrect_answers;

    correct.push(correctAns); // update "correct" array.
    availableChoices.push(correctAns);

    for (let i = 0; i < incorrectAns.length; i++) {
      availableChoices.push(incorrectAns[i]);
    }
    availableChoices = Object.assign({}, availableChoices);
    answers.push(availableChoices); // update "answers" array.
  }

  return { questions, answers, correct };
}

const data = getData();
data.then(
  (res) => {
    // CONSTANTS
    const CORRECT_BONUS = 5;
    const MAX_QUESTIONS = 12;

    var selectedChoice = [];
    var i = 0,
      scoreCount = 0,
      questionsCounter = 0;
    // dom-manipulation variables
    let question = document.querySelector("#game-question");
    const game = document.querySelector("#game");
    const radios = document.querySelectorAll(".choice-radio");
    const choices = document.querySelectorAll(".choices-text");
    const radioChoices = document.getElementsByName("question-choice");
    const submit = document.querySelector(".submit-btn");
    const score = document.querySelector("#score");

    question.innerHTML = `${i + 1}. ${res.questions[0]}`;
    let answerObj = res.answers[0];

    for (let j = 0; j < 4; j++) {
      radios.forEach((radio) => {
        radio.value = answerObj[j];
        j++;
      });
    }
    for (let j = 0; j < 4; j++) {
      choices.forEach((choice) => {
        choice.innerHTML = answerObj[j];
        j++;
      });
    }

    radioChoices.length > 0 &&
      radioChoices.forEach((radioChoice) => {
        if (radioChoice.checked) selectedChoice.push(radioChoice.value);
        radioChoice.addEventListener("click", () => {
          if (radioChoice.checked) {
            selectedChoice.push(radioChoice.value);
          }
        });
      });

    // To prevent page-refresh on submit of each answer choice.
    game.addEventListener("submit", (event) => {
      event.preventDefault();
      var scoreCard = document.querySelector("#score-card");
      if (selectedChoice && selectedChoice.length >= 0) {
        if (selectedChoice.length == 0)
          selectedChoice.push(radioChoices[0].value); // set default value of default selected radio button
        let chosenSelection =
          selectedChoice[selectedChoice.length - 1].toString();

        // if the player choses the right answer
        if (chosenSelection == res.correct[i]) {
          let MAX_SCORE = MAX_QUESTIONS * CORRECT_BONUS; // define maximum possible score
          for (let idx = 1; idx <= 2; idx++) {
            while (scoreCount <= MAX_SCORE && questionsCounter < MAX_QUESTIONS) {
              scoreCount += CORRECT_BONUS; // increment the score
              score.style.color = "#66cc22";
              scoreCard.setAttribute("style", "transform: scale(1.1);");
              score.innerHTML = scoreCount;
              setTimeout(() => {
                score.style.color = "";
                scoreCard.setAttribute("style", "");
              }, 1000);
              questionsCounter++;
              break;
            }
            break;
          }
        } else {
          while (questionsCounter < MAX_QUESTIONS) {
            scoreCount -= 1; // decrement the score
            score.style.color = "#ff0f0f";
            scoreCard.setAttribute("style", "transform: scale(1.1);");
            score.innerHTML = scoreCount;
            setTimeout(() => {
              score.style.color = "";
              scoreCard.setAttribute("style", "");
            }, 1000);
            questionsCounter++;
            break;
          }
        }
      } else {
        window.alert("Select your answer");
      }
      selectedChoice.splice(0, selectedChoice.length);

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
          for (let j = 0; j < 4; j++) {
            radios.forEach((radio) => {
              radio.value = answerObj[j];
              j++;
            });
          }
        } while (i < 1);
      }

      console.log(questionsCounter);
      if (questionsCounter > MAX_QUESTIONS - 1) {
        // if all questions have been attended
        localStorage.setItem("recentScore", scoreCount);
        setTimeout(() => {
          return window.location.assign("./end.html");
        }, 1000);
      }
    });

    submit.addEventListener("click", () => {
      var defaultRadioBtn = document.getElementById("ch1");
      defaultRadioBtn.checked = true; // set default radio button to "checked" state after submit
    });

  },
  (err) => console.log(err)
);
