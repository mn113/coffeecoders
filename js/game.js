const GAME = {
    loc: 0,
    bugs: 0,
    timeLeft: 5,
    target: {
        loc: 1000,
        bugs: 1000
    }
};

// Set up Konva:
var stage = new Konva.Stage({
    container: 'container',
    width: window.innerWidth,
    height: window.innerHeight,
    scaleX: 2,
    scaleY: 2
});
// HOW TO APPLY? context.imageSmoothingQuality = "low"

// Define layers:
var bgLayer = new Konva.Layer();
stage.add(bgLayer);
var fgLayer = new Konva.Layer();
stage.add(fgLayer);
var screensLayer = new Konva.Layer();
stage.add(screensLayer);

// Background:
var bgImg = new Image();
bgImg.src = `img/office.png`;
bgImg.onload = function() {
    bgLayer.draw();
};
bgLayer.add(new Konva.Image({
    x: 0,
    y: 0,
    width: 480,
    height: 320,
    image: bgImg
}));


// Initial render of coders:
for (var coder of coders) {
    coder.render();
    coder.renderNameLabel();
    coder.renderBubble('?');
}

// Add delegated hover event listeners to coders:
/*fgLayer.on('mouseover', function(evt) {
    var shape = evt.target;
    if (shape.className == 'Image') {
        document.body.style.cursor = 'pointer';
        shape.scaleX(1.2);
        shape.scaleY(1.2);
        console.log(shape);
        // need to get this coder and show their name label
        fgLayer.draw();
    }
});
fgLayer.on('mouseout', function(evt) {
    var shape = evt.target;
    if (shape.className == 'Image') {
        document.body.style.cursor = 'default';
        shape.scaleX(1);
        shape.scaleY(1);
        fgLayer.draw();
    }
});*/


function renderCode(pos) {
    let imageObj = new Image();
    imageObj.src = `img/code.png`;
    imageObj.onload = function() {
        let locsImg = new Konva.Image({
            image: imageObj,
            x: pos.x - 24,
            y: pos.y,
            width: 16,
            height: 12,
            crop: {
                x: 0,
                y: 0,   // animate this
                width: 16,
                height: 12
            }
        });
        screensLayer.add(locsImg);
        screensLayer.draw();
    }
}
//renderCode(coderPositions[0]);

var screenGroup = new Konva.Group({
    x: coderPositions[0].x - 10,
    y: coderPositions[0].y - 4,
    scaleX: -1
});
var blackScreen = new Konva.Rect({
    width: 16,
    height: 12,
    fill: 'black',
    stroke: 'yellow',
    strokeWidth: 0.5,
    opacity: 0.5
});
var text = new Konva.Text({
    width: 16,
    height: 12,
    text: "math =\n\troot:   Math.sqrt\n\tsquare: square\n\tcube:   (x) -> x * square x\n".repeat(3),
    fontSize: 2,
    stroke: '#00FF00',
    strokeWidth: 0.2,
});
screenGroup.add(blackScreen);
screenGroup.add(text);
screensLayer.add(screenGroup);
screensLayer.draw();


// game loop:
var t = setInterval(() => {
    for (c of coders) {
        c.tick();
        //c.render();
        c.log();
    }
    text.offsetY(text.offsetY() + 1);
    screensLayer.draw();

    console.info(`${GAME.loc} loc / ${GAME.bugs} bugs`);
    GAME.timeLeft -= 0.25;
    if (GAME.timeLeft * 4 % 4 === 0) console.log(GAME.timeLeft);
    
    // Check for level success:
    if (GAME.loc >= GAME.target.loc && GAME.bugs < GAME.target.bugs) {
        console.log("Level passed!");
        clearInterval(t);
    }
    // Check for time up:
    else if (GAME.timeLeft <= 0) {
        console.log("Game over!");
        clearInterval(t);
    }
}, 250);
