var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

let x = canvas.width / 2;
let y = canvas.height - 30;
let ballRadius = 10;
let dx = 2;
let dy = -2;
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = canvas.width / paddleWidth / 2;
let paddleY = canvas.height - paddleHeight;
let intervalTime = 10;
let rightKeyPressed = false; // D key
let leftKeyPressed = false; // A key

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
  // y + dy + ballRadius > canvas.height - paddleHeight (bouncing bottom)

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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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

setInterval(draw, intervalTime);
