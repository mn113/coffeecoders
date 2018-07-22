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

for (let i = 0; i < coderPositions.length; i++) {
    let p = coderPositions[i];
    console.log(p);
    let imageObj = new Image();
    imageObj.src = `https://avatars.dicebear.com/v2/male/coder.${p.x}.${p.y}.svg`;
    imageObj.onload = function() {
        var coderImg = new Konva.Image({
            image: imageObj,
            x: p.x,
            y: p.y,
            width: 24,
            height: 24,
            offset: {
                x: 12,
                y: 12
            }
        });
        //coderImg.image(imageObj);
        fgLayer.add(coderImg);
        fgLayer.draw();
        console.log(`Loaded coderImg ${i} @ ${p.x},${p.y}`);
    };
}

// use event delegation to update pointer style
fgLayer.on('mouseover', function(evt) {
    var shape = evt.target;
    document.body.style.cursor = 'pointer';
    shape.scaleX(1.2);
    shape.scaleY(1.2);
    console.log(shape);
    fgLayer.draw();
});
fgLayer.on('mouseout', function(evt) {
    var shape = evt.target;
    document.body.style.cursor = 'default';
    shape.scaleX(1);
    shape.scaleY(1);
    fgLayer.draw();
});


const GAME = {
    loc: 0,
    bugs: 0,
    timeLeft: 10,
    target: {
        loc: 1000,
        bugs: 1000
    }
};

// make 3 coders:
var n = 1;
var coders = [];
for (var i = 0; i < n; i++) {
    coders.push(new Coder());
}
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
