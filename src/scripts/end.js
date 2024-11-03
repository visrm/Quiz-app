window.onload = () => {
  const username = document.getElementById("username");
  const finalScore = document.getElementById("finalScore");
  const saveScore = document.getElementById("saveScoreBtn");
  const recentScore = localStorage.getItem("recentScore");
  const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

  finalScore.innerText = recentScore || "0";
  finalScore.setAttribute(
    "style",
    "display: grid; place-content: center; color: #56a5ef;"
  );

  username.addEventListener("keyup", () => {
    saveScore.disabled = !username.value;
  });

  saveHighScore = (e) => {
    e.preventDefault();
    const score = {
      name: username.value,
      score: recentScore,
    };
    highScores.push(score);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(5);
    localStorage.setItem("highScores", JSON.stringify(highScores));
    window.location.assign("/src/index.html");
  };
};
