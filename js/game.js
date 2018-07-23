const GAME = {
    activeTool: null,
    loc: 0,
    bugs: 0,
    timeLeft: 10,
    target: {
        loc: 1000,  // TODO: more levels
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
bgImg.src = `img/office.svg`;
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

// Tool Menu:
var tools = {};
tools.code = new Konva.Text({
    x: 0,
    y: 0,
    text: 'WRITE CODE',
    fontSize: 30,
    stroke: "#C0FFEE"
});
tools.code.on('click', function() {
    GAME.activeTool = 'code';
    highlightMenu(1);
});
tools.fixbugs = new Konva.Text({
    x: 215,
    y: 0,
    text: 'FIX BUGS',
    fontSize: 30,
    stroke: (GAME.activeTool == 'fixbugs') ? "salmon" : "#C0FFEE"
});
tools.fixbugs.on('click', function() {
    GAME.activeTool = 'fixbugs';
    highlightMenu(2);
});
tools.sleep = new Konva.Text({
    x: 380,
    y: 0,
    text: 'SLEEP',
    fontSize: 30,
    stroke: (GAME.activeTool == 'sleep') ? "salmon" : "#C0FFEE"
});
tools.sleep.on('click', function() {
    GAME.activeTool = 'sleep';
    highlightMenu(3);
});
bgLayer.add(tools.code, tools.fixbugs, tools.sleep);

// Apply colour styles to the tool menu:
function highlightMenu(value) {
    tools.code.stroke(value === 1 ? "salmon" : "#C0FFEE");
    tools.fixbugs.stroke(value === 2 ? "salmon" : "#C0FFEE");
    tools.sleep.stroke(value === 3 ? "salmon" : "#C0FFEE");
    bgLayer.draw();
}

// Load the 7 coffee images:
function loadCoffees() {
    for (let i = 0; i < coffees.length; i++) {
        console.log(coffees[i]);
        coffees[i].imgObj = new Image(24,24);
        coffees[i].imgObj.src = coffees[i].img;
        coffees[i].imgObj.onload = function() {
            let coffeeImg = new Konva.Image({
                image: coffees[i].imgObj,
                x: 90 + Math.random() * 50,
                y: 70 + Math.random() * 50
            });
            fgLayer.add(coffeeImg);
        };
    }
    fgLayer.draw();
}
loadCoffees();

// Initial render of coders:
for (var coder of coders) {
    coder.render();
    coder.renderNameLabel();
    coder.renderBubble('?');
    coder.renderModeIndicator();
}


//Code on screens...
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
    };
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
