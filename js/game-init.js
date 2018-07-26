// Begin game:
loadLevel(0);
play();

function play() {
    // Game loop iterates in quarter-second steps to keep load light:
    GAME.loop = setInterval(() => {
        for (c of coders) {
            c.tick();
            //c.log();
        }
        updateScores();
    
        GAME.timeLeft -= 0.25;
        if (GAME.timeLeft * 4 % 4 === 0) console.warn(`${GAME.timeLeft} seconds`);
        
        // Check for level success:
        if (GAME.loc >= GAME.target.loc && GAME.bugs < GAME.target.bugs) {
            pause();
            showMessage('Goal reached!');
            if (GAME.level === 10) gameOver('won');
            else {
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
    if (result == 'lost') {
        showMessage("Game Over");
    }
    else if (result == 'won') {
        showMessage("Hurrah!");
    }
}
