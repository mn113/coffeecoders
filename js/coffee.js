var coffeeMenuOrigin = {x: 90, y: 70};
var coffeeBrewOrigin = {x: 90, y: 90};
var activeCoffee = null;

const coffees = [
    {name: 'Americano', strength: 0.8, img: 'img/americano.png'},
    {name: 'Latte', strength: 0.9, img: 'img/latte.png'},
    {name: 'Cappuccino', strength: 1, img: 'img/cappuccino.png'},
    {name: 'Espresso', strength: 1, img: 'img/espresso.png'},
    {name: 'Mocha', strength: 1.3, img: 'img/moccacino.png'},
    {name: 'Iced Coffee', strength: 1.5, img: 'img/frappuccino.png'},
    {name: 'Double Espresso', strength: 2, img: 'img/espresso-doppio.png'}
];

const foods = [
    {name: 'Donut', icon: '🍩'},
    {name: 'Croissant', icon: '🥐'},
    {name: 'Cookie', icon: '🍪'}
];

// Load a coffee sprite, either for the menu system or for dragging to coders:
class Coffee {
    constructor(index, isMenu = false) {
        this.name = coffees[index].name;
        this.strength = coffees[index].strength;
        this.imgUrl = coffees[index].img;
        this.coffeeObj = null;
        this.index = index;
        this.isMenu = isMenu;

        this.render();      
        console.log("Loaded 1", this.name);
    }

    render() {
        var me = this;
        var img = new Image(24,24);
        img.src = this.imgUrl;
        img.onload = function() {
            me.coffeeObj = new Konva.Image({
                image: img,
                name: this.name,
                x: coffeeMenuOrigin.x,
                y: coffeeMenuOrigin.y,
                offset: {
                    x: 12,
                    y: 12
                }
            });
            // Interactivity:
            me.wireUp();
            coffeeLayer.add(me.coffeeObj);
            coffeeLayer.draw();
        }
    }

    wireUp() {
        var me = this;

        this.coffeeObj
        .on('mouseover', function() {
            document.body.style.cursor = 'pointer';
            this.cache();
            this.filters([Konva.Filters.Brighten]);
            this.brightness(0.2);
            coffeeLayer.draw();
        })
        .on('mouseout', function() {
            document.body.style.cursor = 'default';
            this.cache();
            this.filters([]);
            coffeeLayer.draw();
        });
        // Conditional interactivity:
        if (this.isMenu) {
            this.coffeeObj.opacity(0);
            this.coffeeObj.on('click', function() {
                if (!coffeeMachine.brewing) {
                    coffeeMachine.selectCoffee(this.index);
                    coffeeMachine.closeMenu();
                }
            });
        }
        else {
            this.coffeeObj.x(coffeeBrewOrigin.x);
            this.coffeeObj.y(coffeeBrewOrigin.y);
            this.coffeeObj.draggable(true);
            this.coffeeObj
            .on('mouseover', function() {
                document.body.style.cursor = 'move';
            })
            .on('mouseout', function() {
                document.body.style.cursor = 'pointer';
            })
            .on('dragstart', function() {
                activeCoffee = me;
                coffeeLayer.draw();
            })
            .on('dragend', function() {
                //TODO: check for intersection with coder, if not, springback
            });
        }
    }
}

class CoffeeMachine {
    constructor() {
        // Clone a chunk of the background, to avoid an extra coffee machine graphic:
        this.shape = bgObj.clone({
            crop: {
                x: 76,
                y: 56,
                width: 28,
                height: 44
            },
            rotation: 180,
            draggable: true
        })
        .moveTo(machineLayer);
        machineLayer.draw();

        // Coffee machine hit region:
        this.hitRegion = new Konva.Rect({
            x: 76,
            y: 56,
            width: 28,
            height: 44,
            stroke: 'blue',
            strokeWidth: 0.5,
            opacity: 0.25
        })
        .on('mouseover', () => {
            document.body.style.cursor = 'pointer';
        })
        .on('mouseout', () => {
            document.body.style.cursor = 'default';
        })
        .on('click', () => {
            this.openMenu();
        });

        // Store the coffees here:
        this.icons = [];
        this.brewing = false;

        //machineLayer.add(this.hitRegion, this.shape);

        // Prepare the menu:
        this.loadMenuCoffees();
    }

    // Load the 7 coffee images:
    loadMenuCoffees() {
        for (let i = 0; i < coffees.length; i++) {
            this.icons.push(new Coffee(i, true));
        }
        coffeeLayer.draw();
    }

    // Animate coffee icons into a ring:
    openMenu() {
        var positions = ringPos(coffeeMenuOrigin, coffees.length, 20);
        console.log('positions', positions);
        for (var i = 0; i < coffees.length; i++) {
            let tween = new Konva.Tween({
                node: this.icons[i].coffeeObj,
                x: positions[i].x,
                y: positions[i].y,
                opacity: 1,
                duration: 1,
                easing: Konva.Easings.EaseOut
            });
            tween.play();
        }
        coffeeLayer.draw();
    }

    // Animate menu closed & disable hittability:
    closeMenu() {
        for (var i = 0; i < coffees.length; i++) {
            let tween = new Konva.Tween({
                node: this.icons[i].coffeeObj,
                x: coffeeMenuOrigin.x,
                y: coffeeMenuOrigin.y,
                opacity: 0,
                duration: 1,
                easing: Konva.Easings.EaseOut
            });
            tween.play();
        }
        coffeeLayer.draw();
    }

    // Generate a coffee to be dragged out:
    selectCoffee(index) {
        console.log("Selected", coffees[index].name);
        // Block menu:
        this.brewing = true;
        // TODO: play sound

        // Play animation:
        this.jiggle();
        setTimeout(function() {
            new Coffee(index, false);
            this.brewing = false;
        }, 2000);
    }

    jiggle() {
        var me = this;
        var flipflop = -2;
        var anim = new Konva.Animation(function(frame) {
            // Last 2 seconds:
            if (frame.time > 2000) anim.stop();
            // Jitter left then right, ad infinitum:
            me.shape.offsetX(flipflop);
            flipflop *= -1;
        }, machineLayer);
            
        anim.start();
    }
}

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

// Init:
var coffeeMachine = new CoffeeMachine();