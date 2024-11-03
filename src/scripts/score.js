window.onload = () => {
  const scoreList = document.getElementById("score-list");
  const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

//   console.log(highScores);
  let i = 0;
  scoreList.innerHTML = highScores
    .map((score) => {
      i++;
      return `<tr><td>${i}</td><td>${score.name}</td><td>${score.score}</td></tr>`;
    })
    .join("");
};
