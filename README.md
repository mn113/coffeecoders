## Live link

[Play the game](https://mn3monic.itch.io/coffee-coders) - it takes under 5 minutes.

## About

**Coffee Coders** is a browser-based 2D office simulation game. It was programmed in 8 days for [Itch.io's Coffee Jam](https://itch.io/jam/coffee-jam). The object of the game is to manage a team of coders, fuelling them with coffee and snacks to ensure that they deliver sufficient lines of code by their deadline, without being overwhelmed by bugs.

![Screenshot](https://raw.githubusercontent.com/mn113/coffeecoders/master/doc/shot3.png)

## Technology

The game uses [Konva.js](https://konvajs.github.io/) to render multiple layers of the scene to an HTML canvas. Konva extends the functionality of the canvas object, adding events, layers, animations and a range of drawing tools.

Integrated with the rendering code is some object-oriented Javascript using ES6 classes (the game's source has not been transpiled for pre-ES6 browsers).

The game loop is a simple `setInterval` and the roguelike stats-based core of the game mechanic uses plain and simple addition and subtraction.

## Assets

Graphics were derived from free-usage works by [no2games](https://opengameart.org/users/no2games), [Naarshakta](https://opengameart.org/users/naarshakta), [DiceBear avatars](https://github.com/DiceBear/avatars) and [Barista Icons](https://www.smashingmagazine.com/2016/03/freebie-barista-iconset-50-icons-eps-png-svg/). Anything extra was created in Photoshop.

Sounds were found on [FreeSound.org](https://www.freesound.org) and edited with Audacity.

The overall size of the game's assets is:
- code: 44KB
- graphics: 154KB
- sound: 3.7MB

## Feedback

Please [Raise an issue](issues/) or post a comment over at [Itch.io](https://mn3monic.itch.io/coffee-coders).

## Licence

The code in this repo is released under an [AGPLv3](https://choosealicense.com/licenses/agpl-3.0/) licence.