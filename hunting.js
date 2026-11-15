const huntingPhotos = {
    phageStructure: {
        url: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Bacteriophage_structure.png",
        source: "https://commons.wikimedia.org/wiki/File:Bacteriophage_structure.png",
        title: "Bacteriophage structure",
        credit: "Y_tambe · CC BY-SA 3.0",
        description: "Diagram of a T4 bacteriophage with tail fibers and other parts labeled."
    },
    sequencer: {
        url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/Next_Gen_Sequencer_%28NIH_BioArt_386%29.png/960px-Next_Gen_Sequencer_%28NIH_BioArt_386%29.png",
        source: "https://commons.wikimedia.org/wiki/File:Next_Gen_Sequencer_(NIH_BioArt_386).png",
        title: "Next-generation sequencer",
        credit: "Ryan Kissinger, courtesy of NIAID · Public domain",
        description: "Illustration of a next-generation DNA sequencing machine."
    },
    phagesAtBacterium: {
        url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Phage.jpg/960px-Phage.jpg",
        source: "https://commons.wikimedia.org/wiki/File:Phage.jpg",
        title: "Phages attached to a bacterial cell",
        credit: "Professor Graham Beards · CC BY-SA 3.0",
        description: "Electron micrograph of bacteriophages attached to a bacterial cell wall."
    }
};

const huntingSlides = [
    {
        title: "Finding a phage for a patient",
        caption: "Different patients can have different bacterial strains. To find a possible phage treatment, a specialist lab first studies the bacteria causing that patient's infection.",
        photo: "phagesAtBacterium"
    },
    {
        title: "Read the bacterial genome",
        caption: "New sequencing technologies can read a bacterium's DNA more quickly. Its genome can help scientists identify the strain and look for useful clues—but sequencing alone does not choose or create a phage.",
        photo: "sequencer"
    },
    {
        title: "RBP proteins are like keys",
        caption: "Receptor-binding proteins (RBPs), often found on phage tail fibers, help a phage recognize and attach to receptors on a bacterium. The fit helps determine which bacteria it can infect.",
        photo: "phageStructure"
    },
    {
        title: "Retarget a phage in the lab",
        caption: "Researchers can study, swap, or modify RBPs to change which bacterial receptors a phage recognizes. This kind of engineering is done by specialist research teams; it is not a routine step in every hospital.",
        photo: "phageStructure"
    },
    {
        title: "Test a patient-matched candidate",
        caption: "The lab tests candidate phages against the patient's bacterial strain. Sequencing can help guide the search, while laboratory testing checks whether a candidate actually infects that strain. Phage therapy is still developing.",
        photo: "phagesAtBacterium"
    }
];

let huntingSlideIndex = 0;
let huntingStarted = false;
let huntingImages = {};
let failedHuntingImages = new Set();
let huntingCanvas;
let huntingStartButton;
let huntingPreviousButton;
let huntingNextButton;
let huntingCaption;
let huntingProgress;
let huntingImageCredit;
let huntingImageSource;
let huntingImageAttribution;
let huntingImageStatus;
let huntingFinishButton;
let huntingCompleted = localStorage.getItem("the-phage-is-rage:hunting:complete") === "true";

function preload() {
    for (const [key, photo] of Object.entries(huntingPhotos)) {
        huntingImages[key] = loadImage(
            photo.url,
            undefined,
            () => failedHuntingImages.add(key)
        );
    }
}

function setup() {
    const canvas = createCanvas(800, 360);
    canvas.parent("play-window");
    huntingCanvas = canvas.elt;
    huntingCanvas.setAttribute("aria-label", "A static photo story about patient-matched bacteriophages.");

    huntingStartButton = document.getElementById("hunting-start");
    huntingPreviousButton = document.getElementById("hunting-previous");
    huntingNextButton = document.getElementById("hunting-next");
    huntingCaption = document.getElementById("hunting-caption");
    huntingProgress = document.getElementById("hunting-progress");
    huntingImageCredit = document.getElementById("hunting-image-credit");
    huntingImageSource = document.getElementById("hunting-image-source");
    huntingImageAttribution = document.getElementById("hunting-image-attribution");
    huntingImageStatus = document.getElementById("hunting-image-status");
    huntingFinishButton = document.getElementById("hunting-finish");

    huntingStartButton.addEventListener("click", startHuntingSlides);
    huntingPreviousButton.addEventListener("click", () => changeHuntingSlide(-1));
    huntingNextButton.addEventListener("click", () => changeHuntingSlide(1));
    huntingFinishButton.addEventListener("click", finishHuntingLevel);
    updateHuntingControls();
}

function draw() {
    background("#e6f4f4");
    if (huntingStarted) {
        drawHuntingSlide();
    } else {
        drawHuntingCover();
    }
    noLoop();
}

function startHuntingSlides() {
    huntingStarted = true;
    huntingSlideIndex = 0;
    updateHuntingControls();
    redraw();
}

function changeHuntingSlide(direction) {
    huntingSlideIndex = constrain(huntingSlideIndex + direction, 0, huntingSlides.length - 1);
    updateHuntingControls();
    redraw();
}

function finishHuntingLevel() {
    if (huntingSlideIndex !== huntingSlides.length - 1) {
        return;
    }

    markLevelComplete("hunting");
    huntingCompleted = true;
    updateHuntingControls();
}

function updateHuntingControls() {
    huntingStartButton.hidden = huntingStarted;
    huntingPreviousButton.hidden = !huntingStarted;
    huntingNextButton.hidden = !huntingStarted;
    huntingCaption.hidden = !huntingStarted;
    huntingProgress.hidden = !huntingStarted;
    huntingFinishButton.hidden = !huntingStarted || huntingSlideIndex !== huntingSlides.length - 1;

    if (!huntingStarted) {
        huntingImageCredit.hidden = true;
        huntingImageStatus.hidden = true;
        return;
    }

    const slide = huntingSlides[huntingSlideIndex];
    const photo = huntingPhotos[slide.photo];
    huntingCaption.textContent = slide.caption;
    huntingProgress.textContent = `Scene ${huntingSlideIndex + 1} of ${huntingSlides.length}`;
    huntingPreviousButton.disabled = huntingSlideIndex === 0;
    huntingNextButton.disabled = huntingSlideIndex === huntingSlides.length - 1;
    huntingFinishButton.disabled = huntingCompleted;
    huntingFinishButton.textContent = huntingCompleted ? "Level complete!" : "Finish level";
    huntingImageSource.href = photo.source;
    huntingImageSource.textContent = photo.title;
    huntingImageAttribution.textContent = photo.credit;
    huntingCanvas.setAttribute("aria-label", photo.description);
    huntingImageCredit.hidden = false;
    huntingImageStatus.hidden = !failedHuntingImages.has(slide.photo);
    huntingImageStatus.textContent = huntingImageStatus.hidden
        ? ""
        : "This reference image could not load. Check your connection or open its source link below.";
}

function drawHuntingCover() {
    noStroke();
    fill("#29364a");
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(28);
    text("How do scientists find the right phage?", width / 2, 145);
    textStyle(NORMAL);
    textSize(17);
    text("A photo story about patient strains, sequencing, and RBP proteins", width / 2, 190);
}

function drawHuntingSlide() {
    const slide = huntingSlides[huntingSlideIndex];
    const photo = huntingImages[slide.photo];

    noStroke();
    fill("#29364a");
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(22);
    text(slide.title, width / 2, 34);

    fill("#fffdf7");
    rect(28, 62, 744, 276, 18);

    if (!photo || photo.width === 0 || photo.height === 0) {
        fill("#647184");
        textStyle(NORMAL);
        textSize(17);
        text("Loading reference photo…", width / 2, height / 2);
        return;
    }

    const maxWidth = 700;
    const maxHeight = 250;
    const scaleToFit = Math.min(maxWidth / photo.width, maxHeight / photo.height);
    const imageWidth = photo.width * scaleToFit;
    const imageHeight = photo.height * scaleToFit;
    image(
        photo,
        (width - imageWidth) / 2,
        75 + (maxHeight - imageHeight) / 2,
        imageWidth,
        imageHeight
    );
}
