
function drawStickFigure(x, y, options = {}) {
    const scale = options.scale || 1;
    const skin = options.skin || "#bd7958";
    const shirt = options.shirt || "#f59a81";

    const bob = options.sick ? sin(frameCount * 0.08) * 1.5 : 0;

    const headX = x + (options.lying ? -44 : 0);
    const headY = y - (options.lying ? 26 : 70) + bob;
    const bodyX = x + (options.lying ? -12 : 0);
    const bodyY = y - (options.lying ? 18 : 38);

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
        line(
            bodyX - 7 * scale,
            bodyY + 40 * scale,
            bodyX - 13 * scale,
            y + 3 * scale
        );

        line(
            bodyX + 7 * scale,
            bodyY + 40 * scale,
            bodyX + 13 * scale,
            y + 3 * scale
        );

        // Feet
        line(
            bodyX - 13 * scale,
            y + 3 * scale,
            bodyX - 3 * scale,
            y + 3 * scale
        );

        line(
            bodyX + 13 * scale,
            y + 3 * scale,
            bodyX + 23 * scale,
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
