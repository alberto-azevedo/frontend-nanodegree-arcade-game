'use strict';

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -100;
    this.y = randomElement(yPos);
    this.speed = randomElement(speeds);


};
var yPos = [60, 140, 220, 140, 60, 220, 140, 220, 60];
var speeds = [80, 100, 180, 260, 120];

function randomElement(arr) {
    var rand = arr[Math.floor(Math.random() * arr.length)];
    return rand;
}

Enemy.prototype.getImg = function() {
    return Resources.get(this.sprite);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;
    // check off screen
    if (this.x > 505) { // check bounds
        this.x = 2;
        newBug(this);
    }
    //check collision
    if (collides(player, this)) {
        failureSnd.play();
        //pause = true; // debug
        player.reset();
    }

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(this.getImg(), this.x, this.y);
};

// get sprite x,y coord of rigth botton
Enemy.prototype.getBoxCoord = function() {
    var img = this.getImg();
    var r = this.x + img.width; // x rigth
    var b = this.y + img.height; // y botton
    return {
        r: r,
        b: b
    };
};

// player
// constants
var PLAYER_INIT_X = 2;
var PLAYER_INIT_Y = 420;
var PLAYER_X_STEP = 100;
var PLAYER_Y_STEP = 80;

var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.spriteImg = this.getImg();
    this.x = PLAYER_INIT_X;
    this.y = PLAYER_INIT_Y;
    this.speed = PLAYER_X_STEP;
    this.score = 0;
};

Player.prototype.reset = function(x, y) {
    this.x = PLAYER_INIT_X;
    this.y = PLAYER_INIT_Y;
    this.speed = PLAYER_X_STEP;
};

Player.prototype.getImg = function() {
    return Resources.get(this.sprite);
};

Player.prototype.update = function() {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    if (typeof xmove !== 'undefined' && xmove !== null && xmove !== 0) {
        //console.log("x:"+this.x)
        this.x = this.x + xmove;
        if (this.x > 480) { // check bounds , rigth
          this.x = 420;
        }
        if (this.x < -20) { // check bounds , left
            this.x = -16;
        }
        xmove = 0;
    }
    if (typeof ymove !== 'undefined' && ymove !== null && ymove !== 0) {
        //console.log("y:"+this.y)
        if (this.y + ymove <= 436) { // check bounds
            this.y = this.y + ymove;
        }
        ymove = 0;
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var xmove = 0;
var ymove = 0;

Player.prototype.handleInput = function(key) {
    if (key === "space") { // for debug
        pause = !pause;
        console.log("pause?" + pause);
    }
    if (key === "left") {
        xmove = -PLAYER_X_STEP;
        //console.log("x:" + this.x);
    }
    if (key === "up") {
        ymove = -PLAYER_Y_STEP;
    }
    if (key === "right") {
        xmove = PLAYER_X_STEP;
    }
    if (key === "down") {
        ymove = PLAYER_Y_STEP;
    }
};


Player.prototype.render = function() {
    if (this.y >= 20) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    if (this.y <= 20) {
        //console.log("player x,y:" + this.x +","+this.y + "ymove:" + ymove);
        this.reset();
        this.score++;
        sucSnd.play();
    }
    showScore();
};

// get sprite x,y coord of rigth botton
Player.prototype.getBoxCoord = function() {
    var img = this.getImg();
    var r = this.x + img.width;
    var b = this.y + img.height;
    //console.log("getBoxCoord x,y:" + this.x + "," + this.y + " (r,b):"+r + "," + r);
    return {
        r: r,
        b: b
    };
};

function newBug(toRemove) {
    for (var bug in allEnemies) {
        if (allEnemies[bug] === toRemove) {
            //console.log("should die " + bug);
            allEnemies.splice(bug, 1); //rip
            allEnemies.push(new Enemy()); // add new one
        }
    }
}

function collides(pl, eny) {
    var x, y, r, b, x2, y2, r2, b2 = 0;
    x = pl.x;
    y = pl.y + 62;
    r = pl.getBoxCoord().r;
    b = pl.getBoxCoord().b - 50;
    x2 = eny.x;
    y2 = eny.y + 76;
    r2 = eny.getBoxCoord().r - 26;
    b2 = eny.getBoxCoord().b - 26;

    // collision code adapted from http://jlongster.com/Making-Sprite-based-Games-with-Canvas

    var collision = !(r - 29 <= x2 || x + 29 > r2 ||
        b <= y2 || y > b2);
    // if (collision) {
    //   console.log("r - 17:"+ (r - 17) + " x2:"+x2);
    //   console.log("x + 19:"+ (x + 19) + " r2:"+r2);
    //   console.log("b:"+ b + " y2:"+y2);
    //   console.log("y:"+ y + " b2:"+b2);
    // }
    return collision;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player


// wave files from http://www.wavsource.com.
var failureSnd = new Audio("sounds/blip.wav");
var sucSnd = new Audio("sounds/chime.wav");

function showScore() {
    ctx.font = "25px Verdana";
    ctx.fillText("Score:" + player.score, 10, 90);
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.

// keypress not working with chrome :(
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        0: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    //console.log("e.keyCode" + e.keyCode);
    player.handleInput(allowedKeys[e.keyCode]);
});


var allEnemies = [];
var pause = false;
allEnemies.push(new Enemy());
allEnemies.push(new Enemy());
allEnemies.push(new Enemy());
var player = new Player();
