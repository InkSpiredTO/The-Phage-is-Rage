const storySlides = [
    {
        caption: "Imagine a sunny beach, soft white sand, and gentle waves. Ouch! A broken seashell cuts the bottom of your foot. You brush it off and keep enjoying your vacation.",
        scene: drawBeachStory
    },
    {
        caption: "Over the next few days, you start to feel unwell. A headache and nausea make it hard to get out of bed.",
        scene: drawSickDay
    },
    {
        caption: "You feel so sick that you pass out. Someone brings you to the hospital for help.",
        scene: drawHospital
    },
    {
        caption: "Doctors try different antibiotics, but they do not stop the infection. It keeps spreading up your lower leg.",
        scene: drawAntibioticFailure
    },
    {
        caption: "The doctors explain that this is serious: you could lose your leg, or even die. They need to find another way to fight the infection.",
        scene: drawDoctorWarning
    }
];

let storyStarted = false;
let slideIndex = 0;
let startButton;
let previousButton;
let nextButton;
let captionElement;
let progressElement;

function setup() {
    const canvas = createCanvas(800, 360);
    canvas.parent("play-window");
    canvas.elt.setAttribute("aria-label", "An animated story about a beach cut and a serious infection.");

    startButton = document.getElementById("start-story");
    previousButton = document.getElementById("previous-slide");
    nextButton = document.getElementById("next-slide");
    captionElement = document.getElementById("story-caption");
    progressElement = document.getElementById("story-progress");

    startButton.addEventListener("click", startStory);
    previousButton.addEventListener("click", () => changeSlide(-1));
    nextButton.addEventListener("click", () => {
        if (slideIndex === storySlides.length - 1) {
            resetStory();
        } else {
            changeSlide(1);
        }
    });

    updateStoryControls();
}

function draw() {
    if (!storyStarted) {
        drawWelcomeScene();
        return;
    }

    storySlides[slideIndex].scene();
}

function startStory() {
    storyStarted = true;
    slideIndex = 0;
    updateStoryControls();
}

function changeSlide(direction) {
    slideIndex = constrain(slideIndex + direction, 0, storySlides.length - 1);
    updateStoryControls();
}

function resetStory() {
    storyStarted = false;
    slideIndex = 0;
    updateStoryControls();
}

function updateStoryControls() {
    startButton.hidden = storyStarted;
    previousButton.hidden = !storyStarted;
    nextButton.hidden = !storyStarted;
    captionElement.hidden = !storyStarted;
    progressElement.hidden = !storyStarted;

    if (storyStarted) {
        captionElement.textContent = storySlides[slideIndex].caption;
        progressElement.textContent = `Scene ${slideIndex + 1} of ${storySlides.length}`;
        previousButton.disabled = slideIndex === 0;
        nextButton.textContent = slideIndex === storySlides.length - 1 ? "Start over" : "Next scene";
    }
}

function drawWelcomeScene() {
    drawBeach();
    drawCloud(125 + sin(frameCount * 0.015) * 10, 70);
    drawCloud(625 + sin(frameCount * 0.012) * 12, 95);
    drawSparkle(180, 125, frameCount * 0.06);
    drawSparkle(645, 155, frameCount * 0.05);

    drawStickFigure(400, 244, {
        scale: 1.15,
        wave: true,
        shirt: "#f59a81",
        skin: "#bd7958"
    });

    noStroke();
    fill("#29364a");
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(30);
    text("A cut on the beach", width / 2, 45);
    textSize(17);
    textStyle(NORMAL);
    text("One tiny cut can lead to a big problem.", width / 2, 82);
}

function drawBeachStory() {
    drawBeach();
    drawCloud(126, 67);
    drawCloud(640, 92);

    drawStickFigure(365, 246, {
        walk: true,
        skin: "#bd7958",
        shirt: "#f59a81"
    });
    drawShell(520, 285);
    drawWave(90 + (frameCount % 90), 305, 18);

    noStroke();
    fill("#29364a");
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(22);
    text("A sunny day by the sea", width / 2, 38);
    textStyle(NORMAL);
}

function drawSickDay() {
    drawRoom("#f8edda");
    drawBed(125, 225, 360);
    drawStickFigure(300, 225, {
        lying: true,
        skin: "#bd7958",
        shirt: "#f59a81",
        sick: true
    });
    drawSickSymbols(518, 122);

    noStroke();
    fill("#29364a");
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(22);
    text("A few days later...", width / 2, 37);
    textStyle(NORMAL);
}

function drawHospital() {
    drawRoom("#e6f4f4");
    drawBed(74, 232, 405);
    drawStickFigure(270, 232, {
        lying: true,
        skin: "#bd7958",
        shirt: "#f59a81"
    });
    drawDoctor(565);
    drawMedicalCross(680, 93);

    noStroke();
    fill("#29364a");
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(22);
    text("At the hospital", width / 2, 37);
    textStyle(NORMAL);
}

function drawAntibioticFailure() {
    drawRoom("#e9f1ed");
    drawBed(78, 244, 400);
    drawStickFigure(270, 244, {
        lying: true,
        skin: "#bd7958",
        shirt: "#f59a81",
        sick: true
    });
    drawDoctor(570);
    drawMedicineBottle(490, 112);
    drawMedicineBottle(560, 112);
    drawBacteria(475, 185);
    drawBacteria(525, 175);
    drawBacteria(540, 210);

    noStroke();
    fill("#29364a");
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(20);
    text("The antibiotics aren't working", width / 2, 37);
    textStyle(NORMAL);
}

function drawDoctorWarning() {
    drawRoom("#f8edda");
    drawStickFigure(278, 262, {
        skin: "#bd7958",
        shirt: "#f59a81"
    });
    drawDoctor(505);
    drawSpeechBubble(641, 121, "This is serious.\nWe need another plan.");
    drawMedicalCross(122, 91);

    noStroke();
    fill("#29364a");
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(21);
    text("The doctors explain the danger", width / 2, 37);
    textStyle(NORMAL);
}

function drawBeach() {
    background("#bfe9ed");
    noStroke();
    fill("#ffcf79");
    circle(692, 70, 56);

    fill("#74c7d0");
    rect(0, 170, width, 105);
    fill("#fff8e9");
    ellipse(125, 200, 125, 27);
    ellipse(385, 218, 180, 30);
    ellipse(670, 190, 160, 25);

    fill("#f8dfa9");
    rect(0, 250, width, 110);
    fill("#efcb8d");
    ellipse(155, 322, 190, 35);
    ellipse(610, 300, 230, 27);
}

function drawRoom(wallColor) {
    background(wallColor);
    noStroke();
    fill("#d9e8e4");
    rect(0, 285, width, 75);
    fill("#c5e1e9");
    rect(608, 68, 115, 100, 12);
    stroke("#fffdf7");
    strokeWeight(6);
    line(665, 72, 665, 164);
    line(611, 118, 720, 118);
    noStroke();
}

function drawBed(x, y, bedWidth) {
    noStroke();
    fill("#fffdf7");
    rect(x, y - 45, bedWidth, 74, 20);
    fill("#9dcbd1");
    rect(x, y + 15, bedWidth, 22, 8);
    fill("#8a6554");
    rect(x + 15, y + 35, 12, 28, 4);
    rect(x + bedWidth - 27, y + 35, 12, 28, 4);
    fill("#fff8e9");
    rect(x + 22, y - 37, 76, 35, 12);
}


function drawStickFigure(x, y, options = {}) {
    const scale = options.scale || 1;
    const skin = options.skin || "#bd7958";
    const shirt = options.shirt || "#f59a81";

    const headX = x + (options.lying ? -44 : 0);
    const headY = y - (options.lying ? 26 : 100);
    const bodyX = x + (options.lying ? -12 : 0);
    const bodyY = y - (options.lying ? 18 : 63);

    // Head
    stroke("#29364a");
    strokeWeight(5 * scale);
    strokeCap(ROUND);
    fill(skin);
    circle(headX, headY, 38 * scale);

    // Body / shirt
    noStroke();
    fill(shirt);
    rect(
        bodyX - 18 * scale,
        bodyY - 5 * scale,
        36 * scale,
        48 * scale,
        12 * scale
    );

    // Arms
    stroke("#29364a");
    strokeWeight(5 * scale);

    if (options.lying) {
        line(
            bodyX + 16 * scale,
            bodyY + 9 * scale,
            bodyX + 61 * scale,
            bodyY + 14 * scale
        );
        line(
            bodyX + 16 * scale,
            bodyY + 26 * scale,
            bodyX + 58 * scale,
            bodyY + 30 * scale
        );
    } else if (options.wave) {
        line(
            bodyX - 10 * scale,
            bodyY + 8 * scale,
            bodyX - 31 * scale,
            bodyY + 29 * scale
        );
        line(
            bodyX + 10 * scale,
            bodyY + 8 * scale,
            bodyX + 29 * scale,
            bodyY - 18 * scale
        );
    } else {
        line(
            bodyX - 10 * scale,
            bodyY + 8 * scale,
            bodyX - 28 * scale,
            bodyY + 30 * scale
        );
        line(
            bodyX + 10 * scale,
            bodyY + 8 * scale,
            bodyX + 26 * scale,
            bodyY + 30 * scale
        );
    }

    // Legs - fixed position, no walking or movement
    if (!options.lying) {
        stroke("#29364a");
        strokeWeight(5 * scale);
        strokeCap(ROUND);

        // Straight, separated legs
        const leftHipX = bodyX - 7 * scale;
        const rightHipX = bodyX + 7 * scale;
        const leftFootX = options.straightLegs ? leftHipX : bodyX - 13 * scale;
        const rightFootX = options.straightLegs ? rightHipX : bodyX + 13 * scale;
        line(
            leftHipX,
            bodyY + 40 * scale,
            leftFootX,
            y + 3 * scale
        );

        line(
            rightHipX,
            bodyY + 40 * scale,
            rightFootX,
            y + 3 * scale
        );

        // Feet
        line(
            leftFootX,
            y + 3 * scale,
            leftFootX + 10 * scale,
            y + 3 * scale
        );

        line(
            rightFootX,
            y + 3 * scale,
            rightFootX + 10 * scale,
            y + 3 * scale
        );
    }

    // Face
    noStroke();
    fill("#29364a");

    circle(headX - 6 * scale, headY - 2 * scale, 3 * scale);
    circle(headX + 6 * scale, headY - 2 * scale, 3 * scale);

    // Facial expression
    noFill();
    stroke("#29364a");
    strokeWeight(2 * scale);

    if (options.sad || options.sick) {
        // Sad eyebrows
        line(
            headX - 11 * scale,
            headY - 10 * scale,
            headX - 4 * scale,
            headY - 7 * scale
        );

        line(
            headX + 11 * scale,
            headY - 10 * scale,
            headX + 4 * scale,
            headY - 7 * scale
        );

        // Downturned mouth
        arc(
            headX,
            headY + 13 * scale,
            13 * scale,
            10 * scale,
            PI,
            TWO_PI
        );
    } else {
        // Happy smile
        arc(
            headX,
            headY + 2 * scale,
            13 * scale,
            11 * scale,
            0,
            PI
        );
    }

    noStroke();
}


function drawCloud(x, y) {
    noStroke();
    fill("#fffdf7");
    ellipse(x, y, 65, 27);
    circle(x - 15, y - 9, 25);
    circle(x + 3, y - 15, 32);
    circle(x + 20, y - 5, 23);
}

function drawSparkle(x, y, rotation) {
    push();
    translate(x, y);
    rotate(rotation);
    noStroke();
    fill("#fffdf7");
    quad(0, -13, 4, 0, 0, 13, -4, 0);
    quad(-13, 0, 0, -4, 13, 0, 0, 4);
    pop();
}

function drawShell(x, y) {
    push();
    translate(x, y + sin(frameCount * 0.08) * 2);
    noStroke();
    fill("#f59a81");
    arc(0, 0, 35, 28, PI, TWO_PI, CHORD);
    stroke("#bd604f");
    strokeWeight(2);
    line(-12, 0, -7, -13);
    line(-4, 0, -2, -15);
    line(4, 0, 3, -15);
    line(12, 0, 8, -12);
    pop();
    drawSparkle(x + 21, y - 17, frameCount * 0.04);
}

function drawWave(x, y, size) {
    noFill();
    stroke("#fffdf7");
    strokeWeight(4);
    arc(x, y, size, size / 2, PI, TWO_PI);
    noStroke();
}

function drawSickSymbols(x, y) {
    noStroke();
    fill("#f3c45f");
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(31);
    text("*", x, y);
    text("~", x + 36, y + 27);
    text("~", x - 27, y + 42);
    textSize(18);
    text("headache", x, y + 72);
    textStyle(NORMAL);
}

function drawDoctor(x) {
    const groundY = 282;
    drawStickFigure(x, groundY, {
        scale: 0.95,
        skin: "#d99b76",
        shirt: "#fffdf7",
        straightLegs: true
    });
    noStroke();
    fill("#4aa99d");
    rect(x - 4, groundY - 52, 8, 24, 4);
    rect(x - 12, groundY - 44, 24, 8, 4);
}

function drawMedicalCross(x, y) {
    noStroke();
    fill("#4aa99d");
    rect(x - 7, y - 25, 14, 50, 5);
    rect(x - 25, y - 7, 50, 14, 5);
}

function drawMedicineBottle(x, y) {
    noStroke();
    fill("#9dcbd1");
    rect(x - 15, y - 12, 30, 48, 7);
    fill("#fffdf7");
    rect(x - 18, y - 20, 36, 12, 4);
    fill("#ed7762");
    circle(x, y + 7, 13);
    stroke("#fffdf7");
    strokeWeight(2);
    line(x - 4, y + 7, x + 4, y + 7);
    line(x, y + 3, x, y + 11);
    noStroke();
}

function drawBacteria(x, y) {
    noStroke();
    fill("#72b99e");
    ellipse(x, y, 25, 16);
    fill("#397d68");
    circle(x - 5, y, 3);
    circle(x + 2, y - 3, 3);
    circle(x + 6, y + 3, 3);
}

function drawSpeechBubble(x, y, message) {
    noStroke();
    fill("#fffdf7");
    rect(x - 106, y - 48, 212, 90, 18);
    triangle(x - 42, y + 39, x - 20, y + 39, x - 38, y + 58);
    fill("#29364a");
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(17);
    text(message, x, y - 3);
    textStyle(NORMAL);
}
