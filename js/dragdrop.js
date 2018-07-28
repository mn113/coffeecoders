// Coffee draggables begin on coffeeLayer
// They will be moved to tempLayer during the interaction
// All droppables will exist on fgLayer
// TODO: springback & re-layer if no suitable drop target

var tempLayer = new Konva.Layer();
stage.add(tempLayer);
tempLayer.moveDown();   // topmost but one

var previousShape;

stage.on("dragstart", function(e){
    e.target.moveTo(tempLayer);
    console.log('TempLayering ' + e.target.name());
    fgLayer.draw();
});

// Define the dragenter, dragleave and dragover behaviours that can occur
// on every event of the dragmove cycle
stage.on("dragmove", function(evt){
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
stage.on("dragend", function(e){
    var pos = stage.getPointerPosition();
    var shape = fgLayer.getIntersection(pos);
    if (shape) {
        previousShape.fire('drop', {
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
/*
// Notify when a shape is dragged into
stage.on("dragenter", function(e){
    e.target.fill('green');
    console.log('dragenter ' + e.target.name());
    fgLayer.draw();
});

// Notify when a shape is dragged out of
stage.on("dragleave", function(e){
    e.target.fill('blue');
    console.log('dragleave ' + e.target.name());
    fgLayer.draw();
});

// Notify when a shape is dragged over
stage.on("dragover", function(e){
    console.log('dragover ' + e.target.name());
    fgLayer.draw();
});
*/

// Notify when a shape is dropped on (depends on previous definition)
stage.on("drop", function(e){
    console.log('drop ' + e.target.name());
    // Check for illegal drop:
    if (!e.target.hasName('coder')) tempLayer.destroyAllChildren();
    fgLayer.draw();
});
