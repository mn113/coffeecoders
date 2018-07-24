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