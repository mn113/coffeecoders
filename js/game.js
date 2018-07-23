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

var coderPositions = [
    {x:147, y:123},
    {x:207, y:123},
    {x:267, y:123},
    {x:327, y:123}
];

// Render coders:
for (var i = 0; i < coders.length; i++) {
    let pos = coderPositions[i];
    renderCoder(pos);
    renderLabel(pos, coders[i].name);
    renderTag(pos, '☕');
    renderCaffBar(pos, coders[i].caffeine);
}

// Add delegated hover event listeners to coders:
fgLayer.on('mouseover', function(evt) {
    var shape = evt.target;
    if (shape.className == 'Image') {
        document.body.style.cursor = 'pointer';
        shape.scaleX(1.2);
        shape.scaleY(1.2);
        console.log(shape);
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
});

function renderCoder(pos) {
    let imageObj = new Image();
    imageObj.src = `https://avatars.dicebear.com/v2/male/coder.${pos.x}.${pos.y}.svg`;
    imageObj.onload = function() {
        let coderImg = new Konva.Image({
            image: imageObj,
            x: pos.x,
            y: pos.y,
            width: 24,
            height: 24,
            offset: {
                x: 12,
                y: 12
            }
        });
        fgLayer.add(coderImg);
        fgLayer.draw();
        console.log(`Loaded coderImg @ ${pos.x},${pos.y}`);
    };
}

function renderLabel(pos, content) {
    // create label
    var coderLabel = new Konva.Label({
        x: pos.x - 30,
        y: pos.y - 30,
        //visible: false
    });
    
    // add text to the label
    coderLabel.add(new Konva.Text({
        text: content,
        fontFamily: 'monospace',
        fontVariant: 'bold',
        fontSize: 10,
        padding: 2,
        fill: '#c0ffee',
        stroke: 'black',
        strokeWidth: 0.25
    }));

    fgLayer.add(coderLabel);
}

function renderTag(pos, content) {
    // create label
    var tagLabel = new Konva.Label({
        x: pos.x + 12,
        y: pos.y
    });
    
    // add a tag to the label
    tagLabel.add(new Konva.Tag({
        fill: '#eee',
        stroke: '#333',
        strokeWidth: 1,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: [10, 10],
        shadowOpacity: 0.2,
        lineJoin: 'round',
        pointerDirection: 'left',
        pointerWidth: 5,
        pointerHeight: 5,
        cornerRadius: 3
    }));
    
    // add text to the label
    tagLabel.add(new Konva.Text({
        text: content,
        fontSize: 10,
        padding: 2
    }));

    fgLayer.add(tagLabel);
}

function renderCaffBar(pos, value) {
    var caffBar = new Konva.Rect({
        x: pos.x - 12,
        y: pos.y + 20,
        width: 24,
        height: 5,
        fillLinearGradientStartPoint: {x: 0, y: 0},
        fillLinearGradientEndPoint: {x: 24, y: 0},
        fillLinearGradientColorStops: [0, 'brown', value, 'brown', value, 'black', 1, 'black'],
        stroke: 'white',
        strokeWidth: 0.5
    });

    fgLayer.add(caffBar);
}

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



const foods = ['🍩','🥐','🍪'];

const GAME = {
    loc: 0,
    bugs: 0,
    timeLeft: 5,
    target: {
        loc: 1000,
        bugs: 1000
    }
};


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
