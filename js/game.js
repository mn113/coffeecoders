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

// Background:
var bgImg = new Image();
bgImg.src = `img/office.png`;
bgImg.onload = function() {
    bgLayer.draw();
    bgLayer.cache();
    bgLayer.filters([Konva.Filters.Pixelate]);
    bgLayer.pixelSize(10);
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
    console.log(pos);
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
        fontSize: 10,
        padding: 2,
        fill: '#c0ffee',
        stroke: 'black',
        strokeWidth: 0.1
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

const foods = ['🍩','🥐','🍪'];

const GAME = {
    loc: 0,
    bugs: 0,
    timeLeft: 10,
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
