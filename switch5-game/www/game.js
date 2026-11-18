
const grid = document.getElementById("grid");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const timerEl = document.getElementById("timer");
const levelEl = document.getElementById("level");
const messageEl = document.getElementById("message");
const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("startBtn");

let score = 0;
let best = Number(localStorage.getItem("switch5Best")) || 0;
let timeLeft = 5;
let timer;
let playing = false;
let oddIndex = 0;

bestEl.textContent = best;

function createRound() {
    const level = Math.floor(score / 5) + 1;
    const size = Math.min(3 + Math.floor(score / 5), 6);
    const total = size * size;

    const hue = Math.floor(Math.random() * 360);
    const difference = Math.max(8, 38 - score * 0.6);

    const normalColor = `hsl(${hue}, 75%, 55%)`;
    const oddColor = `hsl(${(hue + difference) % 360}, 75%, 55%)`;

    oddIndex = Math.floor(Math.random() * total);
    grid.innerHTML = "";

    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    for (let i = 0; i < total; i++) {
        const tile = document.createElement("button");
        tile.className = "tile";
        tile.style.background = i === oddIndex ? oddColor : normalColor;
        tile.setAttribute("aria-label", "Colour tile");

        tile.addEventListener("click", () => checkAnswer(i));

        grid.appendChild(tile);
    }

    levelEl.textContent = `LEVEL ${level}`;
}

function checkAnswer(index) {
    if (!playing) return;

    if (index === oddIndex) {
        score++;
        scoreEl.textContent = score;

        if (score > best) {
            best = score;
            localStorage.setItem("switch5Best", best);
            bestEl.textContent = best;
        }

        messageEl.textContent = "Correct! Keep going 🔥";
        createRound();
    } else {
        endGame();
    }
}

function startGame() {
    score = 0;
    timeLeft = 5;
    playing = true;

    scoreEl.textContent = score;
    timerEl.textContent = timeLeft.toFixed(1);
    messageEl.textContent = "Find the different colour!";

    overlay.classList.add("hidden");

    createRound();

    clearInterval(timer);

    timer = setInterval(() => {
        timeLeft -= 0.1;

        timerEl.textContent = Math.max(0, timeLeft).toFixed(1);

        if (timeLeft <= 0) {
            endGame();
        }
    }, 100);
}

function endGame() {
    if (!playing) return;

    playing = false;
    clearInterval(timer);

    overlay.classList.remove("hidden");

    overlay.querySelector(".emoji").textContent = "💥";
    overlay.querySelector("h2").textContent = "GAME OVER!";
    overlay.querySelector("p").textContent =
        `Your score: ${score}. Best score: ${best}. Try again!`;

    startBtn.textContent = "PLAY AGAIN";
}

startBtn.addEventListener("click", startGame);
