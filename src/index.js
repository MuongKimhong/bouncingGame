var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var x = canvas.width / 2;
var y = canvas.height / 2;
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
var runGameInterval = null;
var gameIsInProgress = false;
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
  borderColor: "#0095DD",
};
var brickColums = 3;
var brickRows = 3;

canvas.addEventListener("mousemove", mouseMoveEventHandler);
canvas.addEventListener("mousedown", mouseDownEventHandler);

function mouseDownEventHandler(event) {
  var r = canvas.getBoundingClientRect();
  var mouseX = event.clientX - r.left;
  var mouseY = event.clientY - r.top;

  if (
    checkMouseIsOverStartGameButtonForGameOver(mouseX, mouseY) == true ||
    checkMouseIsOverStartGameButton(mouseX, mouseY) == true
  ) {
    gameOver = false;
    gameIsInProgress = true;
    runGameInterval = setInterval(draw, intervalTime);
  } else {
    return;
  }
}

function mouseMoveEventHandler(event) {
  var r = canvas.getBoundingClientRect();
  var mouseX = event.clientX - r.left;
  var mouseY = event.clientY - r.top;

  var mouseIsOver = false;

  if (gameOver == true && gameIsInProgress == false) {
    mouseIsOver = checkMouseIsOverStartGameButtonForGameOver(mouseX, mouseY);
  } else if (gameOver == false && gameIsInProgress == false) {
    mouseIsOver = checkMouseIsOverStartGameButton(mouseX, mouseY);
  }

  if (mouseIsOver == true) startGameButtonPosition.borderColor = "red";
  else startGameButtonPosition.borderColor = "#0095DD";

  if (
    (gameIsInProgress == false && gameOver == true) ||
    (gameIsInProgress == false && gameOver == false)
  )
    draw();
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
  else if (y + dy + ballRadius > canvas.height) {
    gameOver = true;
    gameIsInProgress = false;
    resetBallPosition();
  }

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

function drawStartGameButtonForGameOver() {
  ctx.font = "20px serif";
  ctx.fillText(
    "Play Game",
    startGameButtonPosition.textX(),
    startGameButtonPosition.textY
  );

  ctx.beginPath();
  ctx.lineWidth = "3";
  ctx.strokeStyle = startGameButtonPosition.borderColor;
  ctx.rect(
    startGameButtonPosition.borderX(),
    startGameButtonPosition.borderY,
    startGameButtonPosition.borderWidth(),
    startGameButtonPosition.borderHeight
  );
  ctx.stroke();
}

function drawStartGameButton() {
  ctx.font = "20px serif";
  ctx.fillText(
    "Play Game",
    startGameButtonPosition.textX(),
    startGameButtonPosition.textY - 55
  );

  ctx.beginPath();
  ctx.lineWidth = "3";
  ctx.strokeStyle = startGameButtonPosition.borderColor;
  ctx.rect(
    startGameButtonPosition.borderX(),
    startGameButtonPosition.borderY - 55,
    startGameButtonPosition.borderWidth(),
    startGameButtonPosition.borderHeight
  );
  ctx.stroke();
}

function checkMouseIsOverStartGameButtonForGameOver(mouseX, mouseY) {
  let x = startGameButtonPosition.borderX();
  let y = startGameButtonPosition.borderY;
  let width = startGameButtonPosition.borderWidth();
  let height = startGameButtonPosition.borderHeight;

  if ( mouseX >= x && mouseY >= y && mouseX <= x + width && mouseY <= y + height) {
    return true;
  } else return false;
}

function checkMouseIsOverStartGameButton(mouseX, mouseY) {
  let x = startGameButtonPosition.borderX();
  let y = startGameButtonPosition.borderY - 55;
  let width = startGameButtonPosition.borderWidth();
  let height = startGameButtonPosition.borderHeight;

  if ( mouseX >= x && mouseY >= y && mouseX <= x + width && mouseY <= y + height) {
    return true;
  } else return false;
}

function resetBallPosition() {
  x = canvas.width / 2;
  y = canvas.height / 2;
  dx = 2;
  dy = -2;
}

function drawBrick(startX, startY, width, height) {
  ctx.beginPath();
  ctx.rect(startX, startY, width, height);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  var columnWidth = canvas.width / 3;
  var columnPaddingLeft = 5;
  var columnPaddingRight = 5;
  var startX = 0 + columnPaddingLeft;
  var startY = 20;
  var brickWidth = columnWidth - columnPaddingLeft - columnPaddingRight;
  var brickHeight = 10;

  // loop for rows
  for (let j = 0; j < 3; j++) {
    // loop for columns
    for (let i = 0; i < 3; i++) {
      drawBrick(startX, startY, brickWidth, brickHeight);
      startX = startX + columnWidth;
    }
    startX = 0 + columnPaddingLeft;
    startY = startY + 30;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0095DD";

  if (gameOver == true && gameIsInProgress == false) {
    drawGameOverText();
    gameIsInProgress = false;
    gameOver = true;
    drawStartGameButtonForGameOver();

    if (runGameInterval != null) {
      clearInterval(runGameInterval);
    }
  } else if (gameOver == false && gameIsInProgress == false) {
    drawStartGameButton();
  } else {
    if (gameIsInProgress == true) {
      drawPaddle();
      drawBall(ctx, canvas.width, canvas.height, x, y);
      drawBricks();

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
}

draw();
