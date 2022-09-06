var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var x = canvas.width / 2;
var y = canvas.height - 30;
var ballRadius = 10;
var dx = 2;
var dy = -2;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = canvas.width / paddleWidth / 2;
var paddleY = canvas.height - paddleHeight;
var intervalTime = 10;
var rightKeyPressed = false; // D key
var leftKeyPressed = false; // A key
var gameOver = false;
var runGameInterval;
ctx.font = "20px serif";
var startGameButtonPosition = {
  textWidth: ctx.measureText("Play Game").width,
  textX: function () {
    return canvas.width / 2 - parseInt(this.textWidth) / 2;
  },
  textY: canvas.height / 2 + 60,
  borderX: function () {
    return canvas.width / 2 - parseInt(this.textWidth) / 2 - 10;
  },
  borderY: canvas.height / 2 + 35,
  borderWidth: function () {
    return parseInt(this.textWidth) + 20;
  },
  borderHeight: 38,
};

canvas.addEventListener("mousemove", mouseMoveEventHandler);

function mouseMoveEventHandler(event) {
  var r = canvas.getBoundingClientRect();
  var x = event.clientX - r.left;
  var y = event.clientY - r.top;
}

document.addEventListener("keydown", keyDownEventHandler, false);
document.addEventListener("keyup", keyUpEventHandler, false);

function keyDownEventHandler(e) {
  if (e.key == "d") rightKeyPressed = true;
  else if (e.key == "a") leftKeyPressed = true;
}

function keyUpEventHandler(e) {
  if (e.key == "d") rightKeyPressed = false;
  else if (e.key == "a") leftKeyPressed = false;
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function checkBallTouchPaddle() {
  if (
    y + dy + ballRadius > canvas.height - paddleHeight &&
    x + ballRadius > paddleX &&
    x + ballRadius < paddleX + paddleWidth
  ) {
    return true;
  } else return false;
}

function checkBallBouncing() {
  // check bouncing top edge
  if (y + dy - ballRadius < 0 || checkBallTouchPaddle() == true) {
    dy = -dy;
  }
  // game over
  else if (y + dy + ballRadius > canvas.height) gameOver = true;

  // check bouncing right and left edge
  if (x + dx + ballRadius > canvas.width || x + dx - ballRadius < 0) {
    dx = -dx;
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();

  checkBallBouncing();
}

function drawGameOverText() {
  ctx.font = "48px serif";
  let textWidth = ctx.measureText("Game Over").width;
  ctx.fillText(
    "Game over",
    canvas.width / 2 - parseInt(textWidth) / 2,
    canvas.height / 2
  );
}

function drawStartGameButton() {
  ctx.font = "20px serif";
  ctx.fillText(
    "Play Game",
    startGameButtonPosition.textX(),
    startGameButtonPosition.textY
  );

  ctx.beginPath();
  ctx.lineWidth = "3";
  ctx.strokeStyle = "#0095DD";
  ctx.rect(
    startGameButtonPosition.borderX(),
    startGameButtonPosition.borderY,
    startGameButtonPosition.borderWidth(),
    startGameButtonPosition.borderHeight
  );
  ctx.stroke();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameOver == true) {
    clearInterval(runGameInterval);
    drawGameOverText();
    drawStartGameButton();
  } else {
    drawPaddle();
    let ball = drawBall(ctx, canvas.width, canvas.height, x, y);

    // check if paddle bounce right
    if (rightKeyPressed == true) {
      paddleX += 7;
      if (paddleX + paddleWidth > canvas.width) {
        paddleX = canvas.width - paddleWidth;
      }
    }
    // check if paddle bounce left
    if (leftKeyPressed == true) {
      paddleX -= 7;
      if (paddleX < 0) {
        paddleX = 0;
      }
    }

    x += dx;
    y += dy;
  }
}

runGameInterval = setInterval(draw, intervalTime);
