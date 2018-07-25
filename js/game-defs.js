const GAME = {
    activeTool: null,
    loc: 0,
    bugs: 0,
    timeLeft: 0,
    target: {},
    levels: [
        {coders: 2, target: {loc: 1000, bugs: 350}, timeBoost: 45},
        {coders: 3, target: {loc: 1500, bugs: 325}, timeBoost: 25},
        {coders: 4, target: {loc: 2100, bugs: 300}, timeBoost: 20},
        {coders: 5, target: {loc: 2700, bugs: 270}, timeBoost: 20},
        {coders: 6, target: {loc: 3300, bugs: 300}, timeBoost: 15},
        {coders: 7, target: {loc: 3800, bugs: 340}, timeBoost: 15},
        {coders: 8, target: {loc: 4500, bugs: 375}, timeBoost: 10},
        {coders: 9, target: {loc: 5000, bugs: 425}, timeBoost: 10},
        {coders: 10, target: {loc: 5750, bugs: 500}, timeBoost: 5},
        {coders: 11, target: {loc: 6200, bugs: 550}, timeBoost: 5},
        {coders: 12, target: {loc: 7000, bugs: 600}, timeBoost: 0}
    ]
};

function loadLevel(n) {
    GAME.target = GAME.levels[n].target;
    GAME.timeLeft = GAME.timeLeft + GAME.levels[n].timeBoost;
    while (coders.length < GAME.levels[n].coders) {
        coders.push(new Coder(coderPositions[coders.length]));
    }
    scoreLayer.draw();
}

// Set up Konva:
var stage = new Konva.Stage({
    container: 'container',
    width: window.innerWidth,
    height: window.innerHeight,
    scaleX: 2,
    scaleY: 2
});

// Define layers:
var bgLayer = new Konva.Layer();
var menuLayer = new Konva.Layer();
var scoreLayer = new Konva.Layer();
var machineLayer = new Konva.Layer();
var fgLayer = new Konva.Layer();
var screensLayer = new Konva.Layer();
var coffeeLayer = new Konva.Layer();
stage.add(bgLayer, menuLayer, scoreLayer, machineLayer, fgLayer, screensLayer, coffeeLayer);

// Background:
var bgImg = new Image();
bgImg.src = `img/office_1920x1080.png`;
bgImg.onload = function() {
    bgLayer.draw();
};
bgObj = new Konva.Image({
    x: 0,
    y: 0,
    width: 480,
    height: 320,
    image: bgImg
});
bgLayer.add(bgObj);

// Tool Menu:
var tools = {};
function makeToolMenu() {
    var toolNames = ['code', 'fixbugs', 'sleep'];
    tools.code = new Konva.Text({
        x: 40,
        y: 0,
        text: 'WRITE CODE',
        fontSize: 20,
        fill: "#C0FFEE"
    });
    /*tools.code.on('click', function() {
        GAME.activeTool = 'code';
        highlightMenu(1);
    });*/
    tools.fixbugs = new Konva.Text({
        x: 40,
        y: 20,
        text: 'FIX BUGS',
        fontSize: 16,
        fill: "#C0FFEE"
    });
    /*tools.fixbugs.on('click', function() {
        GAME.activeTool = 'fixbugs';
        highlightMenu(2);
    });*/
    tools.sleep = new Konva.Text({
        x: 130,
        y: 20,
        text: 'SLEEP',
        fontSize: 16,
        fill: "#C0FFEE"
    });
    // Tool behaviours:
    for (let i = 0; i < 3; i++) {
        tools[toolNames[i]]
        .on('click', function() {
            GAME.activeTool = toolNames[i];
            highlightMenu(i+1);
        })
        .on('mouseover', function() {
            document.body.style.cursor = 'pointer';
        })
        .on('mouseout', function() {
            document.body.style.cursor = 'default';
        });
    }
    menuLayer.add(tools.code, tools.fixbugs, tools.sleep);
    menuLayer.draw();
}
makeToolMenu();

// Apply colour styles to the tool menu:
function highlightMenu(value) {
    tools.code.fill(value === 1 ? "salmon" : "#C0FFEE");
    tools.fixbugs.fill(value === 2 ? "salmon" : "#C0FFEE");
    tools.sleep.fill(value === 3 ? "salmon" : "#C0FFEE");
    menuLayer.draw();
}

// Score & stats display:
var scores = {
    timerText: new Konva.Text({
        x: 210,
        y: 0,
        fontSize: 45,
        fontVariant: 'bold',
        fill: 'yellow',
        stroke: 'black',
        strokeWidth: 1,
        text: GAME.timeLeft
    }),
    locText: new Konva.Text({
        x: 270,
        y: 5,
        fill: 'lawngreen',
        text: 0
    }),
    bugsText: new Konva.Text({
        x: 270,
        y: 20,
        fill: 'red',
        text: 0    
    }),
    locTargetText: new Konva.Text({
        x: 370,
        y: 5,
        fill: '#C0FFEE',
        text: 0
    }),
    bugsTargetText: new Konva.Text({
        x: 370,
        y: 20,
        fill: '#C0FFEE',
        text: 0
    })
};
scoreLayer.add(...Object.values(scores));

function updateScores() {
    // Update clock:
    var time = Math.floor(GAME.timeLeft);
    if (time < 10) time = '0' + time;
    scores.timerText.text(time);
    // Update loc/bugs:
    scores.locText.text(GAME.loc + ' lines of code');
    scores.bugsText.text(GAME.bugs + ' bugs');
    // Update targets:
    scores.locTargetText.text('(Goal ' + GAME.target.loc + ')');
    scores.bugsTargetText.text('(Max ' + GAME.target.bugs + ')');

    scoreLayer.draw();
}
