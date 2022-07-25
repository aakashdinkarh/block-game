let ball_x, ball_y, ball_dia, ball_dx, ball_dy;
let paddle_x, paddle_y, paddle_width, paddle_height, paddle_dx;
let paddle_left, paddle_right;
let brick_width, brick_height, margin;
let bricks = [];
let ball = {};
let score;
let lives;
let speed_change;
let ball_size_change;
let ball_color;
let intialTextSize;

function change_paddle_width(n) {
  paddle_width = n;
}
function change_ball_speed(n) {
  ball_dx += n;
  ball_dy += n;
}
function change_ball_dia(n) {
  ball_dia -= n;
}

function setup() {
  createCanvas(400, 400); //background
  intialTextSize = textSize();

  //ball
  ball_x = width / 2;
  ball_y = height / 2;
  ball_dx = 1;
  ball_dy = 1;
  ball_dia = 20;
  ball_color = "orange";

  //paddle
  paddle_width = 100;
  paddle_height = 20;
  paddle_x = width / 2 - paddle_width / 2;
  paddle_y = height - paddle_height;
  paddle_dx = 5;

  //score
  score = 0;

  //speed change
  speed_change = 0;

  //ball size change
  ball_size_change = true;

  //lives
  lives = 3;

  //bricks
  brick_width = 88;
  brick_height = 20;
  margin = 10;
  for (let i = 0; i < 4; i++) {
    bricks.push([]);
    for (let j = 0; j < 4; j++) {
      bricks[i].push({
        x: (brick_width + margin) * j + 10,
        y: (brick_height + margin) * i + 40,
        status: "show",
        point: 4 - i,
      });
    }
  }
}

function draw() {
  background("black");

  //ball
  fill(ball_color);
  circle(ball_x, ball_y, ball_dia);

  //paddle
  fill("white");
  rect(paddle_x, paddle_y, paddle_width, paddle_height);

  // fill("white");
  text("Score: " + score, 20, 20); //score text
  text("Lives: " + lives, width - 60, 20); //lives text

  //paddle range
  paddle_left = paddle_x;
  paddle_right = paddle_x + paddle_width;

  //ball motion
  ball_x += ball_dx;
  ball_y += ball_dy;

  //ball range points
  ball = {
    right: ball_x + ball_dia / 2,
    left: ball_x - ball_dia / 2,
    top: ball_y - ball_dia / 2,
    bottom: ball_y + ball_dia / 2,
  };

  //based on score modifications
  if (score > 4 && score <= 8) {
    if (speed_change === 0) {
      speed_change = 1;
      change_ball_speed(1);
    }
  } else if (score > 8 && score <= 15) {
    change_paddle_width(80);
    if (speed_change === 1) {
      speed_change = 2;
      change_ball_speed(1);
    }
  } else if (score > 15 && score <= 30) {
    if (ball_size_change) {
      ball_size_change = false;
      ball_color = "#ffba6e";
      change_ball_dia(10);
    }
  } else if (score > 30) {
    change_paddle_width(40);
  }

  //bricks
  for (let i = 0; i < 4; i++) {
    if (i == 0) fill("blue");
    else if (i == 1) fill("orange");
    else if (i == 2) fill("skyblue");
    else if (i == 3) fill("pink");
    for (let j = 0; j < 4; j++) {
      if (bricks[i][j].status === "show") {
        rect(bricks[i][j].x, bricks[i][j].y, brick_width, brick_height);
        if (
          //ball top touch
          ball.top >= bricks[i][j].y &&
          ball.top <= bricks[i][j].y + brick_height &&
          bricks[i][j].x <= ball_x &&
          ball_x <= bricks[i][j].x + brick_width
        ) {
          bricks[i][j].status = "hide";
          score += bricks[i][j].point;
          ball_dy = -ball_dy;
        } else if (
          //ball bottom touch
          ball.bottom >= bricks[i][j].y &&
          ball.bottom <= bricks[i][j].y + brick_height &&
          bricks[i][j].x <= ball_x &&
          ball_x <= bricks[i][j].x + brick_width
        ) {
          bricks[i][j].status = "hide";
          score += bricks[i][j].point;
          ball_dy = -ball_dy;
        } else if (
          //ball left touch
          ball.left <= bricks[i][j].x + brick_width &&
          ball.left >= bricks[i][j].x &&
          bricks[i][j].y <= ball_y &&
          ball_y <= bricks[i][j].y + brick_height
        ) {
          bricks[i][j].status = "hide";
          score += bricks[i][j].point;
          ball_dx = -ball_dx;
        } else if (
          //ball right touch
          ball.right <= bricks[i][j].x + brick_width &&
          ball.right >= bricks[i][j].x &&
          bricks[i][j].y <= ball_y &&
          ball_y <= bricks[i][j].y + brick_height
        ) {
          bricks[i][j].status = "hide";
          score += bricks[i][j].point;
          ball_dx = -ball_dx;
        }
      }
    }
  }

  //wall bounce
  if (ball.right === width || ball.left === 0)
    //right & left wall
    ball_dx = -ball_dx;
  else if (ball.right > width) {
    ball_x = width - ball_dia / 2 - ball_dx;
  } else if (ball.left < 0) {
    ball_x = ball_dia / 2 - ball_dx;
  }
  if (ball.top === 0) {
    //top wall
    ball_dy = -ball_dy;
  } else if (ball.top < 0) {
    ball_y = ball_dia / 2 - ball_dy;
  }
  if (ball.bottom >= height) {
    //bottom wall
    ball_y = height - ball_dia / 2;
    ball_dy = -ball_dy;
    if (lives > 0) {
      ball_x = width / 2;
      ball_y = height / 2 + ball_dia;
    }
    switch (lives) {
      case 3:
        lives = 2;
        break;
      case 2:
        lives = 1;
        break;
      case 1:
        lives = 0;
        break;
    }
  }

  //Game Over
  if (lives === 0) {
    ball_dx = 0;
    ball_dy = 0;
    fill("red");
    textSize(16);
    textAlign(CENTER);
    text("Game Over", width / 2, height / 2);
    textAlign(LEFT);
    textSize(intialTextSize);
  }

  //Game Won
  if (score === 40) {
    ball_dx = 0;
    ball_dy = 0;
    fill("green");
    textSize(16);
    textAlign(CENTER);
    text("You Won!!!", width / 2, height / 2);
    textAlign(LEFT);
    textSize(intialTextSize);
  }

  //paddle motion
  if (keyIsDown(RIGHT_ARROW) && paddle_x + paddle_width <= width)
    paddle_x += paddle_dx;
  if (keyIsDown(LEFT_ARROW) && paddle_x >= 0) paddle_x -= paddle_dx;

  //paddle bounce
  if (
    // top bounce
    ball_x >= paddle_left &&
    ball_x <= paddle_right &&
    ball.bottom >= height - paddle_height
  ) {
    ball_dy = -ball_dy;
  }
  //left right bounce
  if (
    ball_y >= height - paddle_height &&
    ball_y < height &&
    (ball.left === paddle_x + paddle_width || ball.right === paddle_x)
  ) {
    ball_dx = -ball_dx;
  }
}
