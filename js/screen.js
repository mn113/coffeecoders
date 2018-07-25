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
        this.bug = new Konva.Text({
            width: 8,
            height: 4,
            text: "BUG",
            fontSize: 2,
            stroke: 'red',
            strokeWidth: 0.2,
            visible: true
        });
        this.greenCode = new Konva.Text({
            width: 16,
            height: 32,
            text: "math =\n\troot:   Math.sqrt\n\tsquare: square\n\tcube:   (x) -> x * square x\nclass TimeMachine\n\tconstructor: (pilot) ->\n\t\t@pilot = pilot".repeat(3),
            fontSize: 2,
            stroke: '#00FF00',
            strokeWidth: 0.2,
        });
        screenClipGroup.add(blackScreen, this.bug, this.greenCode);
        screensLayer.add(screenClipGroup);
        screensLayer.draw();        
    }

    writeCode() {
        this.greenCode.show();
        // Scroll green text by one line:
        this.greenCode.offsetY(this.greenCode.offsetY() + 2);
        // Reset before off screen:
        if (this.greenCode.offsetY() >= 24) this.greenCode.offsetY(0);
        screensLayer.draw();                
    }

    writeBug() {
        // Briefly superimpose red bug
        this.bug.x(8 * Math.random());
        this.bug.y(12 * Math.random());
        this.bug.show();
        screensLayer.draw();
        setTimeout(function() {
            this.bug.hide();
            screensLayer.draw();
        }.bind(this), 750);
    }

    fixBug() {
        // Use filters to tweak hue of green text:
        this.greenCode.show();
        this.greenCode.cache();
        this.greenCode.filters([Konva.Filters.HSL, Konva.Filters.Noise]);
        this.greenCode.hue(this.greenCode.hue() + 180);  // keep flipping hue as time ticks by
        this.greenCode.noise(0.5);
        screensLayer.draw();
    }

    sleep() {
        this.greenCode.hide();
        screensLayer.draw();                
    }
}
