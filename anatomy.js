const referencePhotoInfo = {
    resistance: {
        url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ab/Antibiotic_sensitivity_and_resistance.jpg/960px-Antibiotic_sensitivity_and_resistance.jpg",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Antibiotic_sensitivity_and_resistance.jpg",
        title: "Antibiotic sensitivity and resistance",
        credit: "Dr Graham Beards · CC BY-SA 4.0",
        description: "Petri dishes showing bacterial sensitivity and resistance to antibiotics."
    },
    bacteria: {
        url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bc/E_coli_at_10000x%2C_original.jpg/960px-E_coli_at_10000x%2C_original.jpg",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:E_coli_at_10000x,_original.jpg",
        title: "E. coli at 10,000×",
        credit: "Eric Erbe and Christopher Pooley, USDA ARS · Public domain",
        description: "Electron micrograph of a cluster of E. coli bacteria."
    },
    phage: {
        url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Enterobacteria_phage_T2_transmission_electron_micrograph.jpg/960px-Enterobacteria_phage_T2_transmission_electron_micrograph.jpg",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Enterobacteria_phage_T2_transmission_electron_micrograph.jpg",
        title: "T2 bacteriophage electron micrograph",
        credit: "SnaxMikn · CC BY-SA 4.0",
        description: "Transmission electron micrograph of a T2 bacteriophage."
    }
};

const beachStorySlides = [
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

const antibioticExplainerSlides = [
    {
        caption: "What can make antibiotics stop working? Antibiotic resistance (ABR) means some bacteria can survive medicines that would usually kill them. An infection caused by an antibiotic-resistant strain can be harder to treat.",
        scene: drawResistanceIntro,
        photo: "resistance"
    },
    {
        caption: "How does resistance spread? Antibiotics may kill susceptible bacteria, while resistant bacteria survive and multiply. Overuse or misuse can increase this selective pressure, so resistance becomes more common through natural selection.",
        scene: drawNaturalSelection,
        photo: "bacteria"
    },
    {
        caption: "There is hope: bacteriophages, or phages, are viruses that naturally infect and attack bacteria. Researchers are studying them as another way to fight some bacterial infections.",
        scene: drawPhageIntro,
        photo: "phage"
    },
    {
        caption: "In some reported treatments, phages have been given directly into the bloodstream, with few side effects reported in those cases. Phage therapy is still being studied, and its risks and benefits depend on the patient and infection.",
        scene: drawPhageTreatment,
        photo: "phage"
    }
];

const phageConceptSlides = [
    {
        caption: "Bacteriophages are found wherever bacteria live—including the gut, on skin, and in many other places.",
        scene: drawPhageEverywhere,
        photo: "bacteria"
    },
    {
        caption: "Phages use proteins on their tail fibers like keys. These proteins help a phage attach to a matching bacterium and infect it.",
        scene: drawPhageKeys,
        photo: "phage"
    },
    {
        caption: "A phage's keys usually fit only certain bacteria. So a phage often infects a narrow range of bacteria or strains—not every kind.",
        scene: drawPhageSpecificity,
        photo: "phage"
    }
];

const phageMatchingGameSlide = {
    caption: "In this simplified game, colors stand for which bacteria a phage can target. Choose your phage's color, then catch five bacteria of the same color!",
    scene: drawPhageMatchingGame,
    game: true
};

const storySlides = [
    ...beachStorySlides,
    ...antibioticExplainerSlides,
    ...phageConceptSlides,
    phageMatchingGameSlide
];
const beachStoryStartIndex = storySlides.findIndex((slide) => slide.scene === drawBeachStory);

const BEACH_GROUND_Y = 250;
const ROOM_GROUND_Y = 285;
const PHAGE_GAME_COLORS = {
    teal: { label: "Green", value: "#4aa99d" },
    coral: { label: "Pink", value: "#df62ed" },
    purple: { label: "Purple", value: "#8b6fc1" }
};
const PHAGE_GAME_SEQUENCE = ["coral", "teal", "purple", "teal", "coral", "purple"];
const PHAGE_GAME_TARGET = 5;

let storyStarted = false;
let slideIndex = 0;
let startButton;
let previousButton;
let nextButton;
let captionElement;
let progressElement;
let imageCreditElement;
let imageSourceLink;
let imageAttributionElement;
let imageStatusElement;
let canvasElement;
let phageGameControls;
let phageGameStatus;
let phageGameRestartButton;
let phageColorButtons = [];
let referencePhotos = {};
const failedReferencePhotos = new Set();
const phageGame = {
    selectedColor: "teal",
    score: 0,
    won: false,
    message: "",
    bacteria: [],
    nextBacterium: 0
};

function preload() {
    for (const [key, photoInfo] of Object.entries(referencePhotoInfo)) {
        referencePhotos[key] = loadImage(
            photoInfo.url,
            undefined,
            () => failedReferencePhotos.add(key)
        );
    }
}

function setup() {
    const canvas = createCanvas(800, 360);
    canvas.parent("play-window");
    canvas.elt.setAttribute("aria-label", "An animated story about a beach cut and a serious infection.");
    canvasElement = canvas.elt;

    startButton = document.getElementById("start-story");
    previousButton = document.getElementById("previous-slide");
    nextButton = document.getElementById("next-slide");
    captionElement = document.getElementById("story-caption");
    progressElement = document.getElementById("story-progress");
    imageCreditElement = document.getElementById("story-image-credit");
    imageSourceLink = document.getElementById("story-image-source");
    imageAttributionElement = document.getElementById("story-image-attribution");
    imageStatusElement = document.getElementById("story-image-status");
    phageGameControls = document.getElementById("phage-game-controls");
    phageGameStatus = document.getElementById("phage-game-status");
    phageGameRestartButton = document.getElementById("phage-game-restart");
    phageColorButtons = Array.from(document.querySelectorAll("[data-phage-color]"));

    startButton.addEventListener("click", startStory);
    previousButton.addEventListener("click", () => changeSlide(-1));
    nextButton.addEventListener("click", () => {
        if (slideIndex === storySlides.length - 1) {
            resetStory();
        } else {
            changeSlide(1);
        }
    });
    phageColorButtons.forEach((button) => {
        button.addEventListener("click", () => selectPhageColor(button.dataset.phageColor));
    });
    phageGameRestartButton.addEventListener("click", startPhageGame);

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
    slideIndex = beachStoryStartIndex;
    updateStoryControls();
}

function changeSlide(direction) {
    const nextIndex = constrain(slideIndex + direction, 0, storySlides.length - 1);
    if (nextIndex !== slideIndex && storySlides[nextIndex].game) {
        startPhageGame();
    }
    slideIndex = nextIndex;
    updateStoryControls();
}

function startPhageGame() {
    phageGame.selectedColor = "teal";
    phageGame.score = 0;
    phageGame.won = false;
    phageGame.nextBacterium = 4;
    phageGame.message = `Matches: 0/${PHAGE_GAME_TARGET}. Choose a phage color and catch matching bacteria.`;
    phageGame.bacteria = Array.from({ length: 4 }, (_, index) => ({
        x: 790 + index * 235,
        y: 150 + (index % 3) * 28,
        phase: index * 1.4,
        speed: 2.4 + (index % 2) * 0.35,
        color: PHAGE_GAME_SEQUENCE[index],
        checked: false,
        eaten: false
    }));
    updatePhageColorButtons();
    updatePhageGameStatus();
}

function selectPhageColor(colorId) {
    if (!Object.prototype.hasOwnProperty.call(PHAGE_GAME_COLORS, colorId)) {
        throw new Error(`Unknown phage color: ${colorId}`);
    }

    phageGame.selectedColor = colorId;
    phageGame.message = `Your phage is ${PHAGE_GAME_COLORS[colorId].label}. Catch bacteria of the same color.`;
    updatePhageColorButtons();
    updatePhageGameStatus();
}

function updatePhageColorButtons() {
    phageColorButtons.forEach((button) => {
        button.setAttribute(
            "aria-pressed",
            String(button.dataset.phageColor === phageGame.selectedColor)
        );
    });
}

function updatePhageGameStatus() {
    if (!phageGameStatus) {
        return;
    }
    phageGameStatus.textContent = phageGame.message;
    phageGameRestartButton.hidden = !phageGame.won;
}

function updatePhageGame() {
    if (phageGame.won) {
        return;
    }

    const phageX = 155;
    const phageY = 192;
    phageGame.bacteria.forEach((bacterium) => {
        if (phageGame.won) {
            return;
        }
        if (bacterium.x < -60) {
            const rightmost = Math.max(...phageGame.bacteria.map((item) => item.x));
            bacterium.x = Math.max(width + 40, rightmost + 190);
            bacterium.color = PHAGE_GAME_SEQUENCE[
                phageGame.nextBacterium % PHAGE_GAME_SEQUENCE.length
            ];
            bacterium.phase = phageGame.nextBacterium * 1.4;
            bacterium.checked = false;
            bacterium.eaten = false;
            phageGame.nextBacterium += 1;
            return;
        }

        bacterium.x -= bacterium.speed;
        bacterium.y = 178 + sin(frameCount * 0.045 + bacterium.phase) * 30;
        if (
            !bacterium.checked &&
            Math.abs(bacterium.x - phageX) < 42 &&
            Math.abs(bacterium.y - phageY) < 54
        ) {
            bacterium.checked = true;
            if (bacterium.color === phageGame.selectedColor) {
                bacterium.eaten = true;
                bacterium.x = -100;
                phageGame.score += 1;
                phageGame.won = phageGame.score >= PHAGE_GAME_TARGET;
                phageGame.message = phageGame.won
                    ? `Great matching! You caught ${PHAGE_GAME_TARGET} bacteria.`
                    : `Match! ${phageGame.score}/${PHAGE_GAME_TARGET} bacteria caught.`;
                if (phageGame.won) {
                    markLevelComplete("anatomy");
                }
            } else {
                phageGame.message = `That bacterium is ${PHAGE_GAME_COLORS[bacterium.color].label}. Change your phage color to match.`;
            }
            updatePhageGameStatus();
        }
    });
}

function resetStory() {
    storyStarted = false;
    slideIndex = beachStoryStartIndex;
    updateStoryControls();
}

function updateStoryControls() {
    startButton.hidden = storyStarted;
    previousButton.hidden = !storyStarted;
    nextButton.hidden = !storyStarted;
    captionElement.hidden = !storyStarted;
    progressElement.hidden = !storyStarted;

    if (storyStarted) {
        const slide = storySlides[slideIndex];
        const photoInfo = slide.photo ? referencePhotoInfo[slide.photo] : null;
        const isGame = slide.game === true;
        captionElement.textContent = slide.caption;
        progressElement.textContent = `Scene ${slideIndex + 1} of ${storySlides.length}`;
        previousButton.disabled = slideIndex === 0;
        nextButton.textContent = slideIndex === storySlides.length - 1 ? "Start over" : "Next scene";
        phageGameControls.hidden = !isGame;
        phageGameStatus.hidden = !isGame;
        phageGameRestartButton.hidden = !isGame || !phageGame.won;
        if (isGame) {
            phageGameStatus.textContent = phageGame.message;
            updatePhageColorButtons();
        }
        imageCreditElement.hidden = !photoInfo;
        imageStatusElement.hidden = !slide.photo || !failedReferencePhotos.has(slide.photo);
        imageStatusElement.textContent = imageStatusElement.hidden
            ? ""
            : "This reference image could not load. Check your connection or open its source link below.";
        phageGameControls.hidden = !isGame;
        phageGameStatus.hidden = !isGame;
        if (photoInfo) {
            imageSourceLink.href = photoInfo.sourceUrl;
            imageSourceLink.textContent = photoInfo.title;
            imageAttributionElement.textContent = photoInfo.credit;
            canvasElement.setAttribute("aria-label", photoInfo.description);
        } else {
            canvasElement.setAttribute(
                "aria-label",
                isGame
                    ? "A color-matching game. Select a phage color and catch matching floating bacteria."
                    : "An animated beach story about a serious infection."
            );
        }
        if (isGame) {
            updatePhageColorButtons();
            updatePhageGameStatus();
        } else {
            phageGameRestartButton.hidden = true;
        }
    } else {
        imageCreditElement.hidden = true;
        imageStatusElement.hidden = true;
        phageGameControls.hidden = true;
        phageGameStatus.hidden = true;
        phageGameRestartButton.hidden = true;
    }
}

function drawWelcomeScene() {
    drawBeach();
    drawCloud(125 + sin(frameCount * 0.015) * 10, 70);
    drawCloud(625 + sin(frameCount * 0.012) * 12, 95);
    drawSparkle(180, 125, frameCount * 0.06);
    drawSparkle(645, 155, frameCount * 0.05);

    drawStickFigure(400, BEACH_GROUND_Y, {
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

function drawResistanceIntro() {
    drawReferencePhotoScene("Antibiotic resistance", "resistance");
}

function drawNaturalSelection() {
    drawReferencePhotoScene("Bacteria and natural selection", "bacteria");
}

function drawPhageIntro() {
    drawReferencePhotoScene("Meet bacteriophages", "phage");
}

function drawPhageTreatment() {
    drawReferencePhotoScene("A possible new way to fight infection", "phage");
}

function drawPhageEverywhere() {
    drawReferencePhotoScene("Phages are found where bacteria live", "bacteria");
}

function drawPhageKeys() {
    drawReferencePhotoScene("Phages attach using tail fibers", "phage");
}

function drawPhageSpecificity() {
    drawReferencePhotoScene("A phage's keys fit certain bacteria", "phage");
}

function drawPhageMatchingGame() {
    background("#e6f4f4");
    noStroke();
    fill("#29364a");
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(20);
    text("Choose a color. Catch matching bacteria!", width / 2, 31);

    if (!phageGame.won) {
        updatePhageGame();
    }

    const phageColor = PHAGE_GAME_COLORS[phageGame.selectedColor].value;
    drawGamePhage(155, 192, phageColor);
    phageGame.bacteria.forEach((bacterium) => {
        if (!bacterium.eaten) {
            drawGameBacterium(
                bacterium.x,
                bacterium.y,
                PHAGE_GAME_COLORS[bacterium.color].value,
                frameCount + bacterium.phase
            );
        }
    });

    noStroke();
    fill("#29364a");
    textSize(17);
    text(`Matches: ${phageGame.score}/${PHAGE_GAME_TARGET}`, width / 2, 335);
    if (phageGame.won) {
        fill("#fffdf7");
        rect(300, 137, 200, 74, 16);
        fill("#29364a");
        textStyle(BOLD);
        textSize(21);
        text("Great matching!", width / 2, 173);
    }
}

function drawGamePhage(x, y, color) {
    push();
    translate(x, y);
    stroke("#29364a");
    strokeWeight(5);
    strokeCap(ROUND);
    fill(color);
    circle(0, -34, 46);
    line(0, -10, 0, 29);
    line(-12, -5, 12, -5);
    line(-12, 16, 12, 16);
    line(0, 29, 0, 42);
    line(-13, 35, 13, 35);
    line(0, 42, -25, 68);
    line(0, 42, 25, 68);
    line(-8, 48, -9, 69);
    line(8, 48, 9, 69);
    pop();
}

function drawGameBacterium(x, y, color, animationTime) {
    push();
    translate(x, y + sin(animationTime * 0.045) * 5);
    rotate(sin(animationTime * 0.025) * 0.08);
    stroke("#29364a");
    strokeWeight(3);
    strokeCap(ROUND);
    fill(color);
    rectMode(CENTER);
    rect(0, 0, 54, 30, 15);
    noStroke();
    fill("#fffdf7");
    circle(-12, -3, 5);
    circle(0, 5, 5);
    circle(12, -4, 5);
    pop();
}

function drawReferencePhotoScene(title, photoKey) {
    background("#e6f4f4");
    noStroke();
    fill("#29364a");
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(22);
    text(title, width / 2, 35);

    fill("#fffdf7");
    rect(28, 62, 744, 276, 18);

    const photo = referencePhotos[photoKey];
    if (photo && photo.width > 0 && photo.height > 0) {
        const maxWidth = 700;
        const maxHeight = 250;
        const fit = Math.min(maxWidth / photo.width, maxHeight / photo.height);
        const photoWidth = photo.width * fit;
        const photoHeight = photo.height * fit;
        image(
            photo,
            (width - photoWidth) / 2,
            75 + (maxHeight - photoHeight) / 2,
            photoWidth,
            photoHeight
        );
    } else {
        fill("#647184");
        textStyle(NORMAL);
        textSize(17);
        text("Loading reference photo…", width / 2, height / 2);
    }
}

function drawBeachStory() {
    drawBeach();
    drawCloud(126, 67);
    drawCloud(640, 92);

    drawStickFigure(365, BEACH_GROUND_Y, {
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
        shirt: "#f59a81",
        sad: true
    });
    drawDoctor(565, true);
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
        sick: true,
        sad: true
    });
    drawDoctor(570, true);
    drawMedicineBottle(490, 112);
    drawMedicineBottle(560, 112);

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
    drawStickFigure(278, ROOM_GROUND_Y, {
        skin: "#bd7958",
        shirt: "#f59a81",
        sad: true
    });
    drawDoctor(505, true);
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

    if (!options.lying) {
        stroke(skin);
        strokeWeight(8 * scale);
        line(headX, headY + 17 * scale, bodyX, bodyY - 5 * scale);
    }

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
            y
        );

        line(
            rightHipX,
            bodyY + 40 * scale,
            rightFootX,
            y
        );

        // Feet
        line(
            leftFootX,
            y,
            leftFootX + 10 * scale,
            y
        );

        line(
            rightFootX,
            y,
            rightFootX + 10 * scale,
            y
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

function drawDoctor(x, sad = false) {
    drawStickFigure(x, ROOM_GROUND_Y, {
        scale: 0.95,
        skin: "#d99b76",
        shirt: "#fffdf7",
        straightLegs: true,
        sad
    });
    noStroke();
    fill("#4aa99d");
    rect(x - 4, ROOM_GROUND_Y - 52, 8, 24, 4);
    rect(x - 12, ROOM_GROUND_Y - 44, 24, 8, 4);
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
