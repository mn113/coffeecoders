const GAME = {
    activeTool: null,
    loc: 0,
    bugs: 0,
    timeLeft: 3,
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
var menuLayer = new Konva.Layer();
var fgLayer = new Konva.Layer();
var coffeeLayer = new Konva.Layer();
var screensLayer = new Konva.Layer();
stage.add(bgLayer, menuLayer, fgLayer, coffeeLayer, screensLayer);

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
function makeToolMenu() {
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
    menuLayer.add(tools.code, tools.fixbugs, tools.sleep);    
}
makeToolMenu();

// Apply colour styles to the tool menu:
function highlightMenu(value) {
    tools.code.stroke(value === 1 ? "salmon" : "#C0FFEE");
    tools.fixbugs.stroke(value === 2 ? "salmon" : "#C0FFEE");
    tools.sleep.stroke(value === 3 ? "salmon" : "#C0FFEE");
    menuLayer.draw();
}

// Coffee machine hit region:
var coffeeMachine = new Konva.Rect({
    x: 84,
    y: 64,
    width: 24,
    height: 36,
    fill: 'yellow',
    opacity: 0.2
});
coffeeMachine
.on('mouseover', function() {
    document.body.style.cursor = 'pointer';
})
.on('mouseout', function() {
    document.body.style.cursor = 'default';
})
.on('click', function() {
    openCoffeeMenu();
});
fgLayer.add(coffeeMachine);


// Initial render of coders:
for (var coder of coders) {
    coder.render();
    coder.renderNameLabel();
    coder.renderBubble('?');
    coder.renderModeIndicator();
}


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
