// Choose random element from array:
Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
}

// Select an element at random from array, delete it and return it:
Array.prototype.pluck = function() {
    var index = Math.floor(Math.random() * this.length);
    return this.splice(index, 1)[0];
}

const names = {   // need 12 of each
    male: ["Egbert", "Franck", "Joe", "Chi-Bo", "Phil", "Fredo", "George", "Elliott"],
    female: ["Aroma", "Illy", "Jo", "Flo", "Cath", "Maureen", "Heather", "Steamy"],
    last: ["Neska-Fay", "Lavatsa", "Schlurpp", "Stahbux", "Bean", "Nero",
            "Q. Rigg", "Macupp", "Black", "Press", "Robusta", "DiCaff"]
};

const modes = ['💤']

class Coder {
    constructor(pos) {
        this.pos = pos;
        this.sex = (Math.random() > 0.5) ? 'male' : 'female';
        this.fname = names[this.sex].pluck();
        this.lname = names['last'].pluck();
        //this.imgUrl = `https://avatars.dicebear.com/v2/${this.sex}/${this.fname}.svg`;    // CROSS-ORIGIN
        this.imgUrl = `img/avatars/${this.sex}/${this.fname}.svg`;
        this.mode = 'coding';
        this.caffeine = 0.3 + Math.random() * 0.4;
        this.tolerance = 0.3 + Math.random() * 0.4;
        this.falloff = 0.3 + Math.random() * 0.4;
        this.coffeePreference = Math.floor(Math.random() * 7);  // index of coffees
        this.craving = null;    // can be a coffee or a food
        this.toDrink = 0;       // empty cup
        this.konvaImg = null;   // Konva shape
        // Attach a new screen to each coder:
        this.screen = new Screen(pos);

        this.render();
    }

    toString() {
        return `${this.fname} @ (${this.pos.x},${this.pos.y}):
                caf=${this.caffeine}, tol=${this.tolerance}, fal=${this.falloff}, mode=${this.mode}`;
    }

    log() {
        console.log(this.toString());        
    }

    writeCode() {
        GAME.loc += Math.ceil(10 * this.caffeine);
        this.screen.writeCode();
    }

    writeBugs() {
        GAME.bugs += Math.ceil(0.5 * this.caffeine);
        this.screen.writeBug();
    }

    fixBug() {
        GAME.bugs -= Math.ceil(2 * this.caffeine);
        this.screen.fixBug();
    }

    sleep() {
        this.sleepNeeded--;
        this.screen.sleep();
    }

    wantCoffee() {
        var coffee = coffees[this.coffeePreference];
        this.craving = coffee;
        this.renderBubble(this.coffeePreference);
        this.bubble.show();
        fgLayer.draw();
        console.log(`${this.fname} wants a ${coffee.name}`);
    }

    wantSugar() {
        var treat = foods.random();
        this.craving = treat;
        this.renderBubble(treat.icon);
        this.bubble.show();
        fgLayer.draw();
        console.log(`${this.fname} wants a ${treat.name}`);
        // Time it out:
        setTimeout(() => {
            this.craving = null;
            this.bubble.hide();
            fgLayer.draw();
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
        imageObj.src = me.imgUrl;
        imageObj.onload = function() {
            me.konvaImg = new Konva.Image({
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
            fgLayer.add(me.konvaImg);
            fgLayer.draw();
            console.log(`Loaded coder ${me.fname} @ ${me.pos.x},${me.pos.y}`);
            me.renderNameLabel();
            me.renderBubble('?');
            me.wireUp();
        };
    }
    
    // Bind event listeners to the coder's image (run once):
    wireUp() {
        var me = this;
        me.konvaImg.on('mouseover', function(evt) {
            var shape = evt.target;
            if (shape.className == 'Image') {
                document.body.style.cursor = 'pointer';
                console.log(me);
                me.nameLabel.show();
                me.highlight();
            }
        }).on('mouseout', function(evt) {
            var shape = evt.target;
            if (shape.className == 'Image') {
                document.body.style.cursor = 'default';
                me.nameLabel.hide();
                me.unhighlight();
            }
        }).on('click', function() {
            if (GAME.activeTool == 'code') me.mode = 'coding';
            else if (GAME.activeTool == 'fixbugs') me.mode = 'fixing';
            else if (GAME.activeTool == 'sleep') me.mode = 'sleeping';
            highlightMenu(0);
        })
        .on('dragenter', function() {
            me.highlight();
        })
        .on('dragleave', function() {
            me.unhighlight();
        })
        .on('drop', function() {
            console.log(`Dropped ${activeCoffee.name()} on ${me.fname}`);
            me.addCoffee(activeCoffee);
            // Destroy coffee
            activeCoffee.destroy();
            activeCoffee = null;
        });
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
            text: this.fname + ' ' + this.lname,
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
            fillLinearGradientColorStops: [0, 'chocolate', value, 'chocolate', value, 'black', 1, 'black'],
            stroke: 'white',
            strokeWidth: 0.5
        });
    
        fgLayer.add(this.caffBar);
        this.caffBar.draw();
    }

    // Lighten image:
    highlight() {
        this.konvaImg.cache();
        this.konvaImg.filters([Konva.Filters.Brighten]);
        this.konvaImg.brightness(0.15);
        fgLayer.draw();
    }

    // Reset image lightness:
    unhighlight() {
        this.konvaImg.cache();
        this.konvaImg.filters([]);
        fgLayer.draw();
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
                this.fixBug();
                break;

            case 'sleeping':
                this.sleep();
                break;
        }
        // Use up available coffee:
        this.toDrink -= 0.2;    // sips 1/5 of an Espresso per tick
        this.toDrink = Math.max(0, this.toDrink);
        this.caffeine -= 0.02 * this.falloff; // make geometric?
        this.caffeine = Math.max(0.1, this.caffeine);
        this.renderCaffBar(this.caffeine);

        // Initialise new food/drink craving?
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
    {x:327, y:123},
    {x:147, y:173},
    {x:207, y:173},
    {x:267, y:173},
    {x:327, y:173},
    {x:147, y:223},
    {x:207, y:223},
    {x:267, y:223},
    {x:327, y:223}
];

// make 2 coders:
var n = 2;
var coders = [];
for (var i = 0; i < n; i++) {
    coders.push(new Coder(coderPositions[i]));
}
