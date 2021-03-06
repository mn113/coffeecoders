// Choose random element from array:
Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
}

// Select an element at random from array, delete it and return it:
Array.prototype.pluck = function() {
    var index = Math.floor(Math.random() * this.length);
    return this.splice(index, 1)[0];
}

const names = {   // need 12 of each (9 ok!)
    male: ["Egbert", "Franck", "Joe", "Chi-Bo", "Phil", "Fredo", "George", "Elliott", "Zak"],
    female: ["Aroma", "Illy", "Jo", "Flo", "Cath", "Maureen", "Heather", "Steamy", "Barbara"],
    last: ["Neska-Fay", "Lavatsa", "Schlurpp", "Stahbux", "Bean", "Nero",
            "Q. Rigg", "Macupp", "Black", "Press", "Robusta", "DiCaff"]
};

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
        this.craving = null;    // can be a coffee or a treat
        this.toDrink = 0;       // empty cup
        this.konvaImg = null;   // Konva shape
        // Attach a new screen to each coder:
        this.screen = new Screen(pos);

        this.render();
    }

    // Utility logger 1:
    toString() {
        return `${this.fname} @ (${this.pos.x},${this.pos.y}):
                caf=${this.caffeine}, tol=${this.tolerance}, fal=${this.falloff}, mode=${this.mode}`;
    }

    // Utility logger 2:
    log() {
        console.log(this.toString());        
    }

    // Render the coder's face (run once):
    render() {
        var me = this;
        var imageObj = new Image(24,24);
        imageObj.src = me.imgUrl;
        imageObj.onload = function() {
            me.konvaImg = new Konva.Image({
                name: 'coder ' + me.fname,
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
            me.createNameLabel();
            me.createBubble();
            me.createCaffBar(me.caffeine);
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
                //console.log(me);
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
            if (GAME.activeTool == 'code') {
                me.mode = 'coding';
                updateMiniMessage(`${me.fname} is on coding`, 'salmon');
            }
            else if (GAME.activeTool == 'fixbugs') {
                me.mode = 'fixing';
                updateMiniMessage(`${me.fname} is on bugfixing`, 'salmon');
            }
            highlightMenu(0);
        })
        .on('dragenter', function() {
            me.highlight();
        })
        .on('dragleave', function() {
            me.unhighlight();
        })
        .on('drop', function() {
            // Was it a coffee or a treat?
            //console.log(tempLayer.children);    // Konva.Collection [0]
            //console.log(`Dropped ${GAME.activeCoffee.name} on ${me.fname}`);
            //me.addCoffee(GAME.activeCoffee);
            // Destroy coffee
            //GAME.activeCoffee.coffeeObj.destroy();   // FIXME:
            //GAME.activeCoffee = null;
            //fgLayer.draw();
            //coffeeLayer.draw();
        });
    }

    // Add a name label above the coder (run once):
    createNameLabel() {
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
    
    // Add a speech bubble comprised of Label > Tag, Text, Image (run once):
    createBubble() {
        this.bubble = new Konva.Label({
            x: this.pos.x + 12,
            y: this.pos.y,
            visible: false
        });
        
        // Add a tag (the speech bubble itself) to the label:
        this.bubble.add(new Konva.Tag({
            width: 20,
            height: 22,
            fill: '#ddd',   // makes white coffee stand out
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
        
        // Add text to the label (for Treat emoji):
        this.bubble.add(new Konva.Text({
            text: '',
            fontSize: 12,
            padding: 2
        }));

        // Add image placeholder (for Coffee icon):
        this.bubble.add(new Konva.Image({
            image: null,
            x: 4,
            y: -10,
            width: 18,
            height: 18
        }));
    
        fgLayer.add(this.bubble);
    }

    // Change the text content of the speech bubble:
    updateBubble(item) {
        if (item.icon) {
            // Treat: show Text and hide Image
            this.bubble.getChildren()[1].text(item.icon);
            this.bubble.getChildren()[2].hide();
        }
        else {
            // Coffee: show Image and hide Text
            var imgObj = new Image();
            imgObj.src = item.img;
            this.bubble.getChildren()[1].text("    ");
            this.bubble.getChildren()[2].image(imgObj).show();
        }
        this.bubble.show();
    }

    // Render a bar graph of the caffeine level (run once):
    createCaffBar(value) {
        this.caffBar = new Konva.Rect({
            x: this.pos.x - 12,
            y: this.pos.y + 20,
            width: 24,
            height: 5,
            fillLinearGradientStartPoint: {x: 0, y: 0},
            fillLinearGradientEndPoint: {x: 24, y: 0},
            fillLinearGradientColorStops: [0, 'chocolate', value, 'chocolate', value + 0.001, 'black', 1, 'black'],
            stroke: 'white',
            strokeWidth: 0.5
        });
    
        fgLayer.add(this.caffBar);
        this.caffBar.draw();
    }

    // Update bar's value (every tick):
    updateCaffBar(value) {
        if (!this.caffBar) return;  // safeguard in case it's updated before created
        // Replicate the gradient settings with new color stop value:
        this.caffBar.setFillLinearGradientColorStops([0, 'chocolate', value, 'chocolate', value + 0.001, 'black', 1, 'black']);
        this.caffBar.draw();
    }

    /*
     * Screen-based methods:
     */
    writeCode() {
        GAME.loc += Math.round(this.caffeine * (13 + Math.random() * 4));
        this.screen.writeCode();
    }

    writeBugs() {
        GAME.bugs += Math.round(this.caffeine * (6 + Math.random() * 8));
        this.screen.writeBug();
    }

    fixBug() {
        GAME.bugs -= Math.round(this.caffeine * (8 + Math.random() * 4));
        GAME.bugs = Math.max(GAME.bugs, 0);
        this.screen.fixBug();
    }

    /*
     * Coffee & Treat-based methods:
     */
    wantCoffee() {
        var coffee = coffees[this.coffeePreference];
        this.craving = coffee;
        this.updateBubble(coffee);
        this.bubble.show();
        fgLayer.draw();
        updateMiniMessage(`${this.fname} wants a ${coffee.name}`, '#C0FFEE');
        console.log(`${this.fname} wants a ${coffee.name}`);
    }

    wantSugar() {
        var treat = treats.random();
        this.craving = treat;
        this.updateBubble(treat);
        this.bubble.show();
        fgLayer.draw();
        updateMiniMessage(`${this.fname} wants a ${treat.name}`, '#C0FFEE');
        console.log(`${this.fname} wants a ${treat.name}`);
        // Time it out:
        setTimeout(() => {
            this.craving = null;
            this.bubble.hide();
            fgLayer.draw();
        }, 3500 + 1000 * Math.random());
    }

    addCoffee(coffee) {
        console.info('Add', coffee);
        sounds.play('slurp');

        this.bubble.hide();

        GAME.caffeineConsumed += coffee.strength * 50;  // based on 50mg of caffeine in single espresso shot

        // Affect coder stats (more if preference matched):
        if (coffee.index === this.coffeePreference) {
            sounds.play(this.sex == 'male' ? 'mmmhis' : 'mmmhers');
            this.caffeine += coffee.strength / 3;
            this.tolerance += 0.03;
            this.falloff -= 0.03;    
        }
        else {
            this.caffeine += coffee.strength / 5;
            this.tolerance += 0.02;
            this.falloff -= 0.02;    
        }
        this.caffeine = Math.min(0.999, this.caffeine);

        this.toDrink = coffee.strength;
        // Drink it then reset craving:
        setTimeout(() => {
            this.craving = null;
        }, 1000 * coffee.strength);

        // Change preference:
        this.coffeePreference = Math.floor(Math.random() * 7);  // index of coffees
    }

    addSugar(treat) {
        console.info('Sugar', treat);
        sounds.play('sugar');

        this.bubble.hide();

        // Benefits:
        this.writeCode();
        this.fixBug();
        if (this.craving && this.craving.name == treat.name) {
            sounds.play(this.sex == 'male' ? 'mmmhis' : 'mmmhers');
            // Stats boost
            this.tolerance += 0.25;
            this.falloff -= 0.25;
        }
        this.craving = null;
    }

    // Lighten image:
    highlight() {
        this.konvaImg.cache();
        this.konvaImg.filters([Konva.Filters.Brighten]);
        this.konvaImg.brightness(0.125);
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
        switch (this.mode) {
            case 'coding':
                this.writeCode();
                this.writeBugs();
                break;
            
            case 'fixing':
                this.fixBug();
                break;
        }
        // Use up available coffee:
        this.toDrink -= 0.2;    // sips 1/5 of an Espresso per tick
        this.toDrink = Math.max(0, this.toDrink);
        this.caffeine -= 0.005 * this.falloff;
        this.caffeine = Math.max(0.1, this.caffeine);
        this.updateCaffBar(this.caffeine);

        // Initialise new food/drink craving?
        if (!this.craving) {
            if (Math.random() > 0.975) this.wantSugar();
            else if (this.toDrink <= 0 && this.caffeine < 0.333 && Math.random() > 0.925) this.wantCoffee();
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
