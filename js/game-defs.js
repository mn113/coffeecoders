var GAME = {
    activeTool: null,
    activeCoffee: null,
    activeTreat: null,
    loc: 0,
    bugs: 0,
    timeLeft: 0,
    target: {},
    level: 0,
    levels: [
        {coders: 2, target: {loc: 750, bugs: 300}, timeBoost: 45},
        {coders: 3, target: {loc: 1200, bugs: 350}, timeBoost: 30}, // +450
        {coders: 4, target: {loc: 1700, bugs: 400}, timeBoost: 25}, // +500
        {coders: 5, target: {loc: 2250, bugs: 450}, timeBoost: 25}, // +550
        {coders: 6, target: {loc: 2850, bugs: 500}, timeBoost: 20}, // +600
        {coders: 7, target: {loc: 3500, bugs: 575}, timeBoost: 20}, // +750
        {coders: 8, target: {loc: 4350, bugs: 650}, timeBoost: 15}, // +850
        {coders: 9, target: {loc: 5400, bugs: 700}, timeBoost: 15}, // +1050
        {coders: 10, target: {loc: 6900, bugs: 650}, timeBoost: 10},// +1500
        {coders: 11, target: {loc: 8500, bugs: 575}, timeBoost: 10}, // +1600
        {coders: 12, target: {loc: 10000, bugs: 500}, timeBoost: 5} // +1500
    ],
    caffeineConsumed: 0
};

function loadLevel(n) {
    GAME.level = n;
    // Increase loc (preventing multiple jumps ahead):
    if (GAME.loc > GAME.levels[n].target.loc) {
        GAME.target.loc = 1000 + 25 * Math.ceil(GAME.loc / 25);
    }
    else {
        GAME.target.loc = GAME.levels[n].target.loc;
    }

    // Increase bugs:
    GAME.target.bugs = GAME.levels[n].target.bugs;
    
    // Adaptive-difficulty time adding:
    if (GAME.timeLeft < 45) {
        GAME.timeLeft = GAME.timeLeft + GAME.levels[n].timeBoost;
    }
    else {
        GAME.timeLeft = GAME.timeLeft + GAME.levels[n].timeBoost / 2;
    }
    
    // Hire any new coders up to level's amount (typically just 1):
    while (coders.length < GAME.levels[n].coders) {
        coders.push(new Coder(coderPositions[coders.length]));
    }
    scoreLayer.draw();
    fgLayer.draw();
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
var screensLayer = new Konva.Layer();
var fgLayer = new Konva.Layer();
var coffeeLayer = new Konva.Layer();
var modalLayer = new Konva.Layer();
stage.add(bgLayer, menuLayer, scoreLayer, machineLayer, screensLayer, fgLayer, coffeeLayer, modalLayer);

// Background:
var bgImg = new Image();
bgImg.src = `img/office_1920x1080.png`;
bgImg.onload = function() {
    bgLayer.draw();
};
var bgObj = new Konva.Image({
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
    var toolNames = ['code', 'fixbugs'];//, 'sleep'];
    
    // First:
    var codeImg = new Image();
    codeImg.src = `img/writecode.png`;
/*    codeImg.onload = function() {
        menuLayer.draw();
    };*/
    tools.code = new Konva.Group();
    tools.code.add(new Konva.Rect({
        x: 38,
        y: 3,
        width: 85,
        height: 30,
        strokeWidth: 1,
        stroke: '#333',
        cornerRadius: 3
    }));
    tools.code.add(new Konva.Image({
        x: 40,
        y: 5,
        width: 25,
        height: 25,
        image: codeImg
    }));
    tools.code.add(new Konva.Text({
        x: 70,
        y: 5,
        text: 'WRITE\nCODE',
        fontVariant: 'bold',
        fontSize: 16,
        lineHeight: 0.88,
        fill: "#C0FFEE"
    }));

    // Second:
    var fixImg = new Image();
    fixImg.src = `img/fixbugs.png`;
    /*fixImg.onload = function() {
        menuLayer.draw();
    };*/
    tools.fixbugs = new Konva.Group();
    tools.fixbugs.add(new Konva.Rect({
        x: 128,
        y: 3,
        width: 80,
        height: 30,
        strokeWidth: 1,
        stroke: '#333',
        cornerRadius: 3
    }));
    tools.fixbugs.add(new Konva.Image({
        x: 130,
        y: 5,
        width: 25,
        height: 25,
        image: fixImg
    }));
    tools.fixbugs.add(new Konva.Text({
        x: 160,
        y: 5,
        text: 'FIX\nBUGS',
        fontVariant: 'bold',
        fontSize: 16,
        lineHeight: 0.88,
        fill: "#C0FFEE"
    }));

    // Tool behaviours:
    for (let i = 0; i < toolNames.length; i++) {
        tools[toolNames[i]]
        .on('click', function() {
            GAME.activeTool = toolNames[i];
            highlightMenu(i+1);
        })
        .on('mouseover', function() {
            document.body.style.cursor = 'pointer';
            this.getChildren()[0].stroke('#C0FFEE');
            menuLayer.draw();
        })
        .on('mouseout', function() {
            document.body.style.cursor = 'default';
            this.getChildren()[0].stroke('black');
            menuLayer.draw();
        });
    }
    menuLayer.add(tools.code, tools.fixbugs);//, tools.sleep);
}
makeToolMenu();

// Apply colour styles to the tool menu:
function highlightMenu(value) {
    tools.code.getChildren()[2].fill(value === 1 ? "salmon" : "#C0FFEE");
    tools.fixbugs.getChildren()[2].fill(value === 2 ? "salmon" : "#C0FFEE");
    //tools.sleep.fill(value === 3 ? "salmon" : "#C0FFEE");
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
    scores.timerText.fill(`rgb(255,${time*6},0)`); // fill goes from yellow to red as time decreases
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

// Sounds:
var sounds = {
    coin:     {url: "sfx/coin.mp3", volume: 0.6},
    machine:  {url: "sfx/machine-pour-ping.mp3", volume: 1},
    slurp:    {url: "sfx/slurp.mp3", volume: 0.8},
    powerup:  {url: "sfx/powerup.mp3", volume: 0.5},
    sugar:    {url: "sfx/sugar.mp3", volume: 0.5},
    mmmhis:   {url: "sfx/mmm-his.mp3", volume: 1},
    mmmhers:  {url: "sfx/mmm-hers.mp3", volume: 1},
    levelup:  {url: "sfx/powerup.mp3", volume: 0.5},
    gameover: {url: "sfx/gameover.mp3", volume: 0.5},
    triumph:  {url: "sfx/triumph.mp3", volume: 0.6},
    extinguisher: {url: "sfx/extinguisher.mp3", volume: 1},

    // Create and play a one-off sound effect:
	play: function(name) {
        var player = new Audio(sounds[name].url);
        player.volume = sounds[name].volume;
		player.play();  // will be stopped and garbage-collected when audio ends
    },

    music: new Audio("sfx/Lee_Rosevere_Telecom.mp3"),
    
    // Turn music on or off:
    setMusic: function(enable) {
        if (enable) {
            sounds.music.loop = true;
            sounds.music.volume = 0.4;
            sounds.music.play();
        }
        else {
            sounds.music.pause();
        }
    },

    typing: new Audio("sfx/typing.mp3"),

    // Turn typing sounds on or off:
    setTyping: function(enable) {
        if (enable) {
            sounds.typing.loop = true;
            sounds.music.volume = 0.5;
            sounds.typing.play();
        }
        else {
            sounds.typing.pause();
        }
    }
};

var musicCredit = new Konva.Text({
    x: 42,
    y: 292,
    text: '♬ Lee Rosevere - Telecom',
    fill: '#C0FFEE',
    fontSize: 6
});
musicCredit
.on('mouseover', function() {
    document.body.style.cursor = 'pointer';
})
.on('mouseout', function() {
    document.body.style.cursor = 'default';
})
.on('click', function() {
    sounds.setMusic(sounds.music.paused);   // play if paused; pause if playing
});
menuLayer.add(musicCredit);


// Extinguisher bonus:
var fireExt = new Konva.Rect({
    x: 380,
    y: 70,
    width: 8,
    height: 20,
    opacity: 0
});
bgLayer.add(fireExt);
fireExt
.on('mouseover', function() {
    document.body.style.cursor = 'pointer';
})
.on('mouseout', function() {
    document.body.style.cursor = 'default';
})
.on('click', function() {
    // Remove click region:
    fireExt.destroy();
    sounds.play('extinguisher');
    // Create foam:
    var foam = new Konva.Group();
    bgLayer.add(foam);
    for (var f = 0; f < 300; f++) {
        foam.add(new Konva.Circle({
            x: 350 + f * Math.random(),
            y: 60 + f * Math.random(),
            radius: 15 + 10 * Math.random(),
            fill: 'white',
            opacity: 0.3,
        }));
        bgLayer.draw();
    }
    // Fade foam:
    new Konva.Tween({
        node: foam,
        opacity: 0,
        duration: 5,
        easing: Konva.Easings.EaseInOut
    }).play();
    
    // Easter egg reward:
    GAME.timeLeft += 10;
});

// Initialise mini messager at bottom of screen:
var miniMessage = new Konva.Text({
    x: 240,
    y: 290,
    width: 190,
    fill: '#eee',
    fontSize: 9,
    text: "",
    align: 'right'
});
bgLayer.add(miniMessage);
bgLayer.draw();

// Function for a less obtrusive in-game message:
function updateMiniMessage(text, colour) {
    miniMessage.text(text);
    miniMessage.fill(colour);
    miniMessage.opacity(1);
    miniMessage.show();
    bgLayer.draw();
    // Fade away:
    new Konva.Tween({
        node: miniMessage,
        opacity: 0,
        duration: 1.5,
    }).play();
}
updateMiniMessage('Messager ready', 'salmon');