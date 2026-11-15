function setup() {
    const canvas = createCanvas(800, 360);
    canvas.parent("illustration");
    canvas.elt.setAttribute("role", "presentation");
    noStroke();
}

function draw() {
    background("#dff3ea");

    fill("#c8eadd");
    ellipse(90, 300, 240, 100);
    ellipse(690, 325, 280, 120);
    drawSparkle(105, 85, 15, "#f7bd61");
    drawSparkle(700, 75, 12, "#f7bd61");
    drawSparkle(625, 275, 9, "#fffdf7");

    const bob = sin(frameCount * 0.035) * 5;
    const scene = document.body.dataset.scene;

    if (scene === "anatomy") {
        drawPhage(400, 183 + bob, 1.35);
        drawSparkle(235, 120, 11, "#f7bd61");
        drawSparkle(565, 225, 13, "#fffdf7");
    } else if (scene === "hunting") {
        drawPhage(252, 183 + bob, 1.05);
        drawBacterium(567, 185, 1.15);
        drawSparkle(410, 145, 12, "#f7bd61");
        drawSparkle(420, 230, 9, "#fffdf7");
    } else if (scene === "saviors") {
        drawBacterium(282, 188, 1.05);
        drawPhage(550, 183 + bob, 1.08);
        drawHeart(415, 125 + bob, 18);
        drawSparkle(680, 250, 12, "#fffdf7");
    } else {
        drawPhage(280, 185 + bob, 1.1);
        drawBacterium(555, 190, 1.12);
        drawHeart(425, 126 + bob, 17);
    }
}

function drawPhage(x, y, size) {
    push();
    translate(x, y);
    scale(size);
    stroke("#40536a");
    strokeWeight(4);
    strokeJoin(ROUND);
    fill("#70c9be");

    beginShape();
    for (let i = 0; i < 6; i++) {
        const angle = -PI / 2 + i * TWO_PI / 6;
        vertex(cos(angle) * 51, -77 + sin(angle) * 48);
    }
    endShape(CLOSE);

    noStroke();
    fill("#fffdf7");
    circle(-15, -81, 8);
    circle(15, -81, 8);
    fill("#40536a");
    circle(-14, -80, 3.5);
    circle(16, -80, 3.5);
    noFill();
    stroke("#40536a");
    strokeWeight(3);
    arc(0, -70, 23, 16, 0.15, PI - 0.15);

    line(0, -29, 0, 29);
    line(-12, -27, 12, -27);
    line(-12, 21, 12, 21);
    line(0, 29, 0, 43);
    line(-13, 35, 13, 35);
    noFill();
    bezier(0, 42, -4, 57, -22, 57, -30, 78);
    bezier(0, 42, 4, 57, 22, 57, 30, 78);
    bezier(-6, 42, -12, 54, -13, 62, -10, 78);
    bezier(6, 42, 12, 54, 13, 62, 10, 78);
    pop();
}

function drawBacterium(x, y, size) {
    push();
    translate(x, y);
    scale(size);
    noFill();
    stroke("#e8816c");
    strokeWeight(4);
    bezier(-52, -18, -80, -42, -76, 15, -97, 8);
    bezier(53, 12, 80, -8, 76, 46, 99, 34);

    fill("#f59a81");
    stroke("#40536a");
    rectMode(CENTER);
    rect(0, 0, 118, 76, 38);
    noStroke();
    fill("#ffd3a6");
    circle(-35, -20, 10);
    circle(35, 17, 8);
    circle(-28, 22, 6);
    fill("#40536a");
    circle(-14, -4, 6);
    circle(14, -4, 6);
    noFill();
    stroke("#40536a");
    strokeWeight(3);
    arc(0, 3, 22, 17, 0.1, PI - 0.1);
    pop();
}

function drawSparkle(x, y, radius, color) {
    push();
    translate(x, y);
    noStroke();
    fill(color);
    beginShape();
    vertex(0, -radius);
    vertex(radius * 0.28, -radius * 0.28);
    vertex(radius, 0);
    vertex(radius * 0.28, radius * 0.28);
    vertex(0, radius);
    vertex(-radius * 0.28, radius * 0.28);
    vertex(-radius, 0);
    vertex(-radius * 0.28, -radius * 0.28);
    endShape(CLOSE);
    pop();
}

function drawHeart(x, y, size) {
    push();
    translate(x, y);
    rotate(PI);
    noStroke();
    fill("#f58b78");
    beginShape();
    vertex(0, size);
    bezierVertex(-size * 1.5, size * 0.1, -size, -size, 0, -size * 0.35);
    bezierVertex(size, -size, size * 1.5, size * 0.1, 0, size);
    endShape(CLOSE);
    pop();
}
