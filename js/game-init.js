function play() {
    // Game loop iterates in quarter-second steps to keep load light:
    GAME.loop = setInterval(() => {
        for (c of coders) {
            c.tick();
        }
        updateScores();

        if (GAME.activeTreat === null && Math.random() > 0.9) {
            displayRandomTreat();
        }
    
        GAME.timeLeft -= 0.25;
        if (GAME.timeLeft * 4 % 4 === 0) console.log(`${GAME.timeLeft} seconds`);
        
        // Check for level success:
        if (GAME.loc >= GAME.target.loc && GAME.bugs < GAME.target.bugs) {
            pause();
            if (GAME.level === 10) gameOver('won');
            else {
                showMessage({
                    heading: 'Level passed!',
                    subtext: 'A new coder joins the team...',
                    autoCancel: true
                });
                sounds.play('levelup');
                loadLevel(GAME.level += 1);    // new coder hired here
                play();
            }
        }
        // Check for time up:
        else if (GAME.timeLeft <= 0) {
            pause();
            gameOver('lost');
        }
    }, 250);    
}

function pause() {
    clearInterval(GAME.loop);
}

function gameOver(result) {
    sounds.setMusic(false);
    sounds.setTyping(false);

    if (result == 'lost') {
        showMessage({
            heading: "Game Over",
            subtext: `The project was not delivered on time.
${100 * GAME.caffeineConsumed}mg of caffeine were consumed.`,
            button: {
                text: "Retry",
                action: function() {
                    document.location.reload()
                }
            },
            autoCancel: false
        });
        sounds.play('gameover');
    }
    else if (result == 'won') {
        showMessage({
            heading: "Hurrah!",
            subtext: `The project was completed on time and can be shipped! (You beat the game!)
${100 * GAME.caffeineConsumed}mg of caffeine were consumed.
Best of luck in your next endeavour.`,
            autoCancel: false
        });
        sounds.play('triumph');
    }
}

/* Options {
    heading: String,
    subtext: String,
    button: Object,
    autoCancel: Boolean
}*/
function showMessage(options) {
    console.warn(options.heading);

    // Build a modal dialog out of a Rect, Texts and a Button:
    var messageGroup = new Konva.Group();
    var bg = new Konva.Rect({
        x: 120,
        y: 100,
        width: 240,
        height: 120,
        fill: 'white',
        stroke: '#333',
        strokeWidth: 1,
        cornerRadius: 4
    });
    var h1 = new Konva.Text({
        x: 130,
        y: 110,
        width: 220,
        align: 'center',
        fontSize: 20,
        fontVariant: 'bold',
        text: options.heading
    });
    var p = new Konva.Text({
        x: 130,
        y: 140,
        width: 220,
        align: 'center',
        fontSize: 12,
        text: options.subtext
    });
    messageGroup.add(bg, h1, p);

    if (options.button) messageGroup.add(makeButton(options.button));

    if (options.autoCancel) {
        setTimeout(function() {
            console.log("autoCancelled message");
            modalLayer.clear().destroyChildren();
            modalLayer.draw();
        }, 1500);
    }

    modalLayer.add(messageGroup);
    modalLayer.draw();
}

function makeButton(options) {
    var button = new Konva.Label({
        x: 210,
        y: 180
    });
    var tag = new Konva.Tag({
        width: 60,
        pointerDirection: 'none',
        cornerRadius: 4,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 1
    });
    var text = new Konva.Text({
        text: options.text,
        padding: 5,
        width: 60,
        align: 'center',
        fill: 'white'
    });
    button.add(tag, text);

    button
    .on('mouseover', function() {
        document.body.style.cursor = 'pointer';
        tag.setFill('limegreen');
    })
    .on('mouseout', function() {
        document.body.style.cursor = 'default';
        tag.setFill('green');
    })
    .on('click', function() {
        console.log("Clicked button");
        options.action();
    });
    
    return button;
}

// Begin the game with a modal message:
showMessage({
    heading: "Welcome",
    subtext: "to Coffee Coders, a software project\nmanagement simulation.",
    button: {
        text: "Play!",
        action: function() {
            modalLayer.clear().destroyChildren();
            modalLayer.draw();
            menuLayer.draw();
            loadLevel(0);
            sounds.play('coin');
            sounds.setMusic(true);
            sounds.setTyping(true);
            play();
        }
    },
    autoCancel: false
});

// TODO:
// Key inputs:
// 1-7 generate coffees
// QWER
// ASDF
// ZXCV deliver to the 12 desks
// and P to pause/resume
