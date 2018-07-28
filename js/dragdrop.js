// Coffee & Treat draggables begin on coffeeLayer
// They will be moved to tempLayer during the interaction
// All droppables will exist on fgLayer

var tempLayer = new Konva.Layer();
stage.add(tempLayer);
tempLayer.moveDown();   // topmost except for modalLayer

var previousShape = null;
var inDrag = null;

/*
stage.on("dragstart", function(e) {
    e.target.moveTo(tempLayer);
    inDrag = e.target;
    console.log('TempLayering ' + e.target.name());
    coffeeLayer.draw();
});
*/
// Define the dragenter, dragleave and dragover behaviours that can occur
// on every event of the dragmove cycle
// IS THIS NECESSARY?
/*
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
*/
// Cause a drop event to fire if a shape is below the pointer when dragend fires:
stage.on("dragend", function(e) {
    var pos = stage.getPointerPosition();
    var shape = fgLayer.getIntersection(pos);
    /*
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
    */
    stage.fire('drop', {
        type: 'drop',
        target: shape,
        evt: e.evt
    }, true);
    //e.target.moveTo(coffeeLayer);
    coffeeLayer.draw();
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
        console.log(parentObj.name, "dropped on", coder.name);

        if (draggable.hasName('coffee')) {
            coder.addCoffee(GAME.activeCoffee);
            GAME.activeCoffee = null;
        }
        else if (draggable.hasName('treat')) {
            coder.addSugar(GAME.activeTreat);
            GAME.activeTreat = null;
        }
        // Dsetroy coffee or treat:
        inDrag.destroy();
        inDrag = null;
        // Refresh scene:
        tempLayer.draw();
        coffeeLayer.draw();
        fgLayer.draw();
    }
    else {  // not a coder
        parentObj.springBack(); // return to origin (animate?)
        draggable.moveTo(coffeeLayer);
    }
}