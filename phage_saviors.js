let ball;

function setup() {
    const canvas = createCanvas(800, 360);
    canvas.parent("play-window");
    canvas.elt.setAttribute("aria-label", "A test ball bouncing in the Level 3 play window.");
    ball = { x: width / 2, y: height / 2, diameter: 40, speedX: 3, speedY: 2 };
}

function draw() {
    background("#dff3ea");
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    if (ball.x < ball.diameter / 2 || ball.x > width - ball.diameter / 2) {
        ball.speedX *= -1;
    }
    if (ball.y < ball.diameter / 2 || ball.y > height - ball.diameter / 2) {
        ball.speedY *= -1;
    }

    noStroke();
    fill("#f59a81");
    circle(ball.x, ball.y, ball.diameter);
}
