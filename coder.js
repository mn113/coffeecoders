
const GAME = {
    modes: {
        0: "code",
        1: "debug",
        2: "sleep"
    },
    loc: 0,
    bugs: 0,
    timer: null,
};

var lastNames = ["Ka'fay", "Javar", "Schlurpp", "Arabica", "Nero", "Stanburk"];

class Coder {
    constructor() {
        this.caffeine = 0.3 + Math.random() * 0.4;
        this.tolerance = 0.3 + Math.random() * 0.4;
        this.falloff = 0.3 + Math.random() * 0.4;
        this.mode = 0;
        this.makeName();
    }

    toString() {
        return `${this.name}: caf=${this.caffeine}, tol=${this.tolerance}, fal=${this.falloff}, mode=${GAME.modes[this.mode]}-ing`;
    }

    log() {
        console.log(this.toString());        
    }

    makeName() {
        var index = Math.floor(Math.random() * lastNames.length)
        this.name = lastNames[index];
        lastNames.splice(index, 1);
    }

    addCoffee(strength) {
        this.caffeine += strength / 10; // NEEDS MAX
    }

    writeCode() {
        GAME.loc += Math.ceil(10 * this.caffeine);
    }

    writeBugs() {
        GAME.bugs += Math.ceil(2 * this.caffeine);
    }

    fixBugs() {
        GAME.bugs -= Math.ceil(2 * this.caffeine);
    }

    sleep() {
        this.sleepNeeded--;
    }

    tick() {
        switch (this.mode) {
            case 0:
                this.writeCode();
                this.writeBugs();    
                break;
            
            case 1:
                this.fixBugs();
                break;

            case 2:
                this.sleep();
                break;
        }
        this.caffeine -= 0.1 * this.falloff;
    }
}

// make 3 coders:
var n = 3;
var coders = [];
for (var i = 0; i < n; i++) {
    coders.push(new Coder());
}
setInterval(() => {
    for (c of coders) {
        c.tick();
        c.log();
    }
}, 250);
