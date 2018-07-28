// Coffee draggables begin on coffeeLayer
// They will be moved to tempLayer during the interaction
// All droppables will exist on fgLayer
// TODO: springback & re-layer if no suitable drop target

var tempLayer = new Konva.Layer();
stage.add(tempLayer);
tempLayer.moveDown();   // topmost except for modalLayer

var previousShape = null;
var inDrag = null;

stage.on("dragstart", function(e) {
    e.target.moveTo(tempLayer);
    inDrag = e.target;
    console.log('TempLayering ' + e.target.name());
    fgLayer.draw();
});

// Define the dragenter, dragleave and dragover behaviours that can occur
// on every event of the dragmove cycle
// IS THIS NECESSARY?
stage.on("dragmove", function(evt) {
    var pos = stage.getPointerPosition();
    var shape = fgLayer.getIntersection(pos);
    if (previousShape && shape) {
        if (previousShape !== shape) {
            // leave from old target
            previousShape.fire('dragleave', {
                type : 'dragleave',
                target : previousShape,
                evt : evt.evt
            }, true);

            // enter new target
            shape.fire('dragenter', {
                type : 'dragenter',
                target : shape,
                evt : evt.evt
            }, true);
            previousShape = shape;
        } else {
            previousShape.fire('dragover', {
                type : 'dragover',
                target : previousShape,
                evt : evt.evt
            }, true);
        }
    } else if (!previousShape && shape) {
        previousShape = shape;
        shape.fire('dragenter', {
            type : 'dragenter',
            target : shape,
            evt : evt.evt
        }, true);
    } else if (previousShape && !shape) {
        previousShape.fire('dragleave', {
            type : 'dragleave',
            target : previousShape,
            evt : evt.evt
        }, true);
        previousShape = undefined;
    }
});

// Cause a drop event to fire if a shape is below the pointer when dragend fires:
stage.on("dragend", function(e) {
    var pos = stage.getPointerPosition();
    var shape = fgLayer.getIntersection(pos);
    if (shape) {
        previousShape.fire('drop', {
            type : 'drop',
            target : previousShape,
            evt : e.evt
        }, true);
    }
    else {
        stage.fire('drop', {
            type : 'drop',
            target : previousShape,
            evt : e.evt
        }, true);
    }
    previousShape = undefined;
    e.target.moveTo(fgLayer);
    fgLayer.draw();
    tempLayer.draw();
});

// Notify when a shape is dropped on (depends on previous definition)
stage.on("drop", function(e) {
    console.log('dropped sth on', e.target.attrs.name);
    performDrop(inDrag, e.target);
});

// Do stuff when A dropped on B:
function performDrop(draggable, droppable) {
    if (!draggable) console.error('Nothing dragged?');

    var parentObj;
    if (draggable.hasName('coffee')) parentObj = GAME.activeCoffee;
    else if (draggable.hasName('treat')) parentObj = GAME.activeTreat;
    console.log("Parent Obj", parentObj);

    if (droppable.hasName('coder')) {
        // Regex match the Konva.Image namelist against coders' first names:
        var coder = coders.filter(c => droppable.attrs.name.match(c.fname))[0];
        console.log("Coder", coder);
        console.log(draggable, "dropped on", coder);

        if (draggable.hasName('coffee')) {
            coder.addCoffee(GAME.activeCoffee);
            GAME.activeCoffee = null;
        }
        else if (draggable.hasName('treat')) {
            coder.addSugar(GAME.activeTreat);
            GAME.activeTreat = null;
        }
        inDrag.destroy();
        tempLayer.draw();
        coffeeLayer.draw();
        fgLayer.draw();
    }
    else {  // not a coder
        parentObj.springBack(); // return to origin (animate?)
        draggable.moveTo(coffeeLayer);
    }
}