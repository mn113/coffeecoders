// Creates a screen with code on it
class Screen {
    constructor(coderPos) {
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
            text: "math =\n\troot:   Math.sqrt\n\tsquare: square\n\tcube:   (x) -> x * square x\nclass TimeMachine\n\tconstructor: (pilot) ->\n\t\t@pilot = pilot".repeat(3),
            fontSize: 2,
            stroke: '#00FF00',
            strokeWidth: 0.2,
        });
        this.bug = new Konva.Text({
            width: 8,
            height: 4,
            text: "BUG",
            fontSize: 2,
            fontVariant: 'bold',
            stroke: 'red',
            strokeWidth: 0.2,
            visible: true
        });
        screenClipGroup.add(blackScreen, this.greenCode, this.bug); // ordering makes bug appear on top of code
        screensLayer.add(screenClipGroup);
        screensLayer.draw();        
    }

    writeCode() {
        this.greenCode.show();
        this.greenCode.filters([]);
        // Scroll green text by one line:
        this.greenCode.offsetY(this.greenCode.offsetY() + 2);
        // Reset before off screen:
        if (this.greenCode.offsetY() >= 24) this.greenCode.offsetY(0);
        screensLayer.draw();                
    }

    writeBug() {
        // Briefly superimpose red bug
        this.bug.x(8 * Math.random());
        this.bug.y(24 * Math.random()); // off the screen half the time
        this.bug.show();
        screensLayer.draw();
    }

    fixBug() {
        // Use filters to tweak hue of text:
        this.greenCode.show();
        this.bug.hide();
        this.greenCode.cache();
        this.greenCode.filters([Konva.Filters.HSL]);
        this.greenCode.hue(50 * GAME.timeLeft);  // keep flipping hue as time ticks by
        screensLayer.draw();
    }

    sleep() {
        this.greenCode.hide();
        this.bug.hide();
        screensLayer.draw();                
    }
}
