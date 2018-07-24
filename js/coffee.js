var coffeeMenuOrigin = {x: 95, y: 70};
var coffeeBrewOrigin = {x: 95, y: 88};
var activeCoffee = null;

// Load a coffee sprite, either for the menu system or for dragging to coders:
function loadCoffee(index, isMenu = false) {
    var img = new Image(24,24);
    img.src = coffees[index].img;
    img.onload = function() {
        var coffeeObj = new Konva.Image({
            image: img,
            name: coffees[index].name,
            x: coffeeMenuOrigin.x,
            y: coffeeMenuOrigin.y,
            offset: {
                x: 12,
                y: 12
            }
        });
        // Interactivity:
        coffeeObj
        .on('mouseover', function() {
            this.cache();
            this.filters([Konva.Filters.Invert]);
            coffeeLayer.draw();
        })
        .on('mouseout', function() {
            this.cache();
            this.filters([]);
            coffeeLayer.draw();
        });
        // Conditional interactivity:
        if (isMenu) {
            coffeeObj.opacity(0);
            coffeeObj.on('click', function() {
                brewCoffee(index);
                closeCoffeeMenu();
            });
        }
        else {
            coffeeObj.x(coffeeBrewOrigin.x);
            coffeeObj.y(coffeeBrewOrigin.y);
            coffeeObj.draggable(true);
            coffeeObj
            .on('dragstart', function() {
                activeCoffee = coffeeObj;
            });
        }
        coffeeLayer.add(coffeeObj);
        coffeeLayer.draw();

        // Store for later, if not already:
        if (!coffees[index].imgObj) coffees[index].imgObj = coffeeObj;

        console.log("Loaded 1", coffees[index].name);

        return coffeeObj;
    };
}

// Load the 7 coffee images:
function loadMenuCoffees() {
    for (let i = 0; i < coffees.length; i++) {
        loadCoffee(i, true);
    }
    coffeeLayer.draw();
}
loadMenuCoffees();

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

// Animate coffee icons into a ring:
function openCoffeeMenu() {
    var positions = ringPos(coffeeMenuOrigin, coffees.length, 20);
    console.log('positions', positions);
    for (var i = 0; i < coffees.length; i++) {
        //coffees[i].imgObj.position(positions[i]);
        let tween = new Konva.Tween({
            node: coffees[i].imgObj,
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
function closeCoffeeMenu() {
    for (var i = 0; i < coffees.length; i++) {
        let tween = new Konva.Tween({
            node: coffees[i].imgObj,
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
function brewCoffee(index) {
    console.log("Selected", coffees[index].name);
    // TODO:
    // Block menu
    // Play sound
    // Play animation
    setTimeout(function() {
        loadCoffee(index, false);
    }, 2000);
}
