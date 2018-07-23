// Choose random element from array:
Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
}

// Select an element at random from array, delete it and return it:
Array.prototype.pluck = function() {
    var index = Math.floor(Math.random() * this.length);
    return this.splice(index, 1);
}

const names = {   // need 12 of each
    male: ["Egbert", "Franck", "Joe", "Chi-Bo", "Phil", "Fredo"],
    female: ["Aroma", "Illy", "Jo", "Flo", "Cath"],
    last: ["Neska-Fay", "Lavatsa", "Schlurpp", "Bean", "Nero", "Stahbux", "Q. Rigg", "Macupp"]
};

const modes = ['💤']

const coffees = [
    {name: 'Americano', strength: 0.8, img: 'img/americano.svg', imgObj: null},
    {name: 'Latte', strength: 0.9, img: 'img/latte.svg', imgObj: null},
    {name: 'Cappuccino', strength: 1, img: 'img/cappuccino.svg', imgObj: null},
    {name: 'Espresso', strength: 1, img: 'img/espresso.svg', imgObj: null},
    {name: 'Mocha', strength: 1.3, img: 'img/moccacino.svg', imgObj: null},
    {name: 'Iced Coffee', strength: 1.5, img: 'img/frappuccino.svg', imgObj: null},
    {name: 'Double Espresso', strength: 2, img: 'img/espresso-doppio.svg', imgObj: null}
];

const foods = [
    {name: 'Donut', icon: '🍩'},
    {name: 'Croissant', icon: '🥐'},
    {name: 'Cookie', icon: '🍪'}
];

class Coder {
    constructor(pos) {
        this.pos = pos;
        this.sex = (Math.random() > 0.5) ? 'male' : 'female';
        this.name = this.makeName(this.sex);
        this.imgUrl = `https://avatars.dicebear.com/v2/${this.sex}/${this.name}.svg`;
        this.mode = 'coding';
        this.caffeine = 0.3 + Math.random() * 0.4;
        this.tolerance = 0.3 + Math.random() * 0.4;
        this.falloff = 0.3 + Math.random() * 0.4;
        this.coffeePreference = Math.floor(Math.random() * 7);  // index of coffees
        this.craving = null; // can be a coffee or a food
        this.toDrink = 0; // empty cup
    }

    toString() {
        return `${this.name} @ (${this.pos.x},${this.pos.y}):
                caf=${this.caffeine}, tol=${this.tolerance}, fal=${this.falloff}, mode=${this.mode}`;
    }

    log() {
        console.log(this.toString());        
    }

    // Generate a first and last name for this coder:
    makeName(sex) {
        return names[sex].pluck() + ' ' + names['last'].pluck();
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

    wantCoffee() {
        var coffee = coffees[this.coffeePreference];
        this.craving = coffee;
        this.renderBubble(this.coffeePreference);
        this.bubble.show();
        console.log(`${this.name} wants a ${coffee.name}`);
    }

    wantSugar() {
        var treat = foods.random();
        this.craving = treat;
        this.renderBubble(treat.icon);
        this.bubble.show();
        console.log(`${this.name} wants a ${treat.name}`);
        // Time it out:
        setTimeout(() => {
            this.craving = null;
            this.bubble.hide();
        }, 3000 + 1000 * Math.random());
    }

    // Inject coffee, altering coder's stats:
    addCoffee(coffee) {
        this.caffeine += coffee.strength / 10;
        this.caffeine = Math.min(1, this.caffeine);
        this.tolerance += 0.03;
        this.falloff -= 0.03;
        // TODO: render cup on desk?
        this.toDrink = coffee.strength;
        setTimeout(() => {
            this.craving = null;
        }, 1000 * coffee.strength);
    }

    // Render the coder's face (run once):
    render() {
        var me = this;
        var imageObj = new Image(24,24);
        imageObj.src = `https://avatars.dicebear.com/v2/${this.sex}/${this.name}.svg`;
        imageObj.onload = function() {
            me.coderImg = new Konva.Image({
                image: imageObj,
                x: me.pos.x,
                y: me.pos.y,
                width: 24,
                height: 24,
                offset: {
                    x: 12,
                    y: 12
                }
            });
            fgLayer.add(me.coderImg);
            fgLayer.draw();
            console.log(`Loaded coder ${me.name} img @ ${me.pos.x},${me.pos.y}`);
            me.wireUp();
        };
    }
    
    // Bind event listeners to the coder's image:
    wireUp() {
        var me = this;
        this.coderImg.on('mouseover', function(evt) {
            var shape = evt.target;
            if (shape.className == 'Image') {
                document.body.style.cursor = 'pointer';
                shape.scaleX(1.2);
                shape.scaleY(1.2);
                console.log(shape, me);
                me.nameLabel.show();
                fgLayer.draw();
            }
        }).on('mouseout', function(evt) {
            var shape = evt.target;
            if (shape.className == 'Image') {
                document.body.style.cursor = 'default';
                shape.scaleX(1);
                shape.scaleY(1);
                me.nameLabel.hide();
                fgLayer.draw();
            }
        }).on('click', function() {
            if (GAME.activeTool == 'code') me.mode = 'coding';
            else if (GAME.activeTool == 'fixbugs') me.mode = 'fixing';
            else if (GAME.activeTool == 'sleep') me.mode = 'sleeping';
            me.renderModeIndicator();
            highlightMenu(0);
        });
    }

    // Display coder's mode indicator (C|F|S):
    renderModeIndicator() {
        this.modeIndicator = new Konva.Text({
            x: this.pos.x - 22,
            y: this.pos.y + 16,
            text: this.mode.charAt(0).toUpperCase(),
            fontVariant: 'bold',
            fontSize: 10,
            fill: '#c0ffee',
            stroke: 'black',
            strokeWidth: 0.25
        });

        //TODO: clear existing Text

        fgLayer.add(this.modeIndicator);
        fgLayer.draw();
    }
    
    // Add a name label above the coder (run once):
    renderNameLabel() {
        // create label
        this.nameLabel = new Konva.Label({
            x: this.pos.x - 30,
            y: this.pos.y - 30,
            visible: false
        });
        
        // add text to the label
        this.nameLabel.add(new Konva.Text({
            text: this.name,
            fontFamily: 'monospace',
            fontVariant: 'bold',
            fontSize: 10,
            padding: 2,
            fill: '#c0ffee',
            stroke: 'black',
            strokeWidth: 0.25
        }));
    
        fgLayer.add(this.nameLabel);
    }
    
    // Add a speech bubble comprised of a Label, Tag & Text (run once):
    renderBubble(content) {
        // create label
        this.bubble = new Konva.Label({
            x: this.pos.x + 12,
            y: this.pos.y,
            visible: false
        });
        
        // add a tag to the label
        this.bubble.add(new Konva.Tag({
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
        this.bubble.add(new Konva.Text({
            text: content,
            fontSize: 10,
            padding: 2
        }));
    
        fgLayer.add(this.bubble);
    }

    // Render a bar graph of the caffeine level (every tick):
    renderCaffBar(value) {
        this.caffBar = new Konva.Rect({
            x: this.pos.x - 12,
            y: this.pos.y + 20,
            width: 24,
            height: 5,
            fillLinearGradientStartPoint: {x: 0, y: 0},
            fillLinearGradientEndPoint: {x: 24, y: 0},
            fillLinearGradientColorStops: [0, 'brown', value, 'brown', value, 'black', 1, 'black'],
            stroke: 'white',
            strokeWidth: 0.5
        });
    
        fgLayer.add(this.caffBar);
        this.caffBar.draw();
    }

    // Update the coder's stats & re-render stuff on every game tick:
    tick() {
        // TODO: if sleeping, return early

        switch (this.mode) {
            case 'coding':
                this.writeCode();
                this.writeBugs();
                break;
            
            case 'fixing':
                this.fixBugs();
                break;

            case 'sleeping':
                this.sleep();
                break;
        }
        // Use up available coffee:
        this.toDrink -= 0.2;    // sips 1/5 of an Espresso per tick
        this.toDrink = Math.max(0, this.toDrink);
        this.caffeine -= 0.1 * this.falloff; // make geometric?
        this.caffeine = Math.max(0, this.caffeine);
        this.renderCaffBar(this.caffeine);

        if (!this.craving) {
            if (this.toDrink <= 0 && Math.random() > 0.9) this.wantCoffee();
            else if (Math.random() > 0.9) this.wantSugar();
        }
    }
}

// This is where the 12 desks are in the office:
var coderPositions = [
    {x:147, y:123},
    {x:207, y:123},
    {x:267, y:123},
    {x:327, y:123}
];

// make 4 coders:
var n = 4;
var coders = [];
for (var i = 0; i < n; i++) {
    coders.push(new Coder(coderPositions[i]));
}
