//Code on screens...
class Screen {
    constructor(coderPos) {
        console.log("new Screen @", coderPos);
        this.x = coderPos.x - 10;
        this.y = coderPos.y - 4;
        
        var screenClipGroup = new Konva.Group({
            x: coderPos.x - 10,
            y: coderPos.y - 4,
            clip: {
                x: 0,
                y: 0,
                width: 16,
                height: 12
            },
            scaleX: -1
        });
        var blackScreen = new Konva.Rect({
            width: 16,
            height: 12,
            fill: 'black',
            stroke: 'lightgray',
            strokeWidth: 0.5,
            opacity: 0.5
        });
        this.greenCode = new Konva.Text({
            width: 16,
            height: 32,
            text: "math =\n\troot:   Math.sqrt\n\tsquare: square\n\tcube:   (x) -> x * square x\n".repeat(3),
            fontSize: 2,
            stroke: '#00FF00',
            strokeWidth: 0.2,
        });
        screenClipGroup.add(blackScreen, this.greenCode);
        screensLayer.add(screenClipGroup);
        screensLayer.draw();        

        //return this;
    }

    render() {
        // needed?
    }

    writeCode() {
        this.greenCode.show();
        // Scroll green text by one line:
        this.greenCode.offsetY(this.greenCode.offsetY() + 2);
        // Reset before off screen:
        if (this.greenCode.offsetY() >= 20) this.greenCode.offsetY(0);
        screensLayer.draw();                
    }

    writeBug() {
        // Briefly superimpose red bug?
        var bug = new Konva.Text({
            width: 16,
            height: 4,
            text: "BUG",
            fontSize: 2,
            stroke: 'red',
            strokeWidth: 0.2,
        });
        screenClipGroup.add(bug);
        screensLayer.draw();
    }

    fixBug() {
        // Use filters to tweak hue of green text:
        //var bugColor = Konva.Util.getRandomColor();
        this.greenCode.show();
        this.greenCode.cache();
        this.greenCode.filter([Konva.Filters.HSL, Konva.Filters.Noise]);
        this.greenCode.hue(Math.random() * 360);
        this.greenCode.noise(0.5);
        screensLayer.draw();
    }

    sleep() {
        this.greenCode.hide();
        screensLayer.draw();                
    }
}
