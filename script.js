
let ball;

function setup() {
    // Create canvas and attach it to the play window
    let canvas = createCanvas(800, 500);
    canvas.parent("play-window");

    ball = {
        x: width / 2,
        y: height / 2,
        size: 50,
        speedX: 3,
        speedY: 2
    };
}

function draw() {
    background(25, 28, 40);

    // Move ball
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Bounce off walls
    if (ball.x < ball.size / 2 || ball.x > width - ball.size / 2) {
        ball.speedX *= -1;
    }

    if (ball.y < ball.size / 2 || ball.y > height - ball.size / 2) {
        ball.speedY *= -1;
    }

    // Draw ball
    noStroke();
    fill(100, 180, 255);
    circle(ball.x, ball.y, ball.size);
}

function mousePressed() {
    // Move ball to mouse position
    if (
        mouseX >= 0 && mouseX <= width &&
        mouseY >= 0 && mouseY <= height
    ) {
        ball.x = mouseX;
        ball.y = mouseY;
    }
}
