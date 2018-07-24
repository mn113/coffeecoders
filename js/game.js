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

// Coffee machine hit region:
var coffeeMachine = new Konva.Rect({
    x: 84,
    y: 64,
    width: 24,
    height: 36,
    fill: 'yellow',
    opacity: 0.5
});
coffeeMachine.on('click', function() {
    openCoffeeMenu();
});
fgLayer.add(coffeeMachine);

// Load the 7 coffee images:
var coffeeOrigin = {x: 100, y: 70};
var coffeeGroup = new Konva.Group({
    visible: false
});
function loadCoffees() {
    for (let i = 0; i < coffees.length; i++) {
        console.log(coffees[i]);
        let img = new Image(24,24);
        img.src = coffees[i].img;
        img.onload = function() {
            var imgObj = new Konva.Image({
                image: img,
                x: coffeeOrigin.x,
                y: coffeeOrigin.y,
                offset: {
                    x: 12,
                    y: 12
                },
                opacity: 0
            });
            // Interactivity:
            imgObj.on('mouseover', function() {
                this.cache();
                this.filters([Konva.Filters.Invert]);
                fgLayer.draw();
            })
            .on('mouseout', function() {
                this.cache();
                this.filters([]);
                fgLayer.draw();
            })
            .on('click', function() {
                brewCoffee(i);
                closeCoffeeMenu();
            });
            coffeeGroup.add(imgObj);
            // Store for later:
            coffees[i].imgObj = imgObj;
        };
    }
    fgLayer.add(coffeeGroup);
    fgLayer.draw();
}
loadCoffees();

// Calculate positions of objects around a ring:
function ringPos(centre, total, radius) {
    var positions = [];
    var theta = 2 * Math.PI / total;
    for (var i = 0; i < total; i++) {
        positions.push({
            x: centre.x + radius * Math.cos(i * theta),
            y: centre.y + radius * Math.sin(i * theta)
        });
    }
    return positions;
}

// Animate coffee icons into a ring:
function openCoffeeMenu() {
    var positions = ringPos(coffeeOrigin, coffees.length, 20);
    console.log('positions', positions);
    coffeeGroup.show();
    for (var i = 0; i < coffees.length; i++) {
        //coffees[i].imgObj.position(positions[i]);
        let tween = new Konva.Tween({
            node: coffees[i].imgObj,
            x: positions[i].x,
            y: positions[i].y,
            opacity: 1,
            duration: 1,
            easing: Konva.Easings.EaseOut
        });
        tween.play();
    }
    fgLayer.draw();
}

function closeCoffeeMenu() {
    for (var i = 0; i < coffees.length; i++) {
        let tween = new Konva.Tween({
            node: coffees[i].imgObj,
            x: coffeeOrigin.x,
            y: coffeeOrigin.y,
            opacity: 0,
            duration: 1,
            easing: Konva.Easings.EaseOut
        });
        tween.play();
    }
    fgLayer.draw();
}

function brewCoffee(index) {
    console.log("Selected", coffees[index].name);
    // Block menu
    // Play animation
    // Add coffee Image, draggable
}

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
