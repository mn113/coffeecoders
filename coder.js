
const GAME = {
    loc: 0,
    bugs: 0,
    timeLeft: 60,
    target: {
        loc: 10000,
        bugs: 100
    }
};

// Select an element at random from array, delete it and return it:
Array.prototype.pluck = function() {
    var index = Math.floor(Math.random() * this.length);
    return this.splice(index, 1);
}

var names = {
    male: ["Egbert", "Franck", "Joe", "Chi-Bo", "Phil", "Fredo"],
    female: ["Aroma", "Illy", "Jo", "Flo"],
    last: ["Neska-Fay", "Lavatsa", "Schlurpp", "Bean", "Nero", "Stahbux", "Koorig", "Cupp"]
};

class Coder {
    constructor() {
        this.sex = (Math.random() > 0.5) ? 'male' : 'female';
        this.name = this.makeName(this.sex);
        this.imgUrl = `https://avatars.dicebear.com/v2/${this.sex}/${this.name}.svg`;
        this.caffeine = 0.3 + Math.random() * 0.4;
        this.tolerance = 0.3 + Math.random() * 0.4;
        this.falloff = 0.3 + Math.random() * 0.4;
        this.coffeePreference = Math.floor(Math.random() * 6);
        this.mode = 'coding';
    }

    toString() {
        return `${this.name}: caf=${this.caffeine}, tol=${this.tolerance}, fal=${this.falloff}, mode=${this.mode}`;
    }

    log() {
        console.log(this.toString());        
    }

    makeName(sex) {
        return names[sex].pluck() + ' ' + names['last'].pluck();
    }

    addCoffee(strength) {
        this.caffeine += strength / 10;
        this.caffeine = Math.min(1, this.caffeine);
        this.tolerance += 0.03;
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

    wantSugar() {
        console.log(`${this.name} wants a donut`);
    }

    tick() {
        switch (this.mode) {
            case 'coding':
                this.writeCode();
                this.writeBugs();    
                break;
            
            case 'debugging':
                this.fixBugs();
                break;

            case 'sleeping':
                this.sleep();
                break;
        }
        this.caffeine -= 0.1 * this.falloff; // make geometric?
        this.caffeine = Math.max(0, this.caffeine);

        if (Math.random() > 0.8) this.wantSugar();
    }
}

// make 3 coders:
var n = 1;
var coders = [];
for (var i = 0; i < n; i++) {
    coders.push(new Coder());
}
// game loop:
setInterval(() => {
    for (c of coders) {
        c.tick();
        c.log();
    }
    console.info(`${GAME.loc} loc / ${GAME.bugs} bugs`);
    GAME.timeLeft -= 0.25;
    if (GAME.timeLeft * 4 % 4 === 0) console.log(GAME.timeLeft);
}, 250);
