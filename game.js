const TABLE_HEIGHT = 400;
const TABLE_WIDTH = 600;
const BALL_WIDTH = 40;
const PADDLE_WIDTH = 8;
const PADDLE_HEIGHT = 80;
const STORAGE_KEY = "pong-score";

let drawInterval;

let topScore = localStorage.getItem(STORAGE_KEY) ? localStorage.getItem(STORAGE_KEY) : 0;
let score = 0;

let ballPosition = [300, 200];
let ballVelocity = [2, 1];

let paddleHeight = 160;

let table = document.getElementById("pong-table");
let scoreBox = document.getElementById("score");
let topScoreBox = document.getElementById("top-score");

let ball = document.createElement('div');
ball.id = "ball";

let paddle = document.createElement('div');
paddle.id = "paddle";

let messageBox = document.createElement('h1');
messageBox.classList = "message-box";
messageBox.innerText = "READY?"
table.appendChild(messageBox);

scoreBox.innerText = score;
topScoreBox.innerText = topScore;

document.addEventListener("keydown", movePaddle) 

let audio1 = new Audio("assets/beep.mp3");
let audio2 = new Audio("assets/ping.mp3");
let audio3 = new Audio("assets/end.mp3");

function ballAnimation() {
    ballPosition[0] += ballVelocity[0];
    ballPosition[1] += ballVelocity[1];
    ball.style.left = ballPosition[0] + "px";
    ball.style.top = ballPosition[1] + "px";

    if (ballPosition[0] <= PADDLE_WIDTH && 
        (ballPosition[1] + (BALL_WIDTH / 2) >= paddleHeight && ballPosition[1] + (BALL_WIDTH / 2) <= paddleHeight + PADDLE_HEIGHT)) {
        audio1.play();
        ballVelocity[0] =  - (ballVelocity[0] + ballVelocity[0] * 0.1);
        ballVelocity[1] += ballVelocity[1] * 0.1;
    }

    if ((ballPosition[1] >= TABLE_HEIGHT - BALL_WIDTH) ||
        (ballPosition[1] <= 0)) {
        ballVelocity[1] = - ballVelocity[1];
    } 

    if (ballPosition[0] + BALL_WIDTH >= TABLE_WIDTH) {
        ballVelocity[0] =  - ballVelocity[0];
        audio2.play();
        score += 1;
        scoreBox.innerText = score;
    } else if (ballPosition[0] <= 0) {
        audio3.play();
        endGame();
    }
}

function movePaddle(e) {
    if (e.key === "ArrowUp" && paddleHeight > 0) {
        paddleHeight -= 10;
    } else if (e.key === "ArrowDown" && paddleHeight < TABLE_HEIGHT - PADDLE_HEIGHT) {
        paddleHeight += 10;
    }

    paddle.style.top = paddleHeight + "px";
}

function startGame() {
    table.innerHTML = "";
    table.appendChild(ball);
    table.appendChild(paddle);
    
    score = 0;
    scoreBox.innerText = score;

    ballPosition = [400, (Math.random() * 320) + 40];

    ballVelocity[0] = - Math.random() * 4;
    ballVelocity[1] = - Math.random() * 3;

    paddleHeight = PADDLE_HEIGHT * 2;

    if (!drawInterval) {
        drawInterval = setInterval(ballAnimation, 10);
    }    
}

function endGame() {
    table.innerHTML = "";
    messageBox.innerText = "GAME OVER";
    table.appendChild(messageBox);
    clearInterval(drawInterval);
    drawInterval = undefined;
    
    if (score > topScore) {
        localStorage.setItem(STORAGE_KEY, score);
        topScore = score;
        topScoreBox.innerText = topScore;
    }

    paddleHeight = PADDLE_HEIGHT * 2;
    paddle.style.top = paddleHeight + "px";
}

function clearScore() {
    localStorage.removeItem(STORAGE_KEY);
    topScore = 0;
    topScoreBox.innerText = topScore;
}