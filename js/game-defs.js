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

var tools = {};
// Tool Menu:
function makeToolMenu() {
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
bgLayer.add(coffeeMachine);
