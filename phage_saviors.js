const saviorsPhotos = {
    dherelle: {
        url: "https://upload.wikimedia.org/wikipedia/commons/b/b5/F%C3%A9lix_d%27H%C3%A9relle.jpg",
        source: "https://commons.wikimedia.org/wiki/File:F%C3%A9lix_d%27H%C3%A9relle.jpg",
        title: "Félix d’Hérelle",
        credit: "Gallica / Institut Pasteur · Public domain",
        description: "Archival portrait of Félix d’Hérelle."
    },
    hershey: {
        url: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Alfred_Hershey.jpg",
        source: "https://commons.wikimedia.org/wiki/File:Alfred_Hershey.jpg",
        title: "Alfred Hershey",
        credit: "Author unknown · Public domain",
        description: "Portrait of Alfred Hershey."
    },
    smith: {
        url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/George_Smith_EM1B5849_%2831295409687%29.jpg/960px-George_Smith_EM1B5849_%2831295409687%29.jpg",
        source: "https://commons.wikimedia.org/wiki/File:George_Smith_EM1B5849_(31295409687).jpg",
        title: "George P. Smith",
        credit: "Bengt Nyman · CC BY 2.0",
        description: "Photograph of George P. Smith."
    },
    gratia: {
        url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/71/Group_portrait_including_E.B._Chain._Wellcome_L0012312.jpg/960px-Group_portrait_including_E.B._Chain._Wellcome_L0012312.jpg",
        source: "https://commons.wikimedia.org/wiki/File:Group_portrait_including_E.B._Chain._Wellcome_L0012312.jpg",
        title: "Group portrait including André Gratia",
        credit: "Wellcome Collection · CC BY 4.0; Gratia is standing at the back, fifth from left",
        description: "Group portrait of scientists; André Gratia is standing at the back, fifth from the left."
    },
    strathdee: {
        url: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Strathdee_Portrait.png",
        source: "https://commons.wikimedia.org/wiki/File:Strathdee_Portrait.png",
        title: "Steffanie Strathdee",
        credit: "Scott Lafee · CC BY-SA 4.0",
        description: "Portrait of Steffanie Strathdee."
    }
};

const saviorsSlides = [
    {
        name: "Félix d’Hérelle",
        caption: "Félix d’Hérelle was a French-Canadian microbiologist: French-born and later based in Canada. In 1917 he reported discovering bacteriophages and helped develop the idea of using them against bacterial infections.",
        photo: "dherelle",
        source: "https://en.wikipedia.org/wiki/F%C3%A9lix_d%27H%C3%A9relle"
    },
    {
        name: "Alfred Hershey",
        caption: "With Martha Chase, Alfred Hershey used bacteriophages in a landmark 1952 experiment. Their work showed that phage DNA—not protein—enters bacteria during infection, helping establish DNA as genetic material.",
        photo: "hershey",
        source: "https://www.nobelprize.org/prizes/medicine/1969/hershey/facts/"
    },
    {
        name: "George P. Smith",
        caption: "George P. Smith developed phage display in 1985, a method that uses bacteriophages to present and select proteins. He shared the 2018 Nobel Prize in Chemistry for this work.",
        photo: "smith",
        source: "https://www.nobelprize.org/prizes/chemistry/2018/smith/facts/"
    },
    {
        name: "André Gratia",
        caption: "Belgian microbiologist André Gratia studied how bacteria and phages interact. He found an E. coli strain resistant to a phage and pioneered research on bacteriocins—antibacterial substances made by bacteria. This group photograph includes him standing at the back, fifth from the left.",
        photo: "gratia",
        source: "https://en.wikipedia.org/wiki/Andr%C3%A9_Gratia"
    },
    {
        name: "Steffanie Strathdee",
        caption: "In 2016, infectious-disease researcher Steffanie Strathdee helped organize an experimental phage treatment for her husband Tom Patterson’s life-threatening infection. She later co-founded IPATH at UC San Diego to help advance phage therapy research.",
        photo: "strathdee",
        source: "https://medschool.ucsd.edu/som/medicine/divisions/idgph/research/center-innovative-phage-applications-and-therapeutics/Pages/default.aspx"
    }
];

const scientistContributions = [
    "Reported discovering bacteriophages in 1917 and explored phage therapy",
    "With Martha Chase, showed phage DNA enters bacteria in the 1952 experiment",
    "Developed phage display, a method for selecting proteins",
    "Studied phage resistance and pioneered bacteriocin research",
    "Helped organize a landmark phage treatment and co-founded IPATH"
];

let saviorsSlideIndex = 0;
let saviorsStarted = false;
let saviorsInGame = false;
let saviorsImages = {};
let failedSaviorsImages = new Set();
let saviorsCanvas;
let saviorsStartButton;
let saviorsPreviousButton;
let saviorsNextButton;
let saviorsCaption;
let saviorsProgress;
let saviorsImageCredit;
let saviorsImageSource;
let saviorsImageAttribution;
let saviorsImageStatus;
let saviorsGame;
let saviorsMatchList;
let saviorsGameStatus;
let saviorsCheckButton;
let saviorsCompleted = localStorage.getItem("the-phage-is-rage:saviors:complete") === "true";

function preload() {
    for (const [key, photo] of Object.entries(saviorsPhotos)) {
        saviorsImages[key] = loadImage(photo.url, undefined, () => failedSaviorsImages.add(key));
    }
}

function setup() {
    const canvas = createCanvas(800, 360);
    canvas.parent("play-window");
    saviorsCanvas = canvas.elt;
    saviorsCanvas.setAttribute("aria-label", "A photo story about scientists who shaped bacteriophage research.");

    saviorsStartButton = document.getElementById("saviors-start");
    saviorsPreviousButton = document.getElementById("saviors-previous");
    saviorsNextButton = document.getElementById("saviors-next");
    saviorsCaption = document.getElementById("saviors-caption");
    saviorsProgress = document.getElementById("saviors-progress");
    saviorsImageCredit = document.getElementById("saviors-image-credit");
    saviorsImageSource = document.getElementById("saviors-image-source");
    saviorsImageAttribution = document.getElementById("saviors-image-attribution");
    saviorsImageStatus = document.getElementById("saviors-image-status");
    saviorsGame = document.getElementById("scientist-game");
    saviorsMatchList = document.getElementById("scientist-match-list");
    saviorsGameStatus = document.getElementById("scientist-game-status");
    saviorsCheckButton = document.getElementById("scientist-check");

    saviorsStartButton.addEventListener("click", startSaviorsSlides);
    saviorsPreviousButton.addEventListener("click", () => changeSaviorsSlide(-1));
    saviorsNextButton.addEventListener("click", advanceSaviors);
    document.getElementById("scientist-back").addEventListener("click", returnToSaviorsSlides);
    saviorsCheckButton.addEventListener("click", checkScientistMatches);
    createScientistMatchInputs();
    updateSaviorsControls();
}

function draw() {
    background("#e6f4f4");
    if (saviorsStarted) {
        drawSaviorsSlide();
    } else {
        drawSaviorsCover();
    }
    noLoop();
}

function startSaviorsSlides() {
    saviorsStarted = true;
    saviorsSlideIndex = 0;
    updateSaviorsControls();
    redraw();
}

function changeSaviorsSlide(direction) {
    saviorsSlideIndex = constrain(saviorsSlideIndex + direction, 0, saviorsSlides.length - 1);
    updateSaviorsControls();
    redraw();
}

function advanceSaviors() {
    if (saviorsSlideIndex < saviorsSlides.length - 1) {
        changeSaviorsSlide(1);
        return;
    }
    saviorsInGame = true;
    saviorsGameStatus.textContent = saviorsCompleted
        ? "You’ve already completed this level. You can play again."
        : "Match all five scientists to unlock the next level.";
    updateSaviorsControls();
}

function returnToSaviorsSlides() {
    saviorsInGame = false;
    updateSaviorsControls();
}

function createScientistMatchInputs() {
    const options = scientistContributions.map((contribution, index) =>
        `<option value="${index}">${contribution}</option>`
    ).join("");

    saviorsMatchList.innerHTML = saviorsSlides.map((slide, index) => `
        <label class="scientist-match-row" for="scientist-match-${index}">
            <span>${slide.name}</span>
            <select id="scientist-match-${index}" aria-label="Contribution for ${slide.name}">
                <option value="">Choose a contribution</option>
                ${options}
            </select>
        </label>
    `).join("");
}

function checkScientistMatches() {
    const selections = saviorsSlides.map((_, index) =>
        document.getElementById(`scientist-match-${index}`).value
    );
    if (selections.includes("")) {
        saviorsGameStatus.textContent = "Choose a contribution for every scientist first.";
        return;
    }

    const correct = selections.every((value, index) => Number(value) === index);
    if (!correct) {
        saviorsGameStatus.textContent = "Not quite—review the slides and try another combination.";
        return;
    }

    if (!saviorsCompleted) {
        markLevelComplete("saviors");
        saviorsCompleted = true;
    }
    saviorsGameStatus.textContent = "All five matches are correct! Phage Hero complete.";
    saviorsCheckButton.disabled = true;
    saviorsCheckButton.textContent = "Level complete!";
}

function updateSaviorsControls() {
    saviorsStartButton.hidden = saviorsStarted;
    saviorsPreviousButton.hidden = !saviorsStarted || saviorsInGame;
    saviorsNextButton.hidden = !saviorsStarted || saviorsInGame;
    saviorsCaption.hidden = !saviorsStarted || saviorsInGame;
    saviorsProgress.hidden = !saviorsStarted || saviorsInGame;
    saviorsImageCredit.hidden = !saviorsStarted || saviorsInGame;
    saviorsImageStatus.hidden = true;
    saviorsGame.hidden = !saviorsInGame;

    if (!saviorsStarted || saviorsInGame) {
        return;
    }

    const slide = saviorsSlides[saviorsSlideIndex];
    const photo = saviorsPhotos[slide.photo];
    saviorsCaption.textContent = slide.caption;
    saviorsProgress.textContent = `Scientist ${saviorsSlideIndex + 1} of ${saviorsSlides.length}`;
    saviorsPreviousButton.disabled = saviorsSlideIndex === 0;
    saviorsNextButton.textContent = saviorsSlideIndex === saviorsSlides.length - 1
        ? "Start matching game"
        : "Next scientist";
    saviorsImageSource.href = photo.source;
    saviorsImageSource.textContent = photo.title;
    saviorsCanvas.setAttribute("aria-label", photo.description);
    saviorsImageStatus.hidden = !failedSaviorsImages.has(slide.photo);
    saviorsImageStatus.textContent = saviorsImageStatus.hidden
        ? ""
        : "This reference image could not load. Check your connection or open its source link above.";
    saviorsImageCredit.hidden = false;
    saviorsImageAttribution.replaceChildren();
    saviorsImageAttribution.append(document.createTextNode(` · ${photo.credit} · Biography: `));
    const biographyLink = document.createElement("a");
    biographyLink.href = slide.source;
    biographyLink.target = "_blank";
    biographyLink.rel = "noopener noreferrer";
    biographyLink.textContent = "biography/source";
    saviorsImageAttribution.append(biographyLink);
}

function drawSaviorsCover() {
    noStroke();
    fill("#29364a");
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(28);
    text("The scientists behind phage research", width / 2, 145);
    textStyle(NORMAL);
    textSize(17);
    text("Meet five researchers, then match each person to their contribution", width / 2, 190);
}

function drawSaviorsSlide() {
    const slide = saviorsSlides[saviorsSlideIndex];
    const photo = saviorsImages[slide.photo];

    noStroke();
    fill("#29364a");
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(24);
    text(slide.name, width / 2, 34);

    fill("#fffdf7");
    rect(28, 62, 744, 276, 18);

    if (!photo || photo.width === 0 || photo.height === 0) {
        fill("#647184");
        textStyle(NORMAL);
        textSize(17);
        text("Loading reference photo…", width / 2, height / 2);
        return;
    }

    const scaleToFit = Math.min(700 / photo.width, 250 / photo.height);
    const imageWidth = photo.width * scaleToFit;
    const imageHeight = photo.height * scaleToFit;
    image(photo, (width - imageWidth) / 2, 75 + (250 - imageHeight) / 2, imageWidth, imageHeight);
}
